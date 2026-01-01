const { getPlugins } = require('../lib/plugins');

module.exports = {
  pattern: ['menu', 'help', 'commands'],
  desc: 'Get bot command list',
  execute: async (ctx) => {
    const { reply, pushname } = ctx;
    const plugins = getPlugins();
    
    const categories = {
      group: [],
      admin: [],
      utility: [],
      fun: [],
      owner: []
    };
    
    plugins.forEach(plugin => {
      const cmd = Array.isArray(plugin.pattern) ? plugin.pattern[0] : plugin.pattern;
      const category = plugin.isAdmin ? 'admin' : plugin.isGroup ? 'group' : 'utility';
      
      if (!categories[category].includes(cmd)) {
        categories[category].push(cmd);
      }
    });
    
    let menu = `*╭─「 ${config.BOT_NAME} 」*\n`;
    menu += `│ *Hi, ${pushname}!*\n`;
    menu += `│ *Prefix:* ${config.PREFIX}\n`;
    menu += `╰────────────\n\n`;
    
    if (categories.group.length > 0) {
      menu += `*╭─「 👥 GROUP 」*\n`;
      categories.group.forEach(cmd => {
        menu += `│ • ${config.PREFIX}${cmd}\n`;
      });
      menu += `╰────────────\n\n`;
    }
    
    if (categories.admin.length > 0) {
      menu += `*╭─「 ⚡ ADMIN 」*\n`;
      categories.admin.forEach(cmd => {
        menu += `│ • ${config.PREFIX}${cmd}\n`;
      });
      menu += `╰────────────\n\n`;
    }
    
    if (categories.utility.length > 0) {
      menu += `*╭─「 🔧 UTILITY 」*\n`;
      categories.utility.forEach(cmd => {
        menu += `│ • ${config.PREFIX}${cmd}\n`;
      });
      menu += `╰────────────\n\n`;
    }
    
    menu += `_Type ${config.PREFIX}help <command> for details_`;
    
    reply(menu);
  }
};
