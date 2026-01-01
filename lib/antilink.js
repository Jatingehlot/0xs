const { getDB } = require('../lib/database');

module.exports = {
  pattern: 'antilink',
  desc: 'Toggle antilink protection',
  isGroup: true,
  isAdmin: true,
  execute: async (ctx) => {
    const { from, args, reply } = ctx;
    const db = getDB();
    
    if (args[0] === 'on') {
      db.run('INSERT OR REPLACE INTO groups (jid, antilink) VALUES (?, 1)', [from]);
      reply('✅ Antilink enabled! Group links will be deleted.');
    } else if (args[0] === 'off') {
      db.run('UPDATE groups SET antilink = 0 WHERE jid = ?', [from]);
      reply('❌ Antilink disabled!');
    } else {
      reply('Usage: .antilink on/off');
    }
  }
};

// Auto-delete links (add to message handler)
async function checkAntilink(ctx) {
  const { sock, msg, from, sender, isGroup } = ctx;
  if (!isGroup) return;
  
  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
  const linkRegex = /(https?:\/\/chat\.whatsapp\.com\/[^\s]+)/gi;
  
  if (linkRegex.test(text)) {
    const db = getDB();
    const group = await new Promise((resolve) => {
      db.get('SELECT antilink FROM groups WHERE jid = ?', [from], (err, row) => {
        resolve(row);
      });
    });
    
    if (group?.antilink) {
      const metadata = await sock.groupMetadata(from);
      const participant = metadata.participants.find(p => p.id === sender);
      
      if (!participant?.admin) {
        await sock.sendMessage(from, { delete: msg.key });
        await sock.sendMessage(from, { 
          text: `❌ @${sender.split('@')[0]} Group links are not allowed!`,
          mentions: [sender]
        });
      }
    }
  }
}
