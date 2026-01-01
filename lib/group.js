const config = require('../config');

module.exports = {
  pattern: ['add', 'remove', 'kick', 'promote', 'demote'],
  desc: 'Group participant management',
  isGroup: true,
  isAdmin: true,
  botAdmin: true,
  execute: async (ctx) => {
    const { sock, msg, from, command, args, reply } = ctx;
    
    if (!msg.message.extendedTextMessage && args.length === 0) {
      return reply(`❌ Please mention or reply to a user!`);
    }
    
    let users = [];
    if (msg.message.extendedTextMessage?.contextInfo?.mentionedJid) {
      users = msg.message.extendedTextMessage.contextInfo.mentionedJid;
    } else if (msg.message.extendedTextMessage?.contextInfo?.participant) {
      users = [msg.message.extendedTextMessage.contextInfo.participant];
    } else if (args[0]) {
      users = [args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net'];
    }
    
    if (users.length === 0) {
      return reply('❌ No valid user found!');
    }
    
    try {
      switch (command) {
        case 'add':
          await sock.groupParticipantsUpdate(from, users, 'add');
          reply(`✅ Successfully added ${users.length} user(s)!`);
          break;
          
        case 'remove':
        case 'kick':
          await sock.groupParticipantsUpdate(from, users, 'remove');
          reply(`✅ Successfully removed ${users.length} user(s)!`);
          break;
          
        case 'promote':
          await sock.groupParticipantsUpdate(from, users, 'promote');
          reply(`✅ Successfully promoted ${users.length} user(s) to admin!`);
          break;
          
        case 'demote':
          await sock.groupParticipantsUpdate(from, users, 'demote');
          reply(`✅ Successfully demoted ${users.length} admin(s)!`);
          break;
      }
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
