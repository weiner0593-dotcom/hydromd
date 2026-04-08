const chalk = require("chalk")
const fs = require("fs")

// ================= AUTO PRESENCE =================
global.autoTyping = false
global.autoRecord = false
global.autoblockmorroco = false
global.wlcm = true
global.autokickmorroco = false
global.antispam = false
global.autosahur = false

// ================= CHANNEL =================
global.channel = '120363406397452589@newsletter'
global.channeln = 'Aizen System Channel ⚔️'

// ================= PREFIX =================
global.prefix = ['','!','.','#','&','/','🌀','🗿','🫨','👿','🤞🏿']

// ================= MEDIA =================
global.thumbnail = 'https://i.ibb.co/QFZgjwrf/Mezuka-MD-V4-NENOMODS-kq13exhp.jpg' // optional online thumb
global.music = 'https://raw.githubusercontent.com/weiner0593-dotcom/Aizen-md/main/Aizen.mp3'

// ================= OWNER =================
global.ownername = 'Aizen'
global.owner = ['233533416608'] // your number
global.ownernomer = '233533416608'
global.ownerNumber = ["233533416608@s.whatsapp.net"]

global.ig = '@jocelin'
global.tele = '@mydogissuchaweirdo'
global.ttowner = '@Peakmentality'
global.socialm = 'GitHub: https://github.com/weiner0593-dotcom/'
global.location = 'Accra'

// ================= BOT =================
global.botname = "Aizen System ⚔️"
global.botnumber = '233533416608'
global.ownerweb = ""
global.websitex = ""

global.wagc = ""
global.saluran = "https://whatsapp.com/channel/0029Vb7eSHf42Dcmdd3XA326"

global.themeemoji = '⚔️'
global.wm = "Aizen System ⚔️ | Master of Illusions"
global.botscript = 'Power is not given… it is taken.'
global.packname = "AIZEN"
global.author = "\n\n\n\n\nPowered by Aizen System ⚔️"
global.creator = "233533416608@s.whatsapp.net"

// ================= API KEYS =================
// ⚠️ DO NOT EXPOSE REAL KEYS
global.keyopenai = process.env.OPENAI_KEY || ""

// ================= PAYMENT =================
global.nodana = ''
global.nogopay = ''
global.noovo = false

global.andana = ''
global.angopay = ''
global.anovo = false

// ================= MESSAGE =================
global.mess = {
   wait: "*_Wait... Aizen is thinking... 🧠_*",
   success: "Done ⚔️",
   on: "System Activated ⚡",
   off: "System Shutdown 💤",
   query: {
       text: "Provide text.",
       link: "Provide a link.",
       image: "Provide an image.",
   },
   error: {
       fitur: "Error occurred. Contact owner.",
   },
   only: {
       group: "Group only feature.",
       private: "Private chat only.",
       owner: "Only the Creator 👑",
       admin: "Admin only.",
       badmin: "Bot must be admin.",
       premium: "Premium feature ⚔️",
   }
}

// ================= DECOR =================
global.decor = {
    menut: '––––––『',
    menuh: '』––––––',
    menub: '┊⚔️ ',
    menuf: '┗━═┅═━––––––๑\n',
    htki: '––––––『',
    htka: '』––––––'
}

// ================= SESSION =================
global.sessionName = 'aizen'
global.hituet = 0

// ================= MEDIA LOCAL =================
global.thumb = fs.readFileSync("./data/image/thumb.jpg")
global.log0 = fs.readFileSync("./data/image/thumb.jpg")
global.err4r = fs.readFileSync("./data/image/thumb.jpg")
global.thum = fs.readFileSync("./data/image/thumb.jpg")

global.defaultpp = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'

// ================= AUTO RELOAD =================
let file = require.resolve(__filename)
fs.watchFile(file, () => {
    fs.unwatchFile(file)
    console.log(chalk.redBright(`Update '${__filename}'`))
    delete require.cache[file]
    require(file)
})
