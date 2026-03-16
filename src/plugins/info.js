const axios=require('axios'),config=require('../../config')
const cuaca={description:'Cek cuaca',category:'info',execute:async(m)=>{
  const kota=m.text?.trim();if(!kota)return m.reply('🌤️ *CUACA*
Cara: *'+config.command.prefix+'cuaca* <kota>')
  await m.react('⏳')
  try{const r=await axios.get('https://wttr.in/'+encodeURIComponent(kota)+'?format=j1')
    const w=r.data.current_condition[0],area=r.data.nearest_area[0]
    await m.reply('🌤️ *CUACA '+kota.toUpperCase()+'*

Kondisi: *'+w.weatherDesc[0].value+'*
Suhu: *'+w.temp_C+'°C* (terasa '+w.FeelsLikeC+'°C)
Humidity: *'+w.humidity+'%*
Angin: *'+w.windspeedKmph+' km/h*
Area: *'+area.areaName[0].value+', '+area.country[0].value+'*

> _Vyn MD • Weather_')
    await m.react('✅')}catch(e){await m.react('❌');if(e.response?.status===404)return m.reply('❌ Kota tidak ditemukan');await m.reply('❌ '+e.message)}}}
const berita={description:'Berita terbaru',category:'info',execute:async(m)=>{
  await m.react('⏳')
  try{const r=await axios.get('https://api.rss2json.com/v1/api.json?rss_url=https://www.cnnindonesia.com/rss')
    const arts=(r.data.items||[]).slice(0,5);if(!arts.length)return m.reply('❌ Gagal ambil berita')
    let text='📰 *BERITA TERBARU*

'
    arts.forEach((a,i)=>{text+='*'+(i+1)+'. '+a.title+'*
🔗 '+a.link+'

'})
    text+='> _Vyn MD • News_'
    await m.reply(text);await m.react('✅')}catch(e){await m.react('❌');await m.reply('❌ '+e.message)}}}
module.exports={cuaca,berita}
