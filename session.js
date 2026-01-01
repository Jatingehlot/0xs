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
