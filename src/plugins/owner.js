const config=require('../../config'),{updateUser}=require('../lib/database')
const broadcast={description:'Broadcast',category:'owner',ownerOnly:true,limit:false,execute:async(m,sock,{store})=>{
  if(!m.text)return m.reply('Cara: .broadcast <pesan>')
  const chats=store?.chats?.all()||[];let ok=0,fail=0
  for(const c of chats){try{await sock.sendMessage(c.id,{text:'📢 *BROADCAST*
'+m.text+'
> _'+config.bot.name+'_'});ok++;await new Promise(r=>setTimeout(r,500))}catch{fail++}}
  await m.reply('✅ Selesai!
Berhasil: *'+ok+'*
Gagal: *'+fail+'*')}}
const addpremium={description:'Add premium',category:'owner',ownerOnly:true,limit:false,execute:async(m)=>{
  let t=m.raw.message?.extendedTextMessage?.contextInfo?.participant||m.quoted?.sender
  if(!t&&m.args[0])t=m.args[0].replace(/[^0-9]/g,'')+'@s.whatsapp.net'
  if(!t)return m.reply('Reply + .addpremium')
  updateUser(t,{premium:true,limit:config.limits.premium});await m.reply('📎 @'+t.split('@')[0]+' jadi premium!',{mentions:[t]})}}
const delpremium={description:'Del premium',category:'owner',ownerOnly:true,limit:false,execute:async(m)=>{
  let t=m.raw.message?.extendedTextMessage?.contextInfo?.participant||m.quoted?.sender
  if(!t&&m.args[0])t=m.args[0].replace(/[^0-9]/g,'')+'@s.whatsapp.net'
  if(!t)return m.reply('Reply + .delpremium')
  updateUser(t,{premium:false,limit:config.limits.default});await m.reply('⬇️ Premium @'+t.split('@')[0]+' dicabut',{mentions:[t]})}}
const ban={description:'Ban user',category:'owner',ownerOnly:true,limit:false,execute:async(m)=>{
  let t=m.raw.message?.extendedTextMessage?.contextInfo?.participant||m.quoted?.sender
  if(!t&&m.args[0])t=m.args[0].replace(/[^0-9]/g,'')+'@s.whatsapp.net'
  if(!t)return m.reply('Reply + .ban')
  updateUser(t,{banned:true});await m.reply('🚫 @'+t.split('@')[0]+' di-ban',{mentions:[t]})}}
const unban={description:'Unban user',category:'owner',ownerOnly:true,limit:false,execute:async(m)=>{
  let t=m.raw.message?.extendedTextMessage?.contextInfo?.participant||m.quoted?.sender
  if(!t&&m.args[0])t=m.args[0].replace(/[^0-9]/g,'')+'@s.whatsapp.net'
  if(!t)return m.reply('Reply + .unban')
  updateUser(t,{banned:false});await m.reply('✅ @'+t.split('@')[0]+' di-unban',{mentions:[t]})}}
module.exports={broadcast,addpremium,delpremium,ban,unban}
