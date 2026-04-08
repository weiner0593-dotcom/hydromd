const gameSlot = async (hydro, m, db, nominalArg) => {
  db.users = db.users || {};
  db.users[m.sender] = db.users[m.sender] || { limit: 0, money: 0 };

  const user = db.users[m.sender];

  if (user.limit < 1) {
    return m.reply('⚠️ Your limit is exhausted.');
  }

  // ================= PARSE BET ================= //
  const parseNominal = (input) => {
    if (!input) return NaN;
    let s = String(input).toLowerCase().replace(/[^0-9k]/g, '');
    let isK = s.includes('k');
    s = s.replace('k', '');
    let n = parseInt(s);
    return isK ? n * 1000 : n;
  };

  const nominal = parseNominal(nominalArg);

  if (!nominal || nominal < 1) {
    return m.reply(
      `🎰 *Slot Usage*\nExample:\n• slot 500\n• slot 10k`
    );
  }

  if (user.money < nominal) {
    return m.reply('💸 Not enough money for that bet.');
  }

  // ================= SPIN ================= //
  const symbols = ['🍇','🍉','🍋','🍌','🍎','🍑','🍒','🫐','🥥','🥑'];
  const pick = () => symbols[Math.floor(Math.random() * symbols.length)];
  const spin = Array.from({ length: 9 }, pick);

  const row1 = `${spin[0]} │ ${spin[1]} │ ${spin[2]}`;
  const row2 = `${spin[3]} │ ${spin[4]} │ ${spin[5]}`;
  const row3 = `${spin[6]} │ ${spin[7]} │ ${spin[8]}`;

  // ================= GAME LOGIC ================= //
  user.limit -= 1;
  user.money -= nominal;

  let result = '💀 YOU LOST';
  let winMoney = 0;
  let winLimit = 0;

  const allSame = spin.every(v => v === spin[0]);
  const midSame = spin[3] === spin[4] && spin[4] === spin[5];
  const topSame = spin[0] === spin[1] && spin[1] === spin[2];
  const botSame = spin[6] === spin[7] && spin[7] === spin[8];

  if (allSame) {
    result = '🎉 MEGA JACKPOT';
    winMoney = nominal * 5;
    winLimit = 5;
  } else if (midSame) {
    result = '🔥 JACKPOT';
    winMoney = nominal * 3;
    winLimit = 3;
  } else if (topSame || botSame) {
    result = '✨ SMALL WIN';
    winMoney = nominal * 2;
    winLimit = 1;
  }

  if (winMoney) user.money += winMoney;
  if (winLimit) user.limit += winLimit;

  // ================= DISPLAY ================= //
  const text = `
╔═══〔 🎰 SLOT MACHINE 〕═══╗

${row1}
${row2}  ⟵ PAYLINE
${row3}

╚═══════════════════════╝

🎯 Result : ${result}

${winMoney > 0
  ? `💰 +${winMoney}\n🎟️ +${winLimit} limit`
  : `💸 -${nominal}\n🎟️ -1 limit`}

💳 Balance : ${user.money}
`;

  return hydro.sendMessage(m.chat, { text }, { quoted: m });
};