const axios=require('axios'),config=require('../../config')
const ytmp3={description:'Download YT audio',category:'download',execute:async(m)=>{
  const url=m.args[0]||m.text;if(!url||!url.includes('youtube'))return m.reply('🎵 *YTMP3*
Cara: *'+config.command.prefix+'ytmp3* <link youtube>')
  await m.react('⏳');await m.reply('⬇️ _Downloading audio..._')
  try{const r=await axios.get('https://api.lolhuman.xyz/api/ytmp3?apikey='+(config.APIkey?.lolhuman||'demo')+'&url='+url)
    const d=r.data?.result;if(!d?.link)return m.reply('❌ Gagal download')
    const a=await axios.get(d.link,{responseType:'arraybuffer',timeout:60000});await m.replyAudio(Buffer.from(a.data));await m.react('✅')}
  catch(e){await m.react('❌');await m.reply('❌ '+e.message)}}}
const ytmp4={description:'Download YT video',category:'download',execute:async(m)=>{
  const url=m.args[0]||m.text;if(!url||!url.includes('youtube'))return m.reply('🎬 *YTMP4*
Cara: *'+config.command.prefix+'ytmp4* <link youtube>')
  await m.react('⏳');await m.reply('⬇️ _Downloading video..._')
  try{const r=await axios.get('https://api.lolhuman.xyz/api/ytmp4?apikey='+(config.APIkey?.lolhuman||'demo')+'&url='+url)
    const d=r.data?.result;if(!d?.link)return m.reply('❌ Gagal download')
    const v=await axios.get(d.link,{responseType:'arraybuffer',timeout:120000});await m.replyVideo(Buffer.from(v.data),'🎬 Vyn MD');await m.react('✅')}
  catch(e){await m.react('❌');await m.reply('❌ '+e.message)}}}
const tiktok={description:'Download TikTok',category:'download',execute:async(m)=>{
  const url=m.args[0]||m.text;if(!url||!url.includes('tiktok'))return m.reply('🎵 *TIKTOK*
Cara: *'+config.command.prefix+'tiktok* <link tiktok>')
  await m.react('⏳');await m.reply('⬇️ _Downloading TikTok..._')
  try{const r=await axios.post('https://www.tikwm.com/api/',{url},{headers:{'Content-Type':'application/x-www-form-urlencoded'}})
    const d=r.data?.data;if(!d?.play)return m.reply('❌ Gagal download TikTok')
    const v=await axios.get(d.play,{responseType:'arraybuffer',timeout:60000})
    await m.replyVideo(Buffer.from(v.data),'🎵 *TIKTOK*
@'+(d.author?.unique_id||'-')+'
'+(d.title?.substring(0,50)||'-'));await m.react('✅')}
  catch(e){await m.react('❌');await m.reply('❌ '+e.message)}}}
module.exports={ytmp3,ytmp4,tiktok}
