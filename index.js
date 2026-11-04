require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Loggato come ${client.user.tag}`);
});

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content === 'k!ciao') msg.reply(`Guten Tag ${msg.author.globalName}!`);
    if (msg.content === 'k!oggi') {
        const oggi = dataOggi()
        msg.reply(`Oggi ist ${oggi.giorno}/${oggi.mese}/${oggi.anno}`)
    }
});

/* Ottieni data del giorno */
function dataOggi() {
    const now = new Date();
    return {
        giorno: now.getDate(),
        mese: now.getMonth() + 1,
        anno: now.getFullYear()
    };
}

client.login(process.env.DISCORD_TOKEN);