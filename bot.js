const { Client, LocalAuth } = require('whatsapp-web.js');
const http = require('http');

let ultimoQR = '';

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

// Guardamos el código QR limpio para la página web
client.on('qr', (qr) => {
    ultimoQR = qr;
    console.log('========================================================');
    console.log('¡LINK GENERADO! ENTRÁ ACÁ DESDE TU MAC PARA VER EL QR:');
    console.log('https://onrender.com');
    console.log('========================================================');
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

// Creamos un servidor web que dibuja el QR como una imagen nítida
const server = http.createServer((req, res) => {
    if (req.url === '/qr' && ultimoQR) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`
            <html>
            <body style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100vh; font-family:sans-serif; background:#f0f2f5;">
                <div style="background:white; padding:30px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1); text-align:center;">
                    <h2 style="color:#128c7e; margin-bottom:20px;">Escaneá este QR con tu iPhone</h2>
                    <div id="qrcode" style="display:inline-block;"></div>
                    <p style="margin-top:20px; color:#666; font-size:14px;">La página se actualiza sola para mantener el QR fresco.</p>
                </div>
                <script src="https://cloudflare.com"></script>
                <script>
                    new QRCode(document.getElementById("qrcode"), {
                        text: "${ultimoQR}",
                        width: 256,
                        height: 256
                    });
                    setTimeout(() => { location.reload(); }, 20000);
                </script>
            </body>
            </html>
        `);
    } else {
        res.writeHead(404);
        res.end('Cargando el bot... Si iniciaste recién, esperá 1 minuto y recargá la página.');
    }
});

// Render usa el puerto 10000 para abrir servicios web hacia internet
server.listen(10000, () => {
    client.initialize();
});
