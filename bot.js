const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--no-zygote',
            '--single-process'
        ]
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('--- NUEVO QR GENERADO ---');
});

client.on('ready', () => {
    console.log('--- BOT ACTIVO Y ESCUCHANDO ---');
});

client.on('message_create', async msg => {
    const mensajeRecibido = msg.body.toLowerCase();
    if (mensajeRecibido.includes('beneficios') || mensajeRecibido.includes('descuentos') || mensajeRecibido.includes('transporte')) {
        const respuesta = `*Beneficios de Transporte sin NFC (Octubre)* 🚌🚗\n\n• *Santander:* 50% de reintegro en Colectivos/Subtes con QR Transporte (tope $8.000). 30% en Cabify martes y viernes.\n\n• *Galicia:* 35% en Cabify (domingos), 35% en Uber (miércoles), 20% en Taxi Premium (lun/mar).\n\n• *Mercado Pago:* Hasta 70% en QR Transporte (tope $5.000, solo si tenés el cupón activo).\n\n• *Banco Provincia:* 12 cuotas sin interés en pasajes de larga distancia.`;
        await msg.reply(respuesta);
    }
});

client.initialize();
