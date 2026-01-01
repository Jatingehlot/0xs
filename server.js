// ============================================
// FILE: session.js - Run this locally to generate SESSION_ID
// ============================================
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function generateSession() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║   LEVANTER-X SESSION GENERATOR         ║');
  console.log('╚════════════════════════════════════════╝\n');
  
  const method = await question('Choose pairing method:\n1. QR Code\n2. Pairing Code\n\nEnter choice (1 or 2): ');
  
  const { state, saveCreds } = await useMultiFileAuthState('./auth_session');
  const { version } = await fetchLatestBaileysVersion();
  
  const sock = makeWASocket({
    version,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: method === '1',
    auth: state,
    browser: ['Levanter-X', 'Chrome', '1.0.0']
  });
  
  if (method === '2') {
    if (!sock.authState.creds.registered) {
      const phoneNumber = await question('\nEnter your WhatsApp number (with country code, no + or spaces):\nExample: 1234567890\n\nNumber: ');
      
      setTimeout(async () => {
        try {
          const code = await sock.requestPairingCode(phoneNumber.trim());
          console.log('\n╔════════════════════════════════════════╗');
          console.log(`║   PAIRING CODE: ${code}              ║`);
          console.log('╚════════════════════════════════════════╝\n');
          console.log('1. Open WhatsApp on your phone');
          console.log('2. Go to Settings → Linked Devices');
          console.log('3. Tap "Link a Device"');
          console.log('4. Select "Link with phone number"');
          console.log('5. Enter the code above\n');
        } catch (err) {
          console.error('Error requesting pairing code:', err);
        }
      }, 3000);
    }
  }
  
  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'open') {
      console.log('\n✅ Connected successfully!\n');
      console.log('⏳ Generating session ID...\n');
      
      // Wait a bit for credentials to be fully saved
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Read auth files and create session ID
      try {
        const authPath = './auth_session';
        const creds = JSON.parse(fs.readFileSync(path.join(authPath, 'creds.json'), 'utf8'));
        
        // Create session object
        const sessionData = {
          creds: creds,
          version: version
        };
        
        // Convert to base64
        const sessionId = Buffer.from(JSON.stringify(sessionData)).toString('base64');
        
        // Save to file
        fs.writeFileSync('./SESSION_ID.txt', sessionId);
        
        console.log('╔════════════════════════════════════════════════════════════════╗');
        console.log('║                    SESSION ID GENERATED                        ║');
        console.log('╚════════════════════════════════════════════════════════════════╝\n');
        console.log('Your SESSION_ID has been saved to: SESSION_ID.txt\n');
        console.log('Copy the entire content and paste it in your panel\'s SESSION_ID environment variable.\n');
        console.log('Session ID Preview (first 100 chars):');
        console.log(sessionId.substring(0, 100) + '...\n');
        console.log('✅ You can now deploy your bot to any panel!\n');
        
        process.exit(0);
      } catch (err) {
        console.error('❌ Error generating session:', err);
        process.exit(1);
      }
    }
    
    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      
      if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
        console.log('\n❌ Connection closed. Please run the script again.\n');
      }
      
      if (!shouldReconnect) {
        process.exit(1);
      }
    }
  });
}

generateSession().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

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

// ============================================
// FILE: package.json - UPDATED
// ============================================
{
  "name": "levanter-x-bot",
  "version": "2.0.0",
  "description": "Enhanced WhatsApp Bot with Advanced Group Management",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "session": "node session.js",
    "dev": "nodemon index.js"
  },
  "keywords": ["whatsapp", "bot", "baileys", "group-management"],
  "author": "Your Name",
  "license": "MIT",
  "dependencies": {
    "@whiskeysockets/baileys": "^6.5.0",
    "express": "^4.18.2",
    "dotenv": "^16.0.3",
    "pino": "^8.11.0",
    "sqlite3": "^5.1.6",
    "qrcode-terminal": "^0.12.0",
    "axios": "^1.4.0",
    "moment-timezone": "^0.5.43",
    "wa-sticker-formatter": "^4.4.4"
  },
  "devDependencies": {
    "nodemon": "^2.0.22"
  }
}

// ============================================
// FILE: .env.example - UPDATED
// ============================================


// ============================================
// FILE: config.js - UPDATED
// ============================================
require('dotenv').config();

module.exports = {
  // Bot Configuration
  SESSION_ID: process.env.SESSION_ID || '',
  PREFIX: process.env.PREFIX || '.',
  BOT_NAME: process.env.BOT_NAME || 'Levanter-X',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '1234567890',
  OWNER_NAME: process.env.OWNER_NAME || 'Owner',
  
  // Group Settings
  ANTILINK: process.env.ANTILINK === 'true',
  ANTILINK_ACTION: process.env.ANTILINK_ACTION || 'kick',
  WELCOME: process.env.WELCOME === 'true',
  GOODBYE: process.env.GOODBYE === 'true',
  ANTIDELETE: process.env.ANTIDELETE === 'true',
  ANTITAG: process.env.ANTITAG === 'true',
  
  // Auto Features
  AUTO_READ: process.env.AUTO_READ === 'true',
  AUTO_STATUS_VIEW: process.env.AUTO_STATUS_VIEW === 'true',
  AUTO_TYPING: process.env.AUTO_TYPING === 'true',
  AUTO_RECORDING: process.env.AUTO_RECORDING === 'true',
  
  // Bot Mode
  MODE: process.env.MODE || 'public',
  
  // API Keys
  OPENAI_API: process.env.OPENAI_API || '',
  WEATHER_API: process.env.WEATHER_API || '',
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL || './database.db',
  
  // Server
  PORT: process.env.PORT || 3000,
  
  // Admin Commands
  SUDO: process.env.SUDO ? process.env.SUDO.split(',') : [],
  
  // Time Zone
  TIMEZONE: process.env.TIMEZONE || 'Africa/Lagos'
};
