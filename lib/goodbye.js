module.exports = {
  pattern: 'goodbye',
  desc: 'Toggle goodbye messages',
  isGroup: true,
  isAdmin: true,
  execute: async (ctx) => {
    const { from, args, reply } = ctx;
    const db = getDB();
    
    if (args[0] === 'on') {
      db.run('INSERT OR REPLACE INTO groups (jid, goodbye) VALUES (?, 1)', [from]);
      reply('✅ Goodbye messages enabled!');
    } else if (args[0] === 'off') {
      db.run('UPDATE groups SET goodbye = 0 WHERE jid = ?', [from]);
      reply('❌ Goodbye messages disabled!');
    } else {
      reply('Usage: .goodbye on/off');
    }
  }
};
