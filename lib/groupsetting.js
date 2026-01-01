module.exports = {
  pattern: ['mute', 'unmute', 'lock', 'unlock', 'open', 'close'],
  desc: 'Group settings control',
  isGroup: true,
  isAdmin: true,
  botAdmin: true,
  execute: async (ctx) => {
    const { sock, from, command, reply } = ctx;
    
    try {
      if (command === 'mute' || command === 'close' || command === 'lock') {
        await sock.groupSettingUpdate(from, 'announcement');
        reply('🔒 Group is now closed. Only admins can send messages.');
      } else {
        await sock.groupSettingUpdate(from, 'not_announcement');
        reply('🔓 Group is now open. Everyone can send messages.');
      }
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
