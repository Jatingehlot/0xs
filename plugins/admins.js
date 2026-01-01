module.exports = {
  pattern: ['admins', 'adminlist'],
  desc: 'Get list of group admins',
  isGroup: true,
  execute: async (ctx) => {
    const { sock, from, reply } = ctx;
    
    try {
      const metadata = await sock.groupMetadata(from);
      const admins = metadata.participants.filter(p => p.admin);
      
      let text = `*👑 GROUP ADMINS*\n\n`;
      admins.forEach((admin, i) => {
        const role = admin.admin === 'superadmin' ? '👑 Owner' : '⚡ Admin';
        text += `${i + 1}. ${role} @${admin.id.split('@')[0]}\n`;
      });
      
      await sock.sendMessage(from, {
        text,
        mentions: admins.map(a => a.id)
      });
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
