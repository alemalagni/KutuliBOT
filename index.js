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
        msg.reply(`Oggi ich ${oggi.giorno}/${oggi.mese}/${oggi.anno}`)
    }
});

/* Ottieni data del giorno */
function dataOggi() {
    const now = Date.now()

    const minute = 60 * 1000; // 60 secondi * 1000 ms
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;
    const year = 365 * day;

    let anno = Math.floor(now / year);
    let mese = Math.floor((now - year) / month)
    let giorno = Math.floor(((now - year) - month) / day)
    return [giorno, mese, anno]
}

client.login(process.env.DISCORD_TOKEN);