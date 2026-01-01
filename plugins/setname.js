module.exports = {
  pattern: ['setname', 'setsubject'],
  desc: 'Change group name',
  isGroup: true,
  isAdmin: true,
  botAdmin: true,
  execute: async (ctx) => {
    const { sock, from, args, reply } = ctx;
    
    if (args.length === 0) {
      return reply('❌ Please provide a name!');
    }
    
    try {
      await sock.groupUpdateSubject(from, args.join(' '));
      reply('✅ Group name updated!');
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
