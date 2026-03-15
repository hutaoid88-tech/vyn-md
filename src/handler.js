const config=require('../../config'),{serialize}=require('./lib/serialize')
const {getUser,getGroup,updateUser}=require('./lib/database')
const chalk=require('chalk'),fs=require('fs-extra'),path=require('path')
const plugins={}
function loadPlugins(){
  const dir=path.join(__dirname,'../plugins');fs.ensureDirSync(dir)
  fs.readdirSync(dir).filter(f=>f.endsWith('.js')).forEach(f=>{
    try{Object.assign(plugins,require('../plugins/'+f));console.log(chalk.green('[PLUGIN] '+f))}
    catch(e){console.error(chalk.red('[PLUGIN ERR] '+f+': '+e.message))}
  })
}
loadPlugins()
const spam={}
async function handleMessage(sock,msg,store){
  const m=serialize(sock,msg)
  if(m.fromMe||!m.body&&!m.isCommand)return
  const{isOwner,isPremium,isBanned}=require('../../config')
  const user=getUser(m.sender)
  if(config.features.logMessage)console.log(chalk.cyan('[MSG] '+(m.isGroup?'[Grup]':'[PM]')+' '+m.pushName+': '+m.body.substring(0,60)))
  if(isBanned(m.senderNumber))return m.react('🚫')
  if(config.features.antiSpam){
    const now=Date.now();if(!spam[m.sender])spam[m.sender]=[]
    spam[m.sender]=spam[m.sender].filter(t=>now-t<config.features.antiSpamInterval)
    if(spam[m.sender].length>=5)return;spam[m.sender].push(now)
  }
  updateUser(m.sender,{lastSeen:Date.now()})
  if(!m.isCommand)return
  if(config.features.autoTyping)await sock.sendPresenceUpdate('composing',m.chat).catch(()=>{})
  const handler=plugins[m.command];if(!handler)return
  if(handler.ownerOnly&&!isOwner(m.senderNumber))return m.reply(config.messages.ownerOnly)
  if(handler.premiumOnly&&!isPremium(m.senderNumber))return m.reply(config.messages.premiumOnly)
  if(handler.groupOnly&&!m.isGroup)return m.reply(config.messages.groupOnly)
  if(handler.privateOnly&&m.isGroup)return m.reply(config.messages.privateOnly)
  if(handler.adminOnly&&m.isGroup){
    const meta=await sock.groupMetadata(m.chat).catch(()=>null)
    const isAdmin=meta?.participants?.find(p=>p.id===m.sender)?.admin
    if(!isAdmin&&!isOwner(m.senderNumber))return m.reply(config.messages.adminOnly)
  }
  if(!isOwner(m.senderNumber)&&!isPremium(m.senderNumber)&&handler.limit!==false){
    if(user.limit<=0)return m.reply(config.messages.limitExceeded)
    updateUser(m.sender,{limit:user.limit-1})
  }
  try{await handler.execute(m,sock,{store,user})}
  catch(e){console.error(chalk.red('[ERR] '+m.command+': '+e.message));await m.reply('❌ *Error!*
> '+e.message)}
  if(config.features.autoTyping)await sock.sendPresenceUpdate('paused',m.chat).catch(()=>{})
}
async function handleGroupUpdate(sock,groupId,participants,action){
  const group=getGroup(groupId);let meta
  try{meta=await sock.groupMetadata(groupId)}catch{return}
  for(const jid of participants){
    if(action==='add'&&group.welcome)await sock.sendMessage(groupId,{text:'*🌸 Yokoso, @'+jid.split('@')[0]+'!*

Selamat datang di *'+meta.subject+'* desu~',mentions:[jid]})
    if(action==='remove'&&group.goodbye)await sock.sendMessage(groupId,{text:'*👋 Sayonara, @'+jid.split('@')[0]+'...*
_Semoga sukses ya~ またね！_',mentions:[jid]})
  }
}
module.exports={handleMessage,handleGroupUpdate}
