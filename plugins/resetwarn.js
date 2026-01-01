module.exports = {
  pattern: 'resetwarn',
  desc: 'Reset user warnings',
  isGroup: true,
  isAdmin: true,
  execute: async (ctx) => {
    const { msg, from, reply } = ctx;
    const db = getDB();
    
    let user;
    if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (msg.message.extendedTextMessage?.contextInfo?.participant) {
      user = msg.message.extendedTextMessage.contextInfo.participant;
    } else {
      return reply('❌ Please mention or reply to a user!');
    }
    
    db.run('DELETE FROM warnings WHERE jid = ? AND user = ?', [from, user], (err) => {
      if (err) {
        reply('❌ Error resetting warnings!');
      } else {
        reply(`✅ Warnings reset for @${user.split('@')[0]}`);
      }
    });
  }
};
