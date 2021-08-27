const { MessageEmbed } = require('discord.js');
const { prefix } = require('../general/config.json');
module.exports = {
	name: 'hue',
	description: 'Controls Thomas\'(The owner\'s) lights',
  usage: `hue`,
  command: false,
  slash: true,
  options: [
    {
      name: 'on',
      description: 'Turns on the set lights',
      type: 'SUB_COMMAND',
    },
    {
      name: 'off',
      description: 'Turns off the set lights',
      type: 'SUB_COMMAND',
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {

  }
};