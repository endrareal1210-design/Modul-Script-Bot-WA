// Import Module
require('./config')
require('./database/Menu/mainmenu')
const fs = require('fs');
const axios = require('axios');

// Import Scrape
const Ai4Chat = require('./scrape/Ai4Chat');
const tiktok2 = require('./scrape/Tiktok');

module.exports = async (mithril, m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
    const sender = msg.key.remoteJid;
    const pushname = msg.pushName || "Mithril";
    const args = body.slice(1).trim().split(" ");
    const command = args.shift().toLowerCase();
    const q = args.join(" ");

    if (!body.startsWith(prefix)) return;

    const mithrialreply = (teks) => mithril.sendMessage(sender, { text: teks }, { quoted: msg });
    const isGroup = sender.endsWith('@g.us');
    const isAdmin = (admin.includes(sender))
    const menuImage = fs.readFileSync(image);

switch (command) {

// Menu
case "menu": {
    await mithril.sendMessage(sender,
        {
            image: menuImage,
            caption: mithrulmenu,
            mentions: [sender]
        },
    { quoted: msg }
    )
}
break

// Hanya Admin
case "admin": {
    if (!isAdmin) return mithrialreply(mess.admin); // Contoh Penerapan Hanya Admin
    mithrialreply("🎁 *Kamu Adalah Admin*"); // Admin Akan Menerima Pesan Ini
}
break

// Hanya Group
case "group": {
    if (!isGroup) return mithrialreply(mess.group); // Contoh Penerapan Hanya Group
    mithrialreply("🎁 *Kamu Sedang Berada Di Dalam Grup*"); // Pesan Ini Hanya Akan Dikirim Jika Di Dalam Grup
}
break

// AI Chat
case "ai": {
    if (!q) return mithrialreply("☘️ *Contoh:* !ai Apa itu JavaScript?");
        mithrialreply(mess.wait);
    try {
        const mithrilai = await Ai4Chat(q);
            await mithrialreply(`*Mithril AI*\n\n${mithrilai}`);
                } catch (error) {
            console.error("Error:", error);
        mithrialreply(mess.error);
    }
}
break;

case "ttdl": {
    if (!q) return mithrialreply("⚠ *Mana Link Tiktoknya?*");
        mithrialreply(mess.wait);
    try {
        const result = await tiktok2(q); // Panggil Fungsi Scraper

            // Kirim Video
            await mithril.sendMessage(
                sender,
                    {
                        video: { url: result.no_watermark },
                        caption: `*🎁 Mithril Tiktok Downloader*`
                    },
                { quoted: msg }
            );

        } catch (error) {
            console.error("Error TikTok DL:", error);
        mithrialreply(mess.error);
    }
}
break;

case "igdl": {
    if (!q) return mithrialreply("⚠ *Mana Link Instagramnya?*");
    try {
        mithrialreply(mess.wait);

        // Panggil API Velyn
        const apiUrl = `https://www.velyn.biz.id/api/downloader/instagram?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.data.url[0]) {
            throw new Error("Link tidak valid atau API error");
        }

        const data = response.data.data;
        const mediaUrl = data.url[0];
        const metadata = data.metadata;

        // Kirim Media
        if (metadata.isVideo) {
            await mithril.sendMessage(
                sender,
                    {
                        video: { url: mediaUrl },
                        caption: `*Instagram Reel*\n\n` +
                            `*Username :* ${metadata.username}\n` +
                            `*Likes :* ${metadata.like.toLocaleString()}\n` +
                            `*Comments :* ${metadata.comment.toLocaleString()}\n\n` +
                            `*Caption :* ${metadata.caption || '-'}\n\n` +
                            `*Source :* ${q}`
                    },
                    { quoted: msg }
                );
        } else {
            await mithril.sendMessage(
                sender,
                    {
                        image: { url: mediaUrl },
                        caption: `*Instagram Post*\n\n` +
                            `*Username :* ${metadata.username}\n` +
                            `*Likes :* ${metadata.like.toLocaleString()}\n\n` +
                            `*Caption :* ${metadata.caption || '-'}`
                    },
                    { quoted: msg }
                );
            }

        } catch (error) {
            console.error("Error Instagram DL:", error);
        mithrialreply(mess.error);
    }
}
break;

// Game Tebak Angka
case "tebakangka": {
    const target = Math.floor(Math.random() * 100);
        mithril.tebakGame = { target, sender };
    mithrialreply("*Tebak Angka 1 - 100*\n*Ketik !tebak [Angka]*");
}
break;

case "tebak": {
    if (!mithril.tebakGame || mithril.tebakGame.sender !== sender) return;
        const guess = parseInt(args[0]);
    if (isNaN(guess)) return mithrialreply("❌ *Masukkan Angka!*");

    if (guess === mithril.tebakGame.target) {
        mithrialreply(`🎉 *Tebakkan Kamu Benar!*`);
            delete mithril.tebakGame;
        } else {
            mithrialreply(guess > mithril.tebakGame.target ? "*Terlalu Tinggi!*" : "*Terlalu rendah!*");
    }
}
break;

case "quote": {
    const quotes = [
        "Jangan menyerah, hari buruk akan berlalu.",
        "Kesempatan tidak datang dua kali.",
        "Kamu lebih kuat dari yang kamu kira.",
        "Hidup ini singkat, jangan sia-siakan."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    mithrialreply(`*Quote Hari Ini :*\n_"${randomQuote}"_`);
}
break;

        default: { mithrialreply(mess.default) }
    }
}