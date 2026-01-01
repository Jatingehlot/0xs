module.exports = {
  pattern: 'hidetag',
  desc: 'Send hidden tagged message',
  isGroup: true,
  isAdmin: true,
  execute: async (ctx) => {
    const { sock, from, args, reply } = ctx;
    
    if (args.length === 0) {
      return reply('❌ Please provide a message!');
    }
    
    try {
      const metadata = await sock.groupMetadata(from);
      const participants = metadata.participants.map(p => p.id);
      
      await sock.sendMessage(from, {
        text: args.join(' '),
        mentions: participants
      });
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
