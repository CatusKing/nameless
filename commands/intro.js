const { icoe } = require('../icoe');

function chunkString(str = new String()) {
  const arr = [];
  str.split(' ').forEach((val, index) => {
    if (index / 7 == Math.floor(index / 7)) arr[Math.floor(index / 7)] = '';
    arr[Math.floor(index / 7)] = arr[Math.floor(index / 7)] + ' ' + val
  });
  return arr;
}

module.exports = {
	name: 'intro',
	description: 'Sends an intro into the introductions channel',
  command: false,
  slash: true,
  options: [
    {
      name: 'name',
      type: 'STRING',
      description: 'This is the name you go by(nickname or discord name)',
      required: true
    },
    {
      name: 'pronouns',
      type: 'STRING',
      description: 'Your preferred pronouns',
      required: true
    },
    {
      name: 'age',
      type: 'INTEGER',
      description: 'Your legal age',
      required: false
    },
    {
      name: 'gender',
      type: 'STRING',
      description: 'The gender you identify as',
      required: false
    },
    {
      name: 'timezone',
      type: 'STRING',
      description: 'The timezone you reside in',
      required: false
    },
    {
      name: 'dms',
      type: 'STRING',
      description: 'How you want people to approach dming you',
      required: false,
      choices: [
        {
          name: 'Open',
          value: 'Open'
        },
        {
          name: 'Ask',
          value: 'Ask'
        },
        {
          name: 'Closed',
          value: 'Closed'
        }
      ]
    },
    {
      name: 'extra',
      type: 'STRING',
      description: 'Anything you want to say about yourself',
      required: false,
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    const name = `┊ ❑ 𝙽𝚊𝚖𝚎: ${interaction.options.getString('name')}\n`;
    const pronouns = `┊ ✦ 𝙿𝚛𝚘𝚗𝚘𝚞𝚗𝚜: ${interaction.options.getString('pronouns')}\n`;
    let age = interaction.options.getInteger('age') || -1;
    if (age > 12 && age <= 50) age = `┊ ✦ 𝙰𝚐𝚎: ${age}\n`
    else age = '';
    let gender = interaction.options.getString('gender') || '';
    if (gender != '') gender = `┊ ✦ 𝙶𝚎𝚗𝚍𝚎𝚛: ${gender}\n`;
    let timezone = interaction.options.getString('timezone') || '';
    if (timezone != '') timezone = `┊ ✦ 𝚃𝚒𝚖𝚎𝚣𝚘𝚗𝚎: ${timezone}\n`;
    let dms = interaction.options.getString('dms') || '';
    if (dms != '') dms = `┊ ✦ 𝙳𝙼 𝚂𝚝𝚊𝚝𝚞𝚜: ${dms}\n`;
    let extra = interaction.options.getString('extra') || '';
    if (extra != '') {
      chunkString(extra).forEach((val, index) => {
        if (index == 0) {
          extra = `┊ ✦ 𝙴𝚡𝚝𝚛𝚊: ${val}\n`;
        } else {
          extra += `┊        ${val}\n`;
        }
      });
    }
    client.channels.cache.get('833565619289980938').fetchWebhooks().then(hooks => {
      hooks.first().send({ content: `╭┄┄┄┄┄࿐ྂ\n${name}${pronouns}${age}${gender}${timezone}${dms}${extra}╰┄┄┄┄┄┄┄➤`, username: interaction.member.displayName, avatarURL: interaction.user.displayAvatarURL() })
      interaction.reply({ ephemeral: true, content: 'Sent to the introductions channel' });
    }).catch(err => icoe(err));
  }
};