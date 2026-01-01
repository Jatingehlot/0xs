

// ============================================
// FILE: plugins/afk.js
// ============================================
const { getDB } = require('../lib/database');

module.exports = {
  pattern: 'afk',
  desc: 'Set AFK status',
  execute: async (ctx) => {
    const { sender, args, reply } = ctx;
    const db = getDB();
    
    const reason = args.join(' ') || 'No reason';
    
    db.run('INSERT OR REPLACE INTO users (jid, afk, afk_reason) VALUES (?, 1, ?)',
      [sender, reason], (err) => {
        if (err) {
          reply('❌ Error setting AFK status!');
        } else {
          reply(`✅ AFK mode activated!\nReason: ${reason}`);
        }
      });
  }
};
