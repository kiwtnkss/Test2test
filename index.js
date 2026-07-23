const http = require('http');
const WebSocket = require('ws');

const USERNAME = 'rookee';
const PASSWORD = 'Kiw.1598753';

const API_LOGIN_URL = 'https://beta-pixel-path.z234.xyz/login';
const PASSIVE_NODES = [0, 10, 11, 12, 13, 14, 15, 20, 21, 22, 23, 24, 30, 31, 32, 33, 34];
const EQUIP_SLOTS = ["weapon", "helmet", "body", "gloves", "boots", "ring", "amulet"];

async function fetchFreshToken() {
    try {
        const response = await fetch(API_LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://beta-pixel-path.z234.xyz',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            },
            body: JSON.stringify({ username: USERNAME, password: PASSWORD })
        });
        const data = await response.json();
        if (response.ok && data.token) {
            console.log(`🔑 [GitHub Cloud] ล็อกอินสำเร็จ! ได้รับ Token สำหรับ: ${USERNAME}`);
            return data.token;
        } else {
            console.error("❌ ล็อกอินไม่สำเร็จ:", data.error);
            return null;
        }
    } catch (err) {
        console.error("❌ เชื่อมต่อระบบล็อกอินไม่ได้:", err.message);
        return null;
    }
}

async function startCloudBot() {
    console.log("🚀 [GitHub Cloud 24/7] กำลังเริ่มต้นทำงาน...");
    const token = await fetchFreshToken();
    if (!token) {
        setTimeout(startCloudBot, 10000);
        return;
    }

    const wsUrl = `wss://beta-pixel-path.z234.xyz/ws?token=${token}`;
    const wsOptions = {
        headers: {
            'Origin': 'https://beta-pixel-path.z234.xyz',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
    };

    const ws = new WebSocket(wsUrl, wsOptions);
    let lastMove = null;

    ws.on('open', function() {
        console.log("✅ [GitHub Cloud 24/7] เชื่อมต่อเข้าสู่เกมสำเร็จ! บอทเริ่มฟาร์มเรียบร้อยแล้ว");

        setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
                // Auto Rebirth
                ws.send(JSON.stringify({ move: lastMove, rebirth: true }));
                // Auto Passive
                PASSIVE_NODES.forEach(nodeId => {
                    ws.send(JSON.stringify({ move: lastMove, alloc: nodeId }));
                });
                // Auto Forge
                EQUIP_SLOTS.forEach(slot => {
                    ws.send(JSON.stringify({ move: lastMove, forge: slot }));
                });
            }
        }, 2000);
    });

    ws.on('close', function() {
        console.log("⚠️ การเชื่อมต่อหลุด! กำลังล็อกอินขอ Token ใหม่ใน 5 วินาที...");
        setTimeout(startCloudBot, 5000);
    });

    ws.on('error', function(err) {
        console.error("❌ ข้อผิดพลาด WebSocket:", err.message);
    });
}

const port = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('ok');
        return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

server.listen(port, () => {
    console.log(`🌐 Server listening on port ${port}`);
});

startCloudBot();
const https = require('https');

// สั่งให้สคริปต์ยิงปิงเรียก URL ตัวเองทุกๆ 10 นาที (600,000 ms)
const RENDER_URL = 'https://test2test-xkjg.onrender.com/';

setInterval(() => {
    https.get(RENDER_URL, (res) => {
        console.log(`⏰ [Self-Ping] สะกิดเว็บ Render สำเร็จ (Status: ${res.statusCode}) - ทำงาน 24/7 ไม่หลับ`);
    }).on('error', (err) => {
        console.error("❌ [Self-Ping Error]:", err.message);
    });
}, 600000); // 600,000 ms = 10 นาที
