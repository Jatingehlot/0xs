

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
