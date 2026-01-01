require('dotenv').config();

module.exports = {
  // Bot Configuration
  SESSION_ID: process.env.SESSION_ID || '',
  PREFIX: process.env.PREFIX || '.',
  BOT_NAME: process.env.BOT_NAME || '0xS Bot',
  OWNER_NUMBER: process.env.OWNER_NUMBER || '919664413727',
  OWNER_NAME: process.env.OWNER_NAME || 'Owner',
  
  // Group Settings
  ANTILINK: process.env.ANTILINK === 'false',
  ANTILINK_ACTION: process.env.ANTILINK_ACTION || 'kick',
  WELCOME: process.env.WELCOME === 'false',
  GOODBYE: process.env.GOODBYE === 'false',
  ANTIDELETE: process.env.ANTIDELETE === 'false',
  ANTITAG: process.env.ANTITAG === 'false',
  
  // Auto Features
  AUTO_READ: process.env.AUTO_READ === 'true',
  AUTO_STATUS_VIEW: process.env.AUTO_STATUS_VIEW === 'flase',
  AUTO_TYPING: process.env.AUTO_TYPING === 'true',
  AUTO_RECORDING: process.env.AUTO_RECORDING === 'false',
  
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
  TIMEZONE: process.env.TIMEZONE || 'Asia/Kolkata'
};
