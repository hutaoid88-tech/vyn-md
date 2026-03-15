async function addExif(webpBuffer,packname,author){
  try{const{exiftool}=await import('exiftool-vendored').catch(()=>null)||{}
    if(!exiftool)return webpBuffer
    const fs=require('fs-extra'),path=require('path')
    const tmp=path.join(process.cwd(),'temp','exif_'+Date.now()+'.webp')
    await fs.writeFile(tmp,webpBuffer)
    await exiftool.write(tmp,{'XMP-dc:Title':packname,'XMP-dc:Description':author})
    const r=await fs.readFile(tmp);await fs.remove(tmp);return r
  }catch{return webpBuffer}
}
module.exports={addExif}
