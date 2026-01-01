# 🤖 Levanter-X Bot

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

**Enhanced WhatsApp Bot with Advanced Group Management & Pairing Code System**

</div>

## ✨ Features

### 🎯 Core Features
- ✅ **Pairing Code System** - Easy setup with phone number pairing
- 🌐 **Web Dashboard** - Beautiful web interface to display pairing code
- 🔐 **Secure Authentication** - Multi-file auth state management
- ⚡ **Fast & Efficient** - Built on Baileys (WhatsApp Web API)
- 📱 **Multi-Mode** - Public, Private, or Group-only modes

### 👥 Group Management
- **Add/Remove Members** - Manage group participants
- **Promote/Demote** - Admin management
- **Group Settings** - Lock/unlock, mute/unmute groups
- **Anti-Link Protection** - Auto-delete WhatsApp group links
- **Welcome/Goodbye Messages** - Greet new members and say goodbye
- **Tag All** - Mention all group members
- **Hide Tag** - Send hidden tagged messages
- **Warning System** - Warn users (auto-kick after 3 warnings)
- **Group Info** - Detailed group information
- **Admin List** - List all group admins
- **Set Description** - Change group description
- **Set Name** - Change group name

### 🛠️ Utility Commands
- **Sticker Maker** - Create stickers from images/videos
- **AFK Mode** - Set away from keyboard status
- **Delete Messages** - Delete bot messages
- **Ping** - Check bot response time
- **Alive** - Bot status and uptime
- **Menu** - Command list with categories
- **Broadcast** - Send messages to all groups (owner only)

### 🎮 Additional Features
- Auto-read messages
- Auto-view status
- Auto-typing indicator
- Database support (SQLite)
- Custom prefix
- Multi-admin support (SUDO)
- Ban system

## 📋 Prerequisites

- Node.js (v18 or higher)
- Git
- WhatsApp account
- Basic terminal knowledge

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/levanter-x-bot.git
cd levanter-x-bot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your details:

```env
# Bot Configuration
SESSION_ID=
PREFIX=.
BOT_NAME=Levanter-X
OWNER_NUMBER=1234567890  # Your WhatsApp number (without +)
OWNER_NAME=Your Name

# Group Features
ANTILINK=false
WELCOME=true
GOODBYE=true

# Auto Features
AUTO_READ=false
AUTO_STATUS_VIEW=false

# Bot Mode (public/private/group)
MODE=public

# Server Port
PORT=3000

# Admin Numbers (comma separated, without +)
SUDO=1234567890,9876543210

# Timezone
TIMEZONE=Africa/Lagos
```

### 4. Start the Bot

```bash
npm start
```

### 5. Pair Your WhatsApp

1. Open your browser and go to `http://localhost:3000`
2. You'll see a pairing code displayed
3. Open WhatsApp on your phone
4. Go to **Settings → Linked Devices**
5. Tap **Link a Device**
6. Select **Link with phone number instead**
7. Enter the pairing code from the webpage

## 📁 Project Structure

```
levanter-x-bot/
├── index.js              # Main bot file
├── config.js             # Configuration
├── server.js             # Web server for pairing
├── lib/
│   ├── database.js       # Database functions
│   ├── message.js        # Message handler
│   └── plugins.js        # Plugin loader
├── plugins/
│   ├── group.js          # Group management
│   ├── antilink.js       # Anti-link protection
│   ├── tagall.js         # Tag all members
│   ├── hidetag.js        # Hidden tags
│   ├── warn.js           # Warning system
│   ├── groupinfo.js      # Group information
│   ├── admins.js         # Admin list
│   ├── setdesc.js        # Set description
│   ├── setname.js        # Set group name
│   ├── sticker.js        # Sticker maker
│   ├── afk.js            # AFK mode
│   ├── alive.js          # Status check
│   ├── menu.js           # Command menu
│   ├── delete.js         # Delete messages
│   ├── ping.js           # Ping command
│   └── broadcast.js      # Broadcast messages
├── auth/                 # Authentication data
├── database.db           # SQLite database
├── package.json          # Dependencies
├── .env                  # Environment variables
└── README.md            # Documentation
```

## 📖 Commands

### Group Management Commands (Admin Only)

| Command | Description | Usage |
|---------|-------------|-------|
| `.add` | Add member to group | `.add @user` or `.add 1234567890` |
| `.kick` | Remove member from group | `.kick @user` |
| `.promote` | Promote member to admin | `.promote @user` |
| `.demote` | Demote admin to member | `.demote @user` |
| `.mute` | Close group (only admins can send) | `.mute` |
| `.unmute` | Open group (everyone can send) | `.unmute` |
| `.tagall` | Tag all members | `.tagall message` |
| `.hidetag` | Send hidden tagged message | `.hidetag message` |
| `.warn` | Warn a user | `.warn @user reason` |
| `.resetwarn` | Reset user warnings | `.resetwarn @user` |
| `.antilink on/off` | Toggle anti-link protection | `.antilink on` |
| `.welcome on/off` | Toggle welcome messages | `.welcome on` |
| `.goodbye on/off` | Toggle goodbye messages | `.goodbye on` |
| `.setname` | Change group name | `.setname New Name` |
| `.setdesc` | Change group description | `.setdesc New Description` |

### Group Info Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `.groupinfo` | Get group information | `.groupinfo` |
| `.admins` | List all group admins | `.admins` |

### Utility Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `.menu` | Show all commands | `.menu` |
| `.alive` | Check bot status | `.alive` |
| `.ping` | Check response time | `.ping` |
| `.sticker` | Create sticker | Reply to image/video with `.sticker` |
| `.afk` | Set AFK status | `.afk reason` |
| `.delete` | Delete bot message | Reply to bot message with `.delete` |

### Owner Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `.broadcast` | Broadcast to all groups | `.broadcast message` |

## 🔧 Configuration Options

### Bot Modes

- **`public`** - Anyone can use the bot
- **`private`** - Only owner and SUDO users can use
- **`group`** - Bot only works in groups

### Anti-Link Actions

- **`kick`** - Remove user who sends group link
- **`warn`** - Warn user who sends group link
- **`delete`** - Only delete the message

### Auto Features

- **`AUTO_READ`** - Auto-read all messages
- **`AUTO_STATUS_VIEW`** - Auto-view WhatsApp statuses
- **`AUTO_TYPING`** - Show typing indicator
- **`AUTO_RECORDING`** - Show recording indicator

## 🌐 Deployment

### Deploy to Heroku

1. Create a Heroku account
2. Install Heroku CLI
3. Login to Heroku:
```bash
heroku login
```

4. Create new app:
```bash
heroku create your-bot-name
```

5. Set environment variables:
```bash
heroku config:set OWNER_NUMBER=1234567890
heroku config:set PREFIX=.
# Add other variables
```

6. Deploy:
```bash
git push heroku main
```

### Deploy to Railway

1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your repository
5. Add environment variables in settings
6. Deploy!

### Deploy to Render

1. Go to [Render.com](https://render.com)
2. Create new "Web Service"
3. Connect your repository
4. Set environment variables
5. Deploy!

## 🛡️ Security Tips

1. **Never share your `.env` file**
2. **Add `.env` to `.gitignore`**
3. **Use strong admin passwords**
4. **Regularly update dependencies**
5. **Monitor bot logs for suspicious activity**
6. **Use SUDO feature carefully**

## 🐛 Troubleshooting

### Bot not connecting?
- Check your internet connection
- Verify OWNER_NUMBER is correct (no + sign)
- Delete `auth` folder and reconnect
- Check Node.js version (≥18)

### Commands not working?
- Check if prefix is correct
- Verify bot is admin (for admin commands)
- Check bot mode in `.env`
- Review logs for errors

### Database errors?
- Delete `database.db` and restart
- Check file permissions
- Verify SQLite is installed

### Pairing code not showing?
- Check PORT is not in use
- Verify OWNER_NUMBER is correct
- Check firewall settings
- Try different browser

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Creating Custom Plugins

Create a new file in `plugins/` folder:

```javascript
// plugins/mycommand.js
module.exports = {
  pattern: 'mycommand',  // Command trigger
  desc: 'My custom command',  // Description
  isGroup: false,  // Requires group? (optional)
  isAdmin: false,  // Requires admin? (optional)
  botAdmin: false,  // Bot needs admin? (optional)
  execute: async (ctx) => {
    const { reply, args, sender, pushname } = ctx;
    
    // Your command logic here
    reply(`Hello ${pushname}! Args: ${args.join(' ')}`);
  }
};
```

### Available Context Properties

- `sock` - WhatsApp socket connection
- `msg` - Original message object
- `from` - Chat ID
- `sender` - Sender ID
- `pushname` - Sender name
- `text` - Full message text
- `args` - Command arguments array
- `command` - Command name
- `isGroup` - Is group chat?
- `reply(text)` - Reply to message
- `replyWithMention(text, mentions)` - Reply with mentions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [Levanter](https://github.com/lyfe00011/levanter) - Original bot inspiration
- All contributors and supporters

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/Jatingehlot/0xs/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Jatingehlot/0xs/discussions)
- **WhatsApp**: Contact bot owner

## 📊 Status

- ✅ Active Development
- 🔄 Regular Updates
- 🐛 Bug Fixes
- ✨ New Features

---

<div align="center">

**Made with ❤️ by Jatin Gehlot**

⭐ Star this repo if you find it helpful!

</div>
