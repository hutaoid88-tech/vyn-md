const KATA=[{kata:'kucing',hint:'Hewan peliharaan 🐱'},{kata:'nasi',hint:'Makanan pokok 🍚'},{kata:'hujan',hint:'Air dari langit 🌧️'},{kata:'bulan',hint:'Benda langit malam 🌙'},{kata:'pohon',hint:'Tumbuhan besar 🌳'},{kata:'laut',hint:'Tempat ikan berenang 🌊'},{kata:'buku',hint:'Tempat tulisan 📚'},{kata:'api',hint:'Panas dan membakar 🔥'},{kata:'angin',hint:'Udara yang bergerak'},{kata:'bintang',hint:'Cahaya di langit malam ✨'}]
const QUIZ=[{soal:'Ibu kota Indonesia?',jawaban:'jakarta',pilihan:['Jakarta','Surabaya','Bandung','Medan']},{soal:'7 x 8 = ?',jawaban:'56',pilihan:['54','56','58','64']},{soal:'Planet terdekat matahari?',jawaban:'merkurius',pilihan:['Venus','Merkurius','Mars','Bumi']},{soal:'Bahasa bot Baileys?',jawaban:'javascript',pilihan:['Python','Java','JavaScript','PHP']},{soal:'Warna bendera Indonesia?',jawaban:'merah putih',pilihan:['Merah Putih','Merah Biru','Putih Hijau','Kuning Merah']}]
const aT={},aQ={}
const tebakkata={description:'Tebak kata',category:'game',execute:async(m)=>{
  if(aT[m.chat]){const s=aT[m.chat];const b=s.kata.split('').map((c,i)=>i===0||i===s.kata.length-1?c:'_').join(' ');return m.reply('🎮 *TEBAK KATA*
Hint: _'+s.hint+'_
Kata: *'+b+'*
('+s.kata.length+' huruf)
_Ketik jawaban atau .skip_')}
  const d=KATA[Math.floor(Math.random()*KATA.length)];const b=d.kata.split('').map((c,i)=>i===0||i===d.kata.length-1?c:'_').join(' ')
  aT[m.chat]={kata:d.kata,hint:d.hint,startTime:Date.now(),attempts:0}
  setTimeout(()=>{if(aT[m.chat]){const s=aT[m.chat];delete aT[m.chat];m.reply('⏰ Waktu habis! Jawaban: *'+s.kata+'*')}},60000)
  await m.reply('🎮 *TEBAK KATA*
Hint: _'+d.hint+'_
Kata: *'+b+'*
('+d.kata.length+' huruf)
_Waktu 60 detik~_')}}
const quiz={description:'Quiz pilihan ganda',category:'game',execute:async(m)=>{
  if(aQ[m.chat]){const s=aQ[m.chat];return m.reply('📝 *QUIZ*
❓ '+s.soal+'

'+s.pilihan.map((p,i)=>['A','B','C','D'][i]+'. '+p).join('
')+'
_Ketik A/B/C/D_')}
  const d=QUIZ[Math.floor(Math.random()*QUIZ.length)];const sh=d.pilihan.sort(()=>Math.random()-.5)
  const ji=sh.findIndex(p=>p.toLowerCase()===d.jawaban.toLowerCase());const jh=['A','B','C','D'][ji]
  aQ[m.chat]={soal:d.soal,jawaban:d.jawaban,jawabanHuruf:jh,pilihan:sh,startTime:Date.now()}
  setTimeout(()=>{if(aQ[m.chat]){const s=aQ[m.chat];delete aQ[m.chat];m.reply('⏰ Waktu habis! Jawaban: *'+s.jawabanHuruf+'. '+s.jawaban+'*')}},30000)
  await m.reply('📝 *QUIZ*
❓ *'+d.soal+'*

'+sh.map((p,i)=>['A','B','C','D'][i]+'. '+p).join('
')+'
_Ketik A/B/C/D - Waktu 30 detik~_')}}
const jawab={description:'Jawab game',category:'game',limit:false,execute:async(m)=>{
  const j=m.text?.toLowerCase().trim();if(!j)return m.reply('_Ketik jawaban setelah .jawab_')
  if(aT[m.chat]){const s=aT[m.chat];s.attempts++;if(j===s.kata.toLowerCase()){delete aT[m.chat];return m.reply('🎉 *YATTA! BENAR!*
Jawaban: *'+s.kata+'*
Percobaan: *'+s.attempts+'x*')}return m.reply('❌ Salah~ ('+s.attempts+'x)')}
  if(aQ[m.chat]){const s=aQ[m.chat];const h=j.toUpperCase();if(!['A','B','C','D'].includes(h))return m.reply('Ketik A/B/C/D ya~');if(h===s.jawabanHuruf){delete aQ[m.chat];return m.reply('🎉 *CORRECT!*
Jawaban: *'+s.jawabanHuruf+'. '+s.jawaban+'*')};delete aQ[m.chat];return m.reply('❌ *SALAH!*
Jawaban benar: *'+s.jawabanHuruf+'. '+s.jawaban+'*')}
  return m.reply('_Tidak ada game. Ketik .tebakkata atau .quiz_')}}
const skip={description:'Skip game',category:'game',limit:false,execute:async(m)=>{
  if(aT[m.chat]){const k=aT[m.chat].kata;delete aT[m.chat];return m.reply('⏭️ Skip! Jawaban: *'+k+'*')}
  if(aQ[m.chat]){const{jawaban:j,jawabanHuruf:jh}=aQ[m.chat];delete aQ[m.chat];return m.reply('⏭️ Skip! Jawaban: *'+jh+'. '+j+'*')}
  return m.reply('_Tidak ada game berjalan~_')}}
module.exports={tebakkata,quiz,jawab,skip}
