// ============================================
// FILE: plugins/warn.js
// ============================================
const { getDB } = require('../lib/database');

module.exports = {
  pattern: ['warn', 'warning'],
  desc: 'Warn a user',
  isGroup: true,
  isAdmin: true,
  botAdmin: true,
  execute: async (ctx) => {
    const { sock, msg, from, args, reply, sender } = ctx;
    const db = getDB();
    
    let user;
    if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      user = msg.message.extendedTextMessage.contextInfo.mentionedJid[0];
    } else if (msg.message.extendedTextMessage?.contextInfo?.participant) {
      user = msg.message.extendedTextMessage.contextInfo.participant;
    } else {
      return reply('❌ Please mention or reply to a user!');
    }
    
    const reason = args.slice(1).join(' ') || 'No reason provided';
    
    // Get current warnings
    db.get('SELECT count FROM warnings WHERE jid = ? AND user = ?', [from, user], async (err, row) => {
      const count = (row?.count || 0) + 1;
      
      if (count >= 3) {
        // Kick user after 3 warnings
        await sock.groupParticipantsUpdate(from, [user], 'remove');
        db.run('DELETE FROM warnings WHERE jid = ? AND user = ?', [from, user]);
        await sock.sendMessage(from, {
          text: `⚠️ @${user.split('@')[0]} has been kicked after 3 warnings!`,
          mentions: [user]
        });
      } else {
        // Add warning
        db.run('INSERT OR REPLACE INTO warnings (jid, user, reason, count) VALUES (?, ?, ?, ?)',
          [from, user, reason, count]);
        
        await sock.sendMessage(from, {
          text: `⚠️ Warning ${count}/3\n\n@${user.split('@')[0]}\nReason: ${reason}`,
          mentions: [user]
        });
      }
    });
  }
};
