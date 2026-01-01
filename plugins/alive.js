const config = require('../config');

module.exports = {
  pattern: ['alive', 'bot', 'status'],
  desc: 'Check if bot is alive',
  execute: async (ctx) => {
    const { reply, sock } = ctx;
    
    const uptime = process.uptime();
    const hours = Math.floor(uptime / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    const status = `*🤖 ${config.BOT_NAME} STATUS*\n\n` +
                  `✅ Bot is running!\n` +
                  `⏱️ Uptime: ${hours}h ${minutes}m ${seconds}s\n` +
                  `📱 Platform: WhatsApp\n` +
                  `🔧 Mode: ${config.MODE}\n` +
                  `👤 Owner: ${config.OWNER_NAME}`;
    
    reply(status);
  }
};
