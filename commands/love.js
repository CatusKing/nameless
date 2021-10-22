const { MessageEmbed } = require('discord.js');
const { get } = require('request');
const { icoe } = require('../icoe');
const { apiKey5 } = require('../general/token.json');
module.exports = {
	name: 'love',
	description: 'Calculate the love of two people by name',
  slash: true,
  options: [
    {
      name: 'person-1',
      type: 'STRING',
      description: 'The first person',
      required: true
    },
    {
      name: 'person-2',
      type: 'STRING',
      description: 'The second person',
      required: true
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    get(`https://love-calculator.p.rapidapi.com/getPercentage?sname=${interaction.options.getString('person-2')}&fname=${interaction.options.getString('person-1')}`, { json: true, headers: { 'x-rapidapi-host': 'love-calculator.p.rapidapi.com', 'x-rapidapi-key': apiKey5} }, (err, res, body) => {
      if (err) return icoe(err);
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(body.result).setColor('#FF58CA').setTitle(`${body.fname} + ${body.sname} = ${body.percentage}%`) ] });
    });
  }
};