const { getDB } = require('../lib/database');

module.exports = {
  pattern: 'welcome',
  desc: 'Toggle welcome messages',
  isGroup: true,
  isAdmin: true,
  execute: async (ctx) => {
    const { from, args, reply } = ctx;
    const db = getDB();
    
    if (args[0] === 'on') {
      db.run('INSERT OR REPLACE INTO groups (jid, welcome) VALUES (?, 1)', [from]);
      reply('✅ Welcome messages enabled!');
    } else if (args[0] === 'off') {
      db.run('UPDATE groups SET welcome = 0 WHERE jid = ?', [from]);
      reply('❌ Welcome messages disabled!');
    } else {
      reply('Usage: .welcome on/off');
    }
  }
};
