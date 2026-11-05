require('dotenv').config();
const cron = require('node-cron');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Loggato come ${client.user.tag}`);
    console.log('Versione 0.2.1')
});

client.on('messageCreate', msg => {
    if (msg.author.bot) return;
    if (msg.content === 'k!ciao') msg.reply(`Guten Tag ${msg.author.globalName}!`);
    if (msg.content === 'k!oggi') {
        const oggi = dataOggi()
        msg.reply(`Oggi ist ${oggi.giorno}/${oggi.mese}/${oggi.anno}`)
    }
    if (msg.content === 'k!profilo') msg.reply(
        //profileCanvas(msg.author.id)
        'Purtroppo ci stiamo ancora lavorando'
    )
});

// Ottieni data del giorno
function dataOggi() {
    const now = new Date();
    return {
        giorno: now.getDate(),
        mese: now.getMonth() + 1,
        anno: now.getFullYear()
    };
}

// --- Controllo chat vocale ---
const timer = 15 * 60 * 1000;

let timerSolitudine = null;

client.on('voiceStateUpdate', () => {
    const canaleTesto = client.channels.cache.get(process.env.ORAZIUS_ID);
    const canaleVocale = client.channels.cache.get(process.env.BIG_LEAGUES_ID);

    // --- controllo "da solo da troppo tempo" ---
    if (canaleVocale.members.size === 1) {
        // è rimasta/o esattamente una persona: avvia il timer
        const soloMember = canaleVocale.members.first();
        timerSolitudine = setTimeout(() => {
            if (canaleVocale.members.size === 1) {
                canaleTesto.send(`🎙️ <@${soloMember.id}> aspetta da **15 minuten** in **${canaleVocale.name}**! Non fare l'🧃 entra in chat`);
            }
        }, timer);
    } else {
        // non è più solo (o il canale è vuoto): annulla il timer se attivo
        if (timerSolitudine) {
            clearTimeout(timerSolitudine);
            timerSolitudine = null;
        }
    }
});

// Controllo gufi in chat vocale
cron.schedule('30 06 * * *', () => {
    const canaleVocale = client.channels.cache.get('778165040872161306');
    const presenti = canaleVocale.members.map(m => m.id);

    if (presenti.length > 0) {
        const canaleTesto = "778165040872161303";
        const menzioni = presenti.map(p => `<@${p}>`).join(' ');
        canaleTesto.send(`${menzioni} sono le **06:30** del morgen! Ist tempo di andaren a nanna!`);
    }
})

// Compleanni
// Non ancora implementato, non voglio metterli pubblici su GitHub. Poi ci penserò a come fare

// --- Immagini ---
function profileCanvas(utente) {
    async () => {
        // crea il canvas (riquadro) di 700 x 250 pixel
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        // Ottengo avatar
        const { body } = await request(utente.displayAvatarURL({ extension: 'jpg' }));
        const avatar = await Canvas.loadImage(await body.arrayBuffer());

        context.drawImage(avatar, 25, 0, 200, 200); // posizione x, posizione y, lunghezza, altezza

    }
}

client.login(process.env.DISCORD_TOKEN);