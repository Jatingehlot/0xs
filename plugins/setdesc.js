module.exports = {
  pattern: ['setdesc', 'setdescription'],
  desc: 'Change group description',
  isGroup: true,
  isAdmin: true,
  botAdmin: true,
  execute: async (ctx) => {
    const { sock, from, args, reply } = ctx;
    
    if (args.length === 0) {
      return reply('❌ Please provide a description!');
    }
    
    try {
      await sock.groupUpdateDescription(from, args.join(' '));
      reply('✅ Group description updated!');
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
