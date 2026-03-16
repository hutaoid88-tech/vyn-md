const config=require('../../config'),{getGroup,updateGroup}=require('../lib/database')
const welcome={description:'Welcome',category:'group',groupOnly:true,adminOnly:true,execute:async(m)=>{const a=m.args[0]?.toLowerCase();if(!a||!['on','off'].includes(a))return m.reply('Cara: *'+config.command.prefix+'welcome on/off*');updateGroup(m.chat,{welcome:a==='on'});await m.reply('🌸 *WELCOME '+(a==='on'?'ON ✅':'OFF ❌')+'*')}}
const goodbye={description:'Goodbye',category:'group',groupOnly:true,adminOnly:true,execute:async(m)=>{const a=m.args[0]?.toLowerCase();if(!a||!['on','off'].includes(a))return m.reply('Cara: *'+config.command.prefix+'goodbye on/off*');updateGroup(m.chat,{goodbye:a==='on'});await m.reply('👋 *GOODBYE '+(a==='on'?'ON ✅':'OFF ❌')+'*')}}
const kick={description:'Kick member',category:'group',groupOnly:true,adminOnly:true,botAdmin:true,execute:async(m,sock)=>{
  let t=m.raw.message?.extendedTextMessage?.contextInfo?.participant||m.quoted?.sender
  if(!t&&m.args[0])t=m.args[0].replace(/[^0-9]/g,'')+'@s.whatsapp.net'
  if(!t)return m.reply('Reply + .kick atau .kick @tag')
  try{await sock.groupParticipantsUpdate(m.chat,[t],'remove');await m.reply('✅ Berhasil kick @'+t.split('@')[0],{mentions:[t]})}catch(e){await m.reply('❌ '+e.message)}}}
const promote={description:'Promote',category:'group',groupOnly:true,adminOnly:true,botAdmin:true,execute:async(m,sock)=>{
  let t=m.raw.message?.extendedTextMessage?.contextInfo?.participant||m.quoted?.sender
  if(!t&&m.args[0])t=m.args[0].replace(/[^0-9]/g,'')+'@s.whatsapp.net'
  if(!t)return m.reply('Reply + .promote')
  try{await sock.groupParticipantsUpdate(m.chat,[t],'promote');await m.reply('👑 @'+t.split('@')[0]+' jadi admin!',{mentions:[t]})}catch(e){await m.reply('❌ '+e.message)}}}
const demote={description:'Demote',category:'group',groupOnly:true,adminOnly:true,botAdmin:true,execute:async(m,sock)=>{
  let t=m.raw.message?.extendedTextMessage?.contextInfo?.participant||m.quoted?.sender
  if(!t&&m.args[0])t=m.args[0].replace(/[^0-9]/g,'')+'@s.whatsapp.net'
  if(!t)return m.reply('Reply + .demote')
  try{await sock.groupParticipantsUpdate(m.chat,[t],'demote');await m.reply('⬇️ Admin @'+t.split('@')[0]+' dicabut',{mentions:[t]})}catch(e){await m.reply('❌ '+e.message)}}}
const groupinfo={description:'Info grup',category:'group',groupOnly:true,execute:async(m,sock)=>{
  try{const meta=await sock.groupMetadata(m.chat);const adm=meta.participants.filter(p=>p.admin).length
    await m.reply('👥 *INFO GRUP*

Nama: *'+meta.subject+'*
Member: *'+meta.participants.length+'*
Admin: *'+adm+'*
Desc: _'+(meta.desc||'-')+'_')}catch(e){await m.reply('❌ '+e.message)}}}
const tagall={description:'Tag semua',category:'group',groupOnly:true,adminOnly:true,execute:async(m,sock)=>{
  try{const meta=await sock.groupMetadata(m.chat);const members=meta.participants.map(p=>p.id)
    let text='📢 *TAGALL*
_'+(m.text||'Perhatian!')+'_

';members.forEach(j=>{text+='@'+j.split('@')[0]+' '})
    await sock.sendMessage(m.chat,{text,mentions:members})}catch(e){await m.reply('❌ '+e.message)}}}
module.exports={welcome,goodbye,kick,promote,demote,groupinfo,tagall}
