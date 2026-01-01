module.exports = {
  pattern: ['groupinfo', 'ginfo', 'gcinfo'],
  desc: 'Get group information',
  isGroup: true,
  execute: async (ctx) => {
    const { sock, from, reply } = ctx;
    
    try {
      const metadata = await sock.groupMetadata(from);
      
      const admins = metadata.participants.filter(p => p.admin).length;
      const members = metadata.participants.length;
      const desc = metadata.desc || 'No description';
      
      let info = `*📋 GROUP INFO*\n\n`;
      info += `*Name:* ${metadata.subject}\n`;
      info += `*Members:* ${members}\n`;
      info += `*Admins:* ${admins}\n`;
      info += `*Created:* ${new Date(metadata.creation * 1000).toLocaleDateString()}\n`;
      info += `*Description:* ${desc}\n`;
      
      reply(info);
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
