const { MessageEmbed } = require('discord.js');
const request = require('request');
module.exports = {
	name: 'advice',
	description: 'Gives funky advice',
  usage: `advice`,
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    request(`https://api.adviceslip.com/advice`, { json: true }, (err, res, body) => {
      if (err) return console.log(err);
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(body.slip.advice).setColor('#9e9d9d') ] });
    });
  }
};