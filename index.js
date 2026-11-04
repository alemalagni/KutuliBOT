require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.once('ready', () => {
    console.log(`Loggato come ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content === '!ciao') msg.reply('Ciao!');
});

client.login(process.env.DISCORD_TOKEN);