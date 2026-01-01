// ============================================
// FILE: plugins/tagall.js
// ============================================
module.exports = {
  pattern: ['tagall', 'all', 'mention'],
  desc: 'Tag all group members',
  isGroup: true,
  isAdmin: true,
  execute: async (ctx) => {
    const { sock, from, args, reply } = ctx;
    
    try {
      const metadata = await sock.groupMetadata(from);
      const participants = metadata.participants.map(p => p.id);
      
      const message = args.join(' ') || 'Attention Everyone!';
      const mentions = participants;
      
      let text = `*${message}*\n\n`;
      participants.forEach((jid, i) => {
        text += `${i + 1}. @${jid.split('@')[0]}\n`;
      });
      
      await sock.sendMessage(from, { text, mentions });
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
