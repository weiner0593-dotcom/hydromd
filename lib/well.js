const fs = require('fs');
const { isSetWelcome, getTextSetWelcome } = require('./setwelcome');
const { isSetLeft, getTextSetLeft } = require('./setleft');

let set_welcome_db = JSON.parse(fs.readFileSync('./database/set_welcome.json'));
let set_left_db = JSON.parse(fs.readFileSync('./database/set_left.json'));
let setting = JSON.parse(fs.readFileSync('./config.json'));

module.exports.welcome = async (iswel, isleft, hydro, anu) => {
  try {
    const metadata = await hydro.groupMetadata(anu.id);
    const participants = anu.participants;
    const groupName = metadata.subject;
    const groupDesc = metadata.desc || "-";

    for (let num of participants) {

      let pp_user;
      try {
        pp_user = await hydro.profilePictureUrl(num, 'image');
      } catch {
        pp_user = 'https://telegra.ph/file/c3f3d2c2548cbefef1604.jpg';
      }

      // ================= WELCOME =================
      if (anu.action === 'add' && (iswel || setting.auto_welcomeMsg)) {

        if (isSetWelcome(anu.id, set_welcome_db)) {

          const teks = await getTextSetWelcome(anu.id, set_welcome_db);
          const msg = teks
            .replace(/@user/gi, `@${num.split('@')[0]}`)
            .replace(/@group/gi, groupName)
            .replace(/@desc/gi, groupDesc);

          await hydro.sendMessage(anu.id, {
            text: msg,
            mentions: [num]
          });

        } else {

          await hydro.sendMessage(anu.id, {
            text: `ʜᴇʟʟᴏ 👋 @${num.split('@')[0]} ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ${groupName}

- ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ɪɴᴛʀᴏ ᴛʏᴘᴇ .ɪɴᴛʀᴏ
- ꜰᴏʟʟᴏᴡ ᴛʜᴇ ɢʀᴏᴜᴘ ʀᴜʟᴇꜱ
- ʀᴇꜱᴘᴇᴄᴛ ᴇᴠᴇʀʏᴏɴᴇ

_"ʏᴏᴜʀ ᴘʀᴇꜱᴇɴᴄᴇ ʜᴀꜱ ʙᴇᴇɴ ɴᴏᴛɪᴄᴇᴅ..."_`,
            mentions: [num]
          });

        }

      }

      // ================= LEAVE =================
      else if (anu.action === 'remove' && (isleft || setting.auto_leaveMsg)) {

        if (isSetLeft(anu.id, set_left_db)) {

          const teks = await getTextSetLeft(anu.id, set_left_db);
          const msg = teks
            .replace(/@user/gi, `@${num.split('@')[0]}`)
            .replace(/@group/gi, groupName)
            .replace(/@desc/gi, groupDesc);

          await hydro.sendMessage(anu.id, {
            image: { url: pp_user },
            caption: msg,
            mentions: [num]
          });

        } else {

          await hydro.sendMessage(anu.id, {
            text: `ɢᴏᴏᴅʙʏᴇ 👋 @${num.split('@')[0]}

_"ɴᴏᴛ ᴇᴠᴇʀʏᴏɴᴇ ɪꜱ ᴍᴇᴀɴᴛ ᴛᴏ ꜱᴛᴀʏ..."_

${groupName} ᴍᴏᴠᴇꜱ ᴏɴ.`,
            mentions: [num]
          });

        }

      }

      // ================= PROMOTE =================
      else if (anu.action === 'promote') {

        await hydro.sendMessage(anu.id, {
          text: `ʜᴇʏ 👑 @${num.split('@')[0]}

ʏᴏᴜʀ ʀᴀɴᴋ ʜᴀꜱ ʙᴇᴇɴ ʀᴀɪꜱᴇᴅ ɪɴ ${groupName}

ʏᴏᴜ ᴀʀᴇ ɴᴏᴡ ᴀɴ ᴀᴅᴍɪɴ

_"ᴘᴏᴡᴇʀ ɪꜱ ɴᴏᴛ ɢɪᴠᴇɴ..."_`,
          mentions: [num]
        });

      }

      // ================= DEMOTE =================
      else if (anu.action === 'demote') {

        await hydro.sendMessage(anu.id, {
          text: `ʜᴇʏ ⚠️ @${num.split('@')[0]}

ʏᴏᴜʀ ʀᴏʟᴇ ʜᴀꜱ ʙᴇᴇɴ ʀᴇᴠᴏᴋᴇᴅ

ʙᴀᴄᴋ ᴛᴏ ᴍᴇᴍʙᴇʀ ꜱᴛᴀᴛᴜꜱ

_"ᴄᴏɴᴛʀᴏʟ... ʟᴏꜱᴛ."_`,
          mentions: [num]
        });

      }

    }

  } catch (err) {
    console.error(err);
  }
};