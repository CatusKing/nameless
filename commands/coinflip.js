const { CommandInteraction, MessageAttachment, MessageEmbed } = require('discord.js');
const { post } = require('request');
const { apiKey7 } = require('../general/token.json');
module.exports = {
	name: 'coinflip',
	description: 'Verse someone else in a coin flip',
  slash: true,
  options: [
    {
      name: 'opponent',
      type: 'USER',
      description: 'The person you want to verse',
      required: true
    }
  ],
  executeI(client, interaction = new CommandInteraction(), log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    post({url: 'https://v1.api.amethyste.moe/generate/vs', headers: {Authorization: 'Bearer '+apiKey7}, body: {url: interaction.user.avatarURL({format: 'png'}), avatar: interaction.options.getUser('opponent').avatarURL({format: 'png'})}}, (err, res, body) => {
      interaction.reply({embeds: [new MessageEmbed().setImage('attachment://vs.png')], files:[new MessageAttachment(body, 'vs.png')]})
    })
  }
};