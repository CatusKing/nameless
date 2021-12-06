const { MessageEmbed } = require('discord.js');
const request = require('request');
module.exports = {
	name: 'codeidea',
	description: 'Gives funky code ideas',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    request(`https://itsthisforthat.com/api.php?json`, { json: true }, (err, res, body) => {
      if (err) return console.log(err);
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(`**${body.this}** for **${body.that}**`).setColor('#9e9d9d') ] });
    });
  }
};