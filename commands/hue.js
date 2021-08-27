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
      name: 'bulb',
      description: 'The bulb(s) you want to turn on',
      type: 'STRING',
      required: true
    },
    {
      name: 'on',
      description: 'Turns on the set lights',
      type: 'SUB_COMMAND_GROUP',
    },
    {
      name: 'off',
      description: 'Turns off the set lights',
      type: 'SUB_COMMAND_GROUP',
    },
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {

  }
};