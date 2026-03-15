/**
 * VYN MD - Configuration
 * Developer: Vyn
 * JANGAN HAPUS CREDITS!
 */
const config = {
    owner: {
        name: 'Vyn',
        number: ['6288290168581']  // Ganti dengan nomor owner (format: 628xxx)
    },
    session: {
        pairingNumber: '6288290168581',  // Nomor WA yang akan di-pair
        usePairingCode: true
    },
    bot: { name: '𝗩𝗬𝗡 𝗠𝗗', version: '1.0.0', developer: 'Vyn' },
    mode: 'public',
    command: { prefix: '.' },
    limits: { default: 20, premium: 100, owner: -1 },
    sticker: { packname: 'Vyn-MD', author: 'Vyn' },
    features: { antiSpam: true, antiSpamInterval: 3000, antiCall: false, autoTyping: true, autoRead: false, logMessage: true },
    APIkey: { openweather: '', newsapi: '' },
    timezone: 'Asia/Jakarta',
    messages: {
        wait: '⏳ *Chotto matte…* _Sedang diproses ya~_',
        success: '✅ *Yatta!*',
        error: '❌ *Error desu!*',
        ownerOnly: '🚫 *Owner Only!*',
        premiumOnly: '💎 *Premium Only!*',
        groupOnly: '👥 *Group Only!*',
        privateOnly: '📱 *Private Only!*',
        adminOnly: '👮 *Admin Only!*',
        botAdminOnly: '🤖 *Bot Butuh Admin!*',
        limitExceeded: '📊 *Limit Habis!*',
        banned: '🚫 *Banned!*'
    },
    premiumUsers: [],
    bannedUsers: [],
    database: { path: './database' }
}
function isOwner(n){if(!n)return false;const c=n.replace(/[^0-9]/g,'');return config.owner.number.some(o=>{const co=o.replace(/[^0-9]/g,'');return c===co||c.endsWith(co)||co.endsWith(c)})}
function isPremium(n){if(!n)return false;if(isOwner(n))return true;const c=n.replace(/[^0-9]/g,'');return config.premiumUsers.some(p=>{const cp=p.replace(/[^0-9]/g,'');return c===cp||c.endsWith(cp)||cp.endsWith(c)})}
function isBanned(n){if(!n)return false;if(isOwner(n))return false;const c=n.replace(/[^0-9]/g,'');return config.bannedUsers.some(b=>{const cb=b.replace(/[^0-9]/g,'');return c===cb||c.endsWith(cb)||cb.endsWith(c)})}
function setBotNumber(n){if(n)config.bot.number=n.replace(/[^0-9]/g,'')}
module.exports={...config,config,isOwner,isPremium,isBanned,setBotNumber}
