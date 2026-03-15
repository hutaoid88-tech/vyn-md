const config=require('../../config')
function serialize(sock,msg){
  const m={}
  m.key=msg.key;m.id=msg.key.id;m.chat=msg.key.remoteJid;m.fromMe=msg.key.fromMe
  m.isGroup=m.chat.endsWith('@g.us')
  m.sender=m.isGroup?(msg.key.participant||msg.participant||'').replace(/:[d]+/,'')+'@s.whatsapp.net':m.fromMe?sock.user.id.replace(/:[d]+/,'')+'@s.whatsapp.net':m.chat
  m.senderNumber=m.sender.split('@')[0];m.pushName=msg.pushName||'';m.messageTimestamp=msg.messageTimestamp
  const type=Object.keys(msg.message||{})[0];m.type=type
  const cont=msg.message?.[type];m.body=''
  if(type==='conversation')m.body=cont
  else if(type==='extendedTextMessage')m.body=cont?.text||''
  else if(type==='imageMessage'||type==='videoMessage')m.body=cont?.caption||''
  const prefix=config.command.prefix
  m.prefix=prefix;m.isCommand=m.body.startsWith(prefix)
  m.command=m.isCommand?m.body.slice(prefix.length).trim().split(/s+/)[0].toLowerCase():''
  m.args=m.isCommand?m.body.slice(prefix.length+m.command.length).trim().split(/s+/).filter(Boolean):[]
  m.text=m.args.join(' ');m.raw=msg
  const q=cont?.contextInfo?.quotedMessage
  if(q){const qt=Object.keys(q)[0];m.quoted={type:qt,message:q[qt],body:q[qt]?.text||q[qt]?.caption||'',id:cont?.contextInfo?.stanzaId,sender:cont?.contextInfo?.participant||''}}
  m.reply=(text,opt={})=>sock.sendMessage(m.chat,{text,...opt},{quoted:msg})
  m.react=(emoji)=>sock.sendMessage(m.chat,{react:{text:emoji,key:msg.key}})
  m.replyImage=(buf,cap='',opt={})=>sock.sendMessage(m.chat,{image:buf,caption:cap,...opt},{quoted:msg})
  m.replyVideo=(buf,cap='',opt={})=>sock.sendMessage(m.chat,{video:buf,caption:cap,...opt},{quoted:msg})
  m.replyAudio=(buf,ptt=false)=>sock.sendMessage(m.chat,{audio:buf,mimetype:'audio/mpeg',ptt},{quoted:msg})
  m.replySticker=(buf)=>sock.sendMessage(m.chat,{sticker:buf},{quoted:msg})
  return m
}
module.exports={serialize}
