const config = require('../config');

module.exports = {
  pattern: 'broadcast',
  desc: 'Broadcast message to all groups',
  execute: async (ctx) => {
    const { sock, sender, args, reply } = ctx;
    
    if (sender !== config.OWNER_NUMBER + '@s.whatsapp.net') {
      return reply('❌ This command is only for the bot owner!');
    }
    
    if (args.length === 0) {
      return reply('❌ Please provide a message to broadcast!');
    }
    
    const message = args.join(' ');
    const groups = await sock.groupFetchAllParticipating();
    const groupIds = Object.keys(groups);
    
    reply(`📢 Broadcasting to ${groupIds.length} groups...`);
    
    let success = 0;
    let failed = 0;
    
    for (const id of groupIds) {
      try {
        await sock.sendMessage(id, { text: `*📢 BROADCAST*\n\n${message}` });
        success++;
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch {
        failed++;
      }
    }
    
    reply(`✅ Broadcast complete!\nSuccess: ${success}\nFailed: ${failed}`);
  }
};
