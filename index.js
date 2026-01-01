

// ============================================
// FILE: index.js - UPDATED FOR PANEL DEPLOYMENT
// ============================================
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, makeInMemoryStore, makeCacheableSignalKeyStore, BufferJSON } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const config = require('./config');
const { loadPlugins } = require('./lib/plugins');
const { handleMessages } = require('./lib/message');
const { initDatabase } = require('./lib/database');

const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) });

// Function to load session from SESSION_ID
async function loadSession() {
  const authPath = './auth';
  
  if (!fs.existsSync(authPath)) {
    fs.mkdirSync(authPath, { recursive: true });
  }
  
  // Check if SESSION_ID is provided
  if (config.SESSION_ID && config.SESSION_ID.length > 50) {
    try {
      console.log('📂 Loading session from SESSION_ID...');
      
      // Decode base64 session
      const sessionData = JSON.parse(Buffer.from(config.SESSION_ID, 'base64').toString('utf8'));
      
      // Save creds.json
      const credsPath = path.join(authPath, 'creds.json');
      fs.writeFileSync(credsPath, JSON.stringify(sessionData.creds, null, 2));
      
      console.log('✅ Session loaded successfully!');
    } catch (err) {
      console.error('❌ Invalid SESSION_ID format:', err.message);
      console.log('\n⚠️  Please generate a new SESSION_ID using: npm run session\n');
      process.exit(1);
    }
  }
  
  return await useMultiFileAuthState(authPath);
}

async function startBot() {
  console.log('🚀 Starting Levanter-X Bot...');
  
  // Initialize database
  await initDatabase();
  
  // Load session
  const { state, saveCreds } = await loadSession();
  const { version, isLatest } = await fetchLatestBaileysVersion();
  
  console.log(`📱 Using WA v${version.join('.')}, isLatest: ${isLatest}`);
  
  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'silent' }))
    },
    browser: ['Levanter-X', 'Chrome', '1.0.0'],
    markOnlineOnConnect: true,
    generateHighQualityLinkPreview: true,
    getMessage: async (key) => {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg?.message || undefined;
      }
      return { conversation: 'Hello' };
    }
  });
  
  store.bind(sock.ev);
  
  // Load all plugins
  await loadPlugins();
  console.log('✅ Plugins loaded successfully');
  
  // Connection updates
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('❌ Connection closed. Reconnecting:', shouldReconnect);
      
      if (shouldReconnect) {
        setTimeout(() => startBot(), 3000);
      } else {
        console.log('❌ Logged out. Please generate new SESSION_ID');
        process.exit(1);
      }
    } else if (connection === 'open') {
      console.log('✅ Bot connected successfully!');
      console.log(`📱 Bot Number: ${sock.user.id.split(':')[0]}`);
    }
  });
  
  // Save credentials
  sock.ev.on('creds.update', saveCreds);
  
  // Handle messages
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    await handleMessages(sock, messages);
  });
  
  // Group participants update
  sock.ev.on('group-participants.update', async (update) => {
    const { id, participants, action } = update;
    
    try {
      const metadata = await sock.groupMetadata(id);
      const groupName = metadata.subject;
      const db = require('./lib/database').getDB();
      
      for (const participant of participants) {
        if (action === 'add') {
          // Check welcome setting
          db.get('SELECT welcome FROM groups WHERE jid = ?', [id], async (err, row) => {
            if (row?.welcome || config.WELCOME) {
              const welcomeMsg = `👋 *Welcome to ${groupName}!*\n\n@${participant.split('@')[0]}\n\nEnjoy your stay! 🎉`;
              await sock.sendMessage(id, { 
                text: welcomeMsg,
                mentions: [participant]
              });
            }
          });
        } else if (action === 'remove') {
          db.get('SELECT goodbye FROM groups WHERE jid = ?', [id], async (err, row) => {
            if (row?.goodbye || config.GOODBYE) {
              const goodbyeMsg = `👋 *Goodbye* @${participant.split('@')[0]}\n\nTake care! 🌟`;
              await sock.sendMessage(id, { 
                text: goodbyeMsg,
                mentions: [participant]
              });
            }
          });
        }
      }
    } catch (err) {
      console.error('Error handling participant update:', err);
    }
  });
  
  // Auto read messages
  if (config.AUTO_READ) {
    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (msg.key && msg.key.remoteJid) {
          await sock.readMessages([msg.key]);
        }
      }
    });
  }
  
  // Auto view status
  if (config.AUTO_STATUS_VIEW) {
    sock.ev.on('messages.upsert', async ({ messages }) => {
      for (const msg of messages) {
        if (msg.key && msg.key.remoteJid === 'status@broadcast') {
          await sock.readMessages([msg.key]);
        }
      }
    });
  }
  
  return sock;
}

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

// Start the bot
startBot().catch(err => {
  console.error('Failed to start bot:', err);
  process.exit(1);
});
