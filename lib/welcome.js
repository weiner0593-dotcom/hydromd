// only showing the edited message parts (drop into your code)

if (anu.action === 'add' && (iswel || setting.auto_welcomeMsg)) {
  if (isSetWelcome(anu.id, set_welcome_db)) {

    const get_teks = await getTextSetWelcome(anu.id, set_welcome_db);
    const replaced = get_teks
      .replace(/@user/gi, `@${num.split('@')[0]}`)
      .replace(/@group/gi, groupName)
      .replace(/@desc/gi, groupDesc);

    await hydro.sendMessage(anu.id, { text: replaced, mentions: [num] });

  } else {

    await hydro.sendMessage(anu.id, {
      text: `ʜᴇʟʟᴏ 👋 @${num.split("@")[0]} ᴡᴇʟᴄᴏᴍᴇ ᴛᴏ ${groupName}

- ɪꜰ ʏᴏᴜ ᴡᴀɴᴛ ᴛᴏ ɪɴᴛʀᴏ ᴛʏᴘᴇ .ɪɴᴛʀᴏ
- ꜰᴏʟʟᴏᴡ ᴛʜᴇ ɢʀᴏᴜᴘ ʀᴜʟᴇꜱ
- ʀᴇꜱᴘᴇᴄᴛ ᴏᴛʜᴇʀꜱ
- ꜱᴛᴀʏ ᴀᴄᴛɪᴠᴇ ᴀɴᴅ ᴄᴏɴᴛʀɪʙᴜᴛᴇ

_"ʏᴏᴜʀ ᴘʀᴇꜱᴇɴᴄᴇ ʜᴀꜱ ʙᴇᴇɴ ᴀᴄᴋɴᴏᴡʟᴇᴅɢᴇᴅ..."_`,
      contextInfo: {
        mentionedJid: [num],
        externalAdReply: {
          title: `SYSTEM ENTRY`,
          body: `Member #${memberCount}`,
          thumbnail: welcomeBuffer,
          sourceUrl: "https://store.hydrohost.web.id",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  }
}

// ================= LEAVE =================

else if (anu.action === 'remove' && (isleft || setting.auto_leaveMsg)) {
  if (isSetLeft(anu.id, set_left_db)) {

    const get_teks = await getTextSetLeft(anu.id, set_left_db);
    const replaced = get_teks
      .replace(/@user/gi, `@${num.split('@')[0]}`)
      .replace(/@group/gi, groupName)
      .replace(/@desc/gi, groupDesc);

    await hydro.sendMessage(anu.id, {
      image: { url: pp_user },
      caption: replaced,
      mentions: [num]
    });

  } else {

    await hydro.sendMessage(anu.id, {
      text: `ɢᴏᴏᴅʙʏᴇ 👋 @${num.split("@")[0]}

_"ɴᴏᴛ ᴇᴠᴇʀʏᴏɴᴇ ɪꜱ ᴍᴇᴀɴᴛ ᴛᴏ ꜱᴛᴀʏ..."_

${groupName} ᴘʀᴏᴄᴇᴇᴅꜱ ᴡɪᴛʜᴏᴜᴛ ʏᴏᴜ.`,
      contextInfo: {
        mentionedJid: [num],
        externalAdReply: {
          title: `SYSTEM EXIT`,
          body: `Member #${memberCount}`,
          thumbnail: goodbyeBuffer,
          sourceUrl: "https://store.hydrohost.web.id",
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    });
  }
}

// ================= PROMOTE =================

else if (anu.action === 'promote') {
  await hydro.sendMessage(anu.id, {
    text: `ʜᴇʏ 👑 @${num.split('@')[0]}

ʏᴏᴜʀ ʀᴀɴᴋ ʜᴀꜱ ʙᴇᴇɴ ᴇʟᴇᴠᴀᴛᴇᴅ ɪɴ ${groupName}

ʏᴏᴜ ᴀʀᴇ ɴᴏᴡ ᴀɴ ᴀᴅᴍɪɴ

_"ᴘᴏᴡᴇʀ ɪꜱ ɴᴏᴛ ɢɪᴠᴇɴ… ɪᴛ ɪꜱ ᴛᴀᴋᴇɴ."_`,
    mentions: [num],
  });
}

// ================= DEMOTE =================

else if (anu.action === 'demote') {
  await hydro.sendMessage(anu.id, {
    text: `ʜᴇʏ ⚠️ @${num.split('@')[0]}

ʏᴏᴜʀ ʀᴏʟᴇ ʜᴀꜱ ʙᴇᴇɴ ʀᴇᴠᴏᴋᴇᴅ

ʙᴀᴄᴋ ᴛᴏ ᴍᴇᴍʙᴇʀ ꜱᴛᴀᴛᴜꜱ

_"ᴄᴏɴᴛʀᴏʟ… ʟᴏꜱᴛ."_`,
    mentions: [num],
  });
}