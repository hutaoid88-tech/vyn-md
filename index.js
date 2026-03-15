const {default:makeWASocket,useMultiFileAuthState,DisconnectReason,fetchLatestBaileysVersion,makeCacheableSignalKeyStore,makeInMemoryStore}=require('@whiskeysockets/baileys')
const pino=require('pino'),chalk=require('chalk'),readline=require('readline'),fs=require('fs-extra'),path=require('path')
const config=require('./config'),{setBotNumber}=require('./config')
const {handleMessage}=require('./src/handler'),{initDatabase}=require('./src/lib/database')
const logger=pino({level:'silent'}),store=makeInMemoryStore({logger})
fs.ensureDirSync('./session');fs.ensureDirSync('./database');fs.ensureDirSync('./temp')
function showBanner(){console.log(chalk.cyan('
╔══════════════════╗
║   VYN MD v'+config.bot.version+'   ║
╚══════════════════╝
'))}
async function getPairingCode(sock){
  if(!config.session.usePairingCode)return
  await new Promise(r=>setTimeout(r,3000))
  let number=config.session.pairingNumber.replace(/[^0-9]/g,'')
  if(!number||number.includes('x')){const rl=readline.createInterface({input:process.stdin,output:process.stdout});number=await new Promise(resolve=>{rl.question(chalk.yellow('
📱 Masukkan nomor WA (628xxx): '),ans=>{rl.close();resolve(ans.replace(/[^0-9]/g,''))})})}
  try{const code=await sock.requestPairingCode(number);console.log(chalk.green('
✅ Pairing Code: ')+chalk.yellow.bold(code+'
'))}catch(e){console.log(chalk.red('❌ Gagal:',e.message))}
}
async function startBot(){
  showBanner();await initDatabase()
  const{state,saveCreds}=await useMultiFileAuthState('./session')
  const{version}=await fetchLatestBaileysVersion()
  const sock=makeWASocket({version,logger,auth:{creds:state.creds,keys:makeCacheableSignalKeyStore(state.keys,logger)},printQRInTerminal:!config.session.usePairingCode,browser:['Vyn MD','Chrome','1.0.0'],syncFullHistory:false,markOnlineOnConnect:false})
  store.bind(sock.ev)
  if(config.session.usePairingCode&&!sock.authState.creds.registered)await getPairingCode(sock)
  sock.ev.on('connection.update',async({connection,lastDisconnect})=>{
    if(connection==='close'){const code=lastDisconnect?.error?.output?.statusCode;if(code!==DisconnectReason.loggedOut){console.log(chalk.yellow('🔄 Reconnecting...'));setTimeout(startBot,3000)}else{fs.removeSync('./session');process.exit(0)}}
    if(connection==='open'){const n=sock.user?.id?.split(':')[0]||sock.user?.id?.split('@')[0];if(n)setBotNumber(n);console.log(chalk.green('
✅ '+config.bot.name+' connected!
'))}
  })
  sock.ev.on('creds.update',saveCreds)
  sock.ev.on('messages.upsert',async({messages,type})=>{
    if(type!=='notify')return
    for(const msg of messages){if(!msg.message)continue;try{await handleMessage(sock,msg,store)}catch(e){console.error(chalk.red('[ERR]'),e.message)}}
  })
  sock.ev.on('group-participants.update',async({id,participants,action})=>{
    try{const{handleGroupUpdate}=require('./src/handler');await handleGroupUpdate(sock,id,participants,action)}catch(e){}
  })
}
startBot().catch(e=>{console.error(chalk.red('[FATAL]'),e);process.exit(1)})
