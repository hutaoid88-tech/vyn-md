const config=require('../../config'),fs=require('fs-extra'),path=require('path')
const {exec}=require('child_process'),{promisify}=require('util')
const execA=promisify(exec)
async function toWebp(buf,isVid){
  const i=path.join(process.cwd(),'temp','s_in_'+Date.now()+'.'+(isVid?'mp4':'png'))
  const o=path.join(process.cwd(),'temp','s_out_'+Date.now()+'.webp')
  await fs.writeFile(i,buf)
  if(isVid)await execA('ffmpeg -i "'+i+'" -vf scale=512:512:force_original_aspect_ratio=decrease -vcodec libwebp -lossless 0 -loop 0 -t 5 -y "'+o+'"')
  else await execA('ffmpeg -i "'+i+'" -vf scale=512:512:force_original_aspect_ratio=decrease -y "'+o+'"')
  const r=await fs.readFile(o);await fs.remove(i);await fs.remove(o);return r
}
const sticker={description:'Buat sticker',category:'sticker',execute:async(m,sock)=>{
  await m.react('⏳')
  const msg=m.quoted?.message||m.raw.message,imgMsg=msg?.imageMessage,vidMsg=msg?.videoMessage
  if(!imgMsg&&!vidMsg)return m.reply('🖼️ Kirim/reply gambar dengan caption *'+config.command.prefix+'sticker*')
  try{const{downloadContentFromMessage}=require('@whiskeysockets/baileys')
    const src=imgMsg||vidMsg,type=imgMsg?'image':'video'
    const stream=await downloadContentFromMessage(src,type);let chunks=[]
    for await(const c of stream)chunks.push(c);const buf=Buffer.concat(chunks)
    await m.replySticker(await toWebp(buf,!!vidMsg));await m.react('✅')}
  catch(e){await m.react('❌');await m.reply('❌ '+e.message)}}}
const toimg={description:'Sticker ke gambar',category:'sticker',execute:async(m,sock)=>{
  await m.react('⏳')
  const sm=m.quoted?.message?.stickerMessage;if(!sm)return m.reply('Reply sticker + .toimg')
  try{const{downloadContentFromMessage}=require('@whiskeysockets/baileys')
    const stream=await downloadContentFromMessage(sm,'sticker');let chunks=[]
    for await(const c of stream)chunks.push(c);const buf=Buffer.concat(chunks)
    const i=path.join(process.cwd(),'temp','ti_'+Date.now()+'.webp')
    const o=path.join(process.cwd(),'temp','ti_'+Date.now()+'.png')
    await fs.writeFile(i,buf);await execA('ffmpeg -i "'+i+'" -y "'+o+'"')
    const img=await fs.readFile(o);await fs.remove(i);await fs.remove(o)
    await m.replyImage(img,'✅ Berhasil!');await m.react('✅')}
  catch(e){await m.react('❌');await m.reply('❌ '+e.message)}}}
module.exports={sticker,toimg}
