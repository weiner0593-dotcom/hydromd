const { modul } = require('../module');
const { fs } = modul;
const { color } = require('./color');
const axios = require('axios');
const path = require('path');

// ================= MODULE CONTROL ================= //

async function uncache(module = '.') {
  try {
    delete require.cache[require.resolve(module)];
  } catch (e) {
    console.error(color(`⚠️ Failed to uncache module: ${module}`, 'red'));
  }
}

async function nocache(module, cb = () => {}) {
  console.log(
    color('⚔️ AIZEN SYSTEM', 'blue'),
    color(`Watching module → ${module}`, 'cyan')
  );

  fs.watchFile(require.resolve(module), async () => {
    await uncache(module);

    console.log(
      color('⚡ Reload Detected →', 'yellow'),
      color(module, 'white')
    );

    cb(module);
  });
}

// ================= VERSION CHECK ================= //

async function checkVersionUpdate() {
  try {
    const localPkg = JSON.parse(
      fs.readFileSync(path.join(__dirname, '..', 'package.json'), 'utf-8')
    );

    const localVersion = localPkg.version;

    const url =
      'https://raw.githubusercontent.com/AhmadAkbarID/hydromd/refs/heads/master/package.json';

    const { data: remotePkg } = await axios.get(url);
    const remoteVersion = remotePkg.version;

    if (remoteVersion !== localVersion) {
      console.log(
        color('\n⚠️ UPDATE DETECTED', 'yellow'),
        color(`\nSystem Version : v${localVersion}`, 'white'),
        color(`\nLatest Version : v${remoteVersion}`, 'cyan'),
        color(
          `\nUpdate Here → https://github.com/AhmadAkbarID/hydromd\n`,
          'blue'
        )
      );
    } else {
      console.log(
        color('\n🧬 SYSTEM STATUS', 'green'),
        color(`\nVersion Stable → v${localVersion}\n`, 'white')
      );
    }
  } catch (error) {
    console.error(
      color(`❌ Version Check Failed → ${error.message}`, 'red')
    );
  }
}

// ================= EXPORT ================= //

module.exports = {
  uncache,
  nocache,
  checkVersionUpdate
};