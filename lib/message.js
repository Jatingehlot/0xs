const config = require('../config');
const { getPlugins } = require('./plugins');
const { getDB } = require('./database');

async function handleMessages(sock, messages) {
  for (const msg of messages) {
    if (!msg.message) continue;
    
    const messageType = Object.keys(msg.message)[0];
    if (messageType === 'protocolMessage' || messageType === 'senderKeyDistributionMessage') continue;
    
    const text = msg.message.conversation || 
                 msg.message.extendedTextMessage?.text || 
                 msg.message.imageMessage?.caption || 
                 msg.message.videoMessage?.caption || '';
    
    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = msg.key.participant || msg.key.remoteJid;
    const pushname = msg.pushName || 'User';
    
    // Check if message starts with prefix
    if (!text.startsWith(config.PREFIX)) continue;
    
    const args = text.slice(config.PREFIX.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    // Check bot mode
    if (config.MODE === 'private' && sender !== config.OWNER_NUMBER + '@s.whatsapp.net') {
      continue;
    }
    
    if (config.MODE === 'group' && !isGroup) {
      continue;
    }
    
    // Check if user is banned
    const db = getDB();
    const user = await new Promise((resolve) => {
      db.get('SELECT * FROM users WHERE jid = ?', [sender], (err, row) => {
        resolve(row);
      });
    });
    
    if (user?.banned) {
      await sock.sendMessage(from, { text: '❌ You are banned from using this bot!' });
      continue;
    }
    
    // Check AFK status
    if (user?.afk) {
      db.run('UPDATE users SET afk = 0, afk_reason = NULL WHERE jid = ?', [sender]);
      await sock.sendMessage(from, { text: `👋 Welcome back, ${pushname}! You're no longer AFK.` });
    }
    
    // Create message context
    const ctx = {
      sock,
      msg,
      from,
      sender,
      pushname,
      text,
      args,
      command,
      isGroup,
      reply: async (text) => await sock.sendMessage(from, { text }, { quoted: msg }),
      replyWithMention: async (text, mentions) => {
        await sock.sendMessage(from, { text, mentions }, { quoted: msg });
      }
    };
    
    // Find and execute plugin
    const plugins = getPlugins();
    for (const plugin of plugins) {
      const pattern = plugin.pattern;
      const match = typeof pattern === 'string' 
        ? command === pattern 
        : pattern instanceof RegExp 
          ? pattern.test(command)
          : pattern.includes(command);
      
      if (match) {
        // Check if command requires group
        if (plugin.isGroup && !isGroup) {
          await ctx.reply('❌ This command can only be used in groups!');
          continue;
        }
        
        // Check if command requires admin
        if (plugin.isAdmin && isGroup) {
          const metadata = await sock.groupMetadata(from);
          const participant = metadata.participants.find(p => p.id === sender);
          if (!participant?.admin && sender !== config.OWNER_NUMBER + '@s.whatsapp.net') {
            await ctx.reply('❌ This command is only for group admins!');
            continue;
          }
        }
        
        // Check if bot needs to be admin
        if (plugin.botAdmin && isGroup) {
          const metadata = await sock.groupMetadata(from);
          const botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
          const botParticipant = metadata.participants.find(p => p.id === botNumber);
          if (!botParticipant?.admin) {
            await ctx.reply('❌ I need to be an admin to use this command!');
            continue;
          }
        }
        
        try {
          await plugin.execute(ctx);
        } catch (err) {
          console.error(`Error executing ${command}:`, err);
          await ctx.reply(`❌ Error: ${err.message}`);
        }
        break;
      }
    }
  }
}

module.exports = { handleMessages };
