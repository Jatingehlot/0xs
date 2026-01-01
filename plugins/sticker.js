const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const { Sticker } = require('wa-sticker-formatter');

module.exports = {
  pattern: ['sticker', 's', 'stickermeme'],
  desc: 'Create sticker from image/video',
  execute: async (ctx) => {
    const { sock, msg, from, reply } = ctx;
    
    const quoted = msg.message.extendedTextMessage?.contextInfo;
    const mediaMsg = quoted ? await sock.loadMessage(from, quoted.stanzaId) : msg;
    
    if (!mediaMsg.message?.imageMessage && !mediaMsg.message?.videoMessage) {
      return reply('❌ Please reply to an image or video!');
    }
    
    try {
      reply('⏳ Creating sticker...');
      
      const buffer = await downloadMediaMessage(mediaMsg, 'buffer', {});
      
      const sticker = new Sticker(buffer, {
        pack: 'Levanter-X',
        author: 'Bot',
        type: 'full',
        quality: 50
      });
      
      const stickerBuffer = await sticker.toBuffer();
      await sock.sendMessage(from, { sticker: stickerBuffer });
    } catch (err) {
      reply(`❌ Error: ${err.message}`);
    }
  }
};
