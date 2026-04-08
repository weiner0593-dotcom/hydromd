const cron = require("node-cron")
const fs = require("fs")

let isSahur = false

const startAutoSahur = (hydro) => {
    if (isSahur) return
    isSahur = true

    cron.schedule("0 0 4 * * *", async () => { // 4 AM Ghana time

        if (!global.autosahur) return

        try {
            const groups = await hydro.groupFetchAllParticipating()
            const groupIds = Object.keys(groups)

            for (const idGc of groupIds) {
                try {

                    await hydro.sendMessage(idGc, {
                        audio: {
                            url: "https://raw.githubusercontent.com/AhmadAkbarID/media/refs/heads/main/sahur.mp3"
                        },
                        mimetype: "audio/mpeg",
                        ptt: true,
                        contextInfo: {
                            externalAdReply: {
                                title: "⚔️ AIZEN ALERT ⚔️",
                                body: "Wake up… preparation time begins.",
                                thumbnail: fs.readFileSync("./data/image/thumb.jpg"),
                                renderLargerThumbnail: true
                            }
                        }
                    })

                } catch (err) {
                    console.log("Failed group:", idGc)
                }
            }

        } catch (err) {
            console.log(err)
        }

    }, {
        scheduled: true,
        timezone: "Africa/Accra"
    })
}

module.exports = { startAutoSahur }