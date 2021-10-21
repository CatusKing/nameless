const { MessageEmbed } = require('discord.js');
const { post } = require('request');
const { icoe } = require('../icoe');
module.exports = {
	name: 'aztro',
	description: 'Get daily horoscope',
  slash: true,
  options: [
    {
      name: 'sign',
      type: 'STRING',
      description: 'Your birth sign',
      options: [
        {
          name: 'aries',
          value: 'aries'
        },
        {
          name: 'taurus',
          value: 'taurus',
        },
        {
          name: 'gemini',
          value: 'gemini'
        },
        {
          name: 'cancer',
          value: 'cancer'
        },
        {
          name: 'leo',
          value: 'leo'
        },
        {
          name: 'virgo',
          value: 'virgo'
        },
        {
          name: 'libra',
          value: 'libra'
        },
        {
          name: 'scorpio',
          value: 'scorpio'
        },
        {
          name: 'sagittarius',
          value: 'sagittarius'
        },
        {
          name: 'capricorn',
          value: 'capricorn'
        },
        {
          name: 'aquarius',
          value: 'aquarius'
        },
        {
          name: 'pisces',
          value: 'pisces'
        }
      ],
      required: true
    },
    {
      name: 'day',
      type: 'STRING',
      description: 'The day you want the horoscope for',
      options: [
        {
          name: 'today',
          value: 'today'
        },
        {
          name: 'tomorrow',
          value: 'tomorrow'
        },
        {
          name: 'yesterday',
          value: 'yesterday'
        }
      ],
      required: true
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    post(`https://aztro.sameerkumar.website/?sign=${interaction.options.getString('sign')}&day=${interaction.options.getString('day')}`, { json: true }, (err, res, body) => {
      if (err) return icoe(err);
      console.log(body);
      interaction.reply({ embeds: [ new MessageEmbed().setDescription(body.description).setColor('#9e9d9d').setTitle(body.current_date).setAuthor(body.compatibility).addField('Lucky Time', body.lucky_time, true).addField('Lucky Number', body.lucky_number, true).addField('Mood', body.mood, true) ] });
    });
  }
};