const fs=require('fs-extra'),path=require('path')
const DB=path.join(process.cwd(),'database','data.json')
let db={users:{},groups:{},settings:{}}
async function initDatabase(){
  await fs.ensureDir(path.dirname(DB))
  if(await fs.pathExists(DB))try{db=await fs.readJSON(DB)}catch{db={users:{},groups:{},settings:{}}}
  await saveDatabase();console.log('[36m[DB][0m Database loaded ✅')
}
async function saveDatabase(){await fs.writeJSON(DB,db,{spaces:2})}
function getDatabase(){return db}
function getUser(jid){const id=jid.split('@')[0];if(!db.users[id])db.users[id]={id,limit:20,premium:false,banned:false,exp:0,lastSeen:Date.now()};return db.users[id]}
function getGroup(jid){if(!db.groups[jid])db.groups[jid]={jid,welcome:false,goodbye:false,antilink:false};return db.groups[jid]}
function updateUser(jid,data){const id=jid.split('@')[0];db.users[id]={...getUser(jid),...data};saveDatabase()}
function updateGroup(jid,data){db.groups[jid]={...getGroup(jid),...data};saveDatabase()}
module.exports={initDatabase,saveDatabase,getDatabase,getUser,getGroup,updateUser,updateGroup}
