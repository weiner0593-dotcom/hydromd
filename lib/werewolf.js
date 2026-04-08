const toMs = require("ms")
const jimp = require("jimp")

// ====== CONFIG ======
const GAME_DELAY = 60000 // change speed here

// ====== THUMBNAILS ======
const thumbs = [
"https://user-images.githubusercontent.com/72728486/235344562-4677d2ad-48ee-419d-883f-e0ca9ba1c7b8.jpg",
"https://user-images.githubusercontent.com/72728486/235344861-acdba7d1-8fce-41b8-adf6-337c818cda2b.jpg",
"https://user-images.githubusercontent.com/72728486/235316834-f9f84ba0-8df3-4444-81d8-db5270995e6d.jpg",
"https://user-images.githubusercontent.com/72728486/235354619-6ad1cabd-216c-4c7c-b7c2-3a564836653a.jpg",
"https://user-images.githubusercontent.com/72728486/235365156-cfab66ce-38b2-4bc7-90d7-7756fc320e06.jpg",
"https://user-images.githubusercontent.com/72728486/235365148-35b8def7-c1a2-451d-a2f2-6b6a911b37db.jpg"
]

// ====== UTIL ======
const sleep = ms => new Promise(r => setTimeout(r, ms))

const resize = async (img, w, h) => {
    const read = await jimp.read(img)
    return await read.resize(w, h).getBufferAsync(jimp.MIME_JPEG)
}

const emoji_role = role => ({
    warga: "👤",
    seer: "👁️",
    guardian: "🛡️",
    sorcerer: "🔮",
    werewolf: "🐺"
}[role] || "")

// ====== CORE ======
const sesi = (from, data) => data[from] || false

const findObject = (obj = {}, key, value) => {
    let result = []
    const search = o => {
        if (!o || typeof o !== "object") return
        if (o[key] === value) result.push(o)
        Object.values(o).forEach(search)
    }
    search(obj)
    return result
}

// ====== PLAYER ======
const playerOnGame = (sender, data) =>
    findObject(data, "id", sender).length > 0

const playerOnRoom = (sender, from, data) => {
    let r = findObject(data, "id", sender)
    return r.length > 0 && r[0].sesi === from
}

const dataPlayer = (sender, data) =>
    findObject(data, "id", sender)[0] || false

const dataPlayerById = (id, data) =>
    findObject(data, "number", id)[0] || false

const playerExit = (from, id, data) => {
    let room = sesi(from, data)
    if (!room) return
    room.player = room.player.filter(p => p.id !== id)
}

// ====== PLAYER FETCH ======
const getPlayerById = (from, sender, id, data) => {
    let room = sesi(from, data)
    if (!room) return false
    let i = room.player.findIndex(p => p.number === id)
    if (i === -1) return false
    return { index: i, db: room.player[i] }
}

const getPlayerById2 = (sender, id, data) => {
    let r = findObject(data, "id", sender)[0]
    if (!r) return false
    return getPlayerById(r.sesi, sender, id, data)
}

// ====== SKILLS ======
const killWerewolf = (sender, id, data) => {
    let res = getPlayerById2(sender, id, data)
    if (!res) return
    let { index } = res
    let room = sesi(res.db.sesi, data)

    if (room.player[index].effect.includes("guardian")) {
        room.guardian.push(id)
    }
    room.dead.push(id)
}

const dreamySeer = (sender, id, data) => {
    let res = getPlayerById2(sender, id, data)
    if (!res) return false
    return res.db.role
}

const sorcerer = (sender, id, data) => {
    let res = getPlayerById2(sender, id, data)
    return res ? res.db.role : false
}

const protectGuardian = (sender, id, data) => {
    let res = getPlayerById2(sender, id, data)
    if (!res) return
    res.db.effect.push("guardian")
}

// ====== ROLE ======
const roleShuffle = arr => arr.sort(() => Math.random() - 0.5)

const roleChanger = (from, id, role, data) => {
    let room = sesi(from, data)
    if (!room) return
    let p = room.player.find(x => x.id === id)
    if (p) p.role = role
}

const roleAmount = (from, data) => {
    let len = sesi(from, data).player.length
    return len <= 5
        ? { werewolf:1, seer:1, guardian:1, warga:len-3, sorcere:0 }
        : { werewolf:2, seer:1, guardian:1, warga:len-4, sorcere:1 }
}

const roleGenerator = (from, data) => {
    let room = sesi(from, data)
    if (!room) return

    let roles = roleAmount(from, data)

    for (let type in roles) {
        for (let i = 0; i < roles[type]; i++) {
            let players = room.player.filter(p => !p.role)
            if (!players.length) return
            let pick = roleShuffle(players)[0]
            roleChanger(from, pick.id, type === "sorcere" ? "sorcerer" : type, data)
        }
    }
}

// ====== GAME STATE ======
const addTimer = (from, data) => {
    let room = sesi(from, data)
    room.cooldown = Date.now() + toMs("90s")
}

const startGame = (from, data) => {
    let room = sesi(from, data)
    room.status = true
}

const changeDay = (from, data) => {
    let r = sesi(from, data)
    if (r.time === "malem") { r.time = "pagi"; r.day++ }
    else if (r.time === "pagi") r.time = "voting"
    else r.time = "malem"
}

// ====== VOTING ======
const vote = (from, id, sender, data) => {
    let r = sesi(from, data)
    let p = r.player.find(x => x.id === sender)
    let t = r.player.find(x => x.number === id)
    if (p) p.isvote = true
    if (t) t.vote++
}

const voteResult = (from, data) => {
    let r = sesi(from, data)
    let sorted = [...r.player].sort((a,b)=>b.vote-a.vote)
    if (!sorted[0].vote) return 0
    if (sorted[0].vote === sorted[1].vote) return 1
    return sorted[0]
}

const voteKill = (from, data) => {
    let res = voteResult(from, data)
    if (res && res !== 0 && res !== 1) res.isdead = true
}

// ====== WIN ======
const getWinner = (from, data) => {
    let r = sesi(from, data)
    let alive = r.player.filter(p => !p.isdead)

    let wolves = alive.filter(p => ["werewolf","sorcerer"].includes(p.role)).length
    let humans = alive.length - wolves

    if (wolves === 0) return true
    if (wolves >= humans) return false
    return null
}

// ====== PHASES ======
async function pagi(hydro, x, data) {
    return hydro.sendMessage(x.room, {
        text: `⚔️ AIZEN SYSTEM\n\nMorning Phase\nDay ${x.day}`
    })
}

async function voting(hydro, x, data) {
    let list = x.player.map(p =>
        `(${p.number}) @${p.id.split("@")[0]} ${p.isdead?"☠️":""}`
    ).join("\n")

    return hydro.sendMessage(x.room, {
        text: `⚔️ AIZEN SYSTEM\n\nVote Phase\n\n${list}`,
        mentions: x.player.map(p=>p.id)
    })
}

async function malam(hydro, x, data) {
    return hydro.sendMessage(x.room, {
        text: `⚔️ AIZEN SYSTEM\n\nNight Phase`
    })
}

async function skill(hydro, x, data) {
    for (let p of x.player) {
        if (p.isdead) continue

        let txt = {
            werewolf: "Kill target\n.wwpc kill",
            seer: "Reveal role\n.wwpc dreamy",
            guardian: "Protect player\n.wwpc protect"
        }[p.role]

        if (txt) await hydro.sendMessage(p.id, { text: txt })
    }
}

// ====== WIN MESSAGE ======
async function win(x, t, hydro, data) {
    let res = getWinner(x.room, data)
    let text = res
        ? "⚔️ AIZEN SYSTEM\n\nHumans Win"
        : "⚔️ AIZEN SYSTEM\n\nWerewolves Win"

    await hydro.sendMessage(x.room, { text })
    delete data[x.room]
}

// ====== MAIN LOOP ======
async function run(hydro, id, data) {
    while (getWinner(id, data) === null) {
        await sleep(GAME_DELAY)
        await pagi(hydro, sesi(id,data), data)

        await sleep(GAME_DELAY)
        await voting(hydro, sesi(id,data), data)

        await sleep(GAME_DELAY)
        await malam(hydro, sesi(id,data), data)

        await skill(hydro, sesi(id,data), data)
    }
    await win(sesi(id,data),1,hydro,data)
}

// ====== EXPORT ======
module.exports = {
    emoji_role,
    sesi,
    playerOnGame,
    playerOnRoom,
    playerExit,
    dataPlayer,
    dataPlayerById,
    getPlayerById,
    getPlayerById2,
    killWerewolf,
    killww,
    dreamySeer,
    sorcerer,
    protectGuardian,
    roleShuffle,
    roleChanger,
    roleAmount,
    roleGenerator,
    addTimer,
    startGame,
    playerHidup,
    playerMati,
    vote,
    voteResult,
    clearAllVote,
    getWinner,
    win,
    pagi,
    malam,
    skill,
    voteStart,
    voteDone,
    voting,
    run,
    run_vote,
    run_malam,
    run_pagi,
};