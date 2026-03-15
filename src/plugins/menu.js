const config=require('../../config'),os=require('os'),moment=require('moment-timezone')
const menu={description:'Tampilkan menu',category:'main',limit:false,execute:async(m)=>{
  await m.react('📋')
  const time=moment().tz(config.timezone).format('HH:mm:ss')
  const date=moment().tz(config.timezone).format('DD MMMM YYYY')
  await m.reply('╭┈┈⫡「 ���¤ *'+config.bot.name+'* 」
┃ ◦ Version  : *v'+config.bot.version+'*
┃ ◦ Dev      : *'+config.bot.developer+'*
┃ ◦ Prefix   : *'+config.command.prefix+'*
┃ ◦ Waktu    : *'+time+'*
┃ ◦ Tanggal  : *'+date+'*
╰┈┈⫡

╭┈┈⫡「 🏠 *MAIN* 」
┃ ◦ '+config.command.prefix+'menu
┃ ◦ '+config.command.prefix+'ping
┃ ◦ '+config.command.prefix+'info
┃ ◦ '+config.command.prefix+'owner
╰┈┈⫡

╭┈┈⫡「 🖼️ *STICKER* 」
┃ ◦ '+config.command.prefix+'sticker
┃ ◦ '+config.command.prefix+'toimg
╰┈┈⫡

╭┈┈⫡「 📥 *DOWNLOAD* 」
┃ ◦ '+config.command.prefix+'ytmp3
┃ ◦ '+config.command.prefix+'ytmp4
┃ ◦ '+config.command.prefix+'tiktok
╰┈┈⫡

╭┈┈⫡「 🌤️ *INFO* 」
┃ ◦ '+config.command.prefix+'cuaca
┃ ◦ '+config.command.prefix+'berita
╰┈┈⫡

╭┈┈⫡「 🎮 *GAME* 」
┃ ◦ '+config.command.prefix+'tebakkata
┃ ◦ '+config.command.prefix+'quiz
╰┈┈⫡

╭┈┈⫡「 👥 *GRUP* 」
┃ ◦ '+config.command.prefix+'welcome on/off
┃ ◦ '+config.command.prefix+'kick @tag
┃ ◦ '+config.command.prefix+'tagall
╰┈┈⫡

> _'+config.bot.name+' by '+config.bot.developer+'_')}}
const ping={description:'Cek ping',category:'main',limit:false,execute:async(m)=>{const s=Date.now();await m.react('⏳');const l=Date.now()-s;await m.reply('⚡ *PING*

Latency: *'+l+'ms*');await m.react('✅')}}
const info={description:'Info bot',category:'main',limit:false,execute:async(m)=>{
  const u=process.uptime(),h=Math.floor(u/3600),mn=Math.floor((u%3600)/60),s=Math.floor(u%60)
  const ram=(process.memoryUsage().heapUsed/1024/1024).toFixed(2)
  await m.reply('���¤ *INFO BOT*

Nama: *'+config.bot.name+'*
Version: *v'+config.bot.version+'*
Dev: *'+config.bot.developer+'*
Uptime: *'+h+'j '+mn+'m '+s+'d*
RAM: *'+ram+' MB*')}}
const owner={description:'Info owner',category:'main',limit:false,execute:async(m)=>{await m.reply('👑 *OWNER*

Nama: *'+config.owner.name+'*
Nomor: *+'+config.owner.number[0]+'*')}}
const runtime={description:'Cek runtime',category:'main',limit:false,execute:async(m)=>{const u=process.uptime();await m.reply('⏱️ *RUNTIME*

*'+Math.floor(u/86400)+'* hari *'+Math.floor((u%86400)/3600)+'* jam *'+Math.floor((u%3600)/60)+'* menit *'+Math.floor(u%60)+'* detik

_Bot sudah nyala selama itu desu~_')}}
module.exports={menu,ping,info,owner,runtime}
