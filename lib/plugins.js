const fs = require('fs');
const path = require('path');

const plugins = [];

async function loadPlugins() {
  const pluginDir = path.join(__dirname, '../plugins');
  const files = fs.readdirSync(pluginDir).filter(file => file.endsWith('.js'));
  
  for (const file of files) {
    try {
      const plugin = require(path.join(pluginDir, file));
      if (plugin.pattern) {
        plugins.push(plugin);
        console.log(`✅ Loaded plugin: ${file}`);
      }
    } catch (err) {
      console.error(`❌ Error loading plugin ${file}:`, err);
    }
  }
}

function getPlugins() {
  return plugins;
}

module.exports = { loadPlugins, getPlugins };
