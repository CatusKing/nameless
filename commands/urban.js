const { MessageEmbed } = require('discord.js');
const { get } = require('request');
const { icoe } = require('../icoe');
const { apiKey5 } = require('../general/token.json');
module.exports = {
	name: 'urban',
	description: 'Search something on urban dictionary',
  slash: true,
  options: [
    {
      name: 'term',
      type: 'STRING',
      description: 'The term you want to search for',
      required: true
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    get(`https://mashape-community-urban-dictionary.p.rapidapi.com/define`, { json: true, qs: {term: interaction.options.getString('term')}, headers: { 'x-rapidapi-host': 'mashape-community-urban-dictionary.p.rapidapi.com', 'x-rapidapi-key': apiKey5, useQueryString: true } }, (err, res, body) => {
      if (err) return icoe(err);
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body.list[0].word).setDescription(body.list[0].definition).addField('Example', body.list[0].example, false).addField('Thumbs ups', body.list[0].thumbs_up.toString(), false).addField('Thumbs down', body.list[0].thumbs_down.toString(), true) ] })
    });
  }
};