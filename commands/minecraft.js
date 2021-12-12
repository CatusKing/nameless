const { get } = require('request');
const { icoe } = require('../icoe');
const {MessageEmbed} = require("discord.js");
module.exports = {
  name: 'minecraft',
  description: 'The command for the minecraft server',
  slash: true,
  options: [
    {
      name: 'server',
      type: 'SUB_COMMAND',
      description: 'Get the server status',
      options: [
        {
          name: 'ip',
          type: 'STRING',
          description: 'The ip of the server',
          required: true
        },
        {
          name: 'port',
          type: 'INTEGER',
          description: 'The port of the server',
          required: false
        }
      ]
    },
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    let embed = new MessageEmbed(), description = '';
    if (interaction.options.getSubcommand('server')) {
      get(`https://minecraft-api.com/api/ping/${interaction.options.getString('ip')}/${interaction.options.getInteger('port') || 25565}/json`, {json:true}, (res, err, body) => {
        description += `Version: ${body.version.name}\n`;
      });
      get(`https://minecraft-api.com/api/ping/response/${interaction.options.getString('ip')}/${interaction.options.getInteger('port') || 25565}/json`, {json:true}, (res, err, body) => {
        description += `Ping: ${body.response}ms\n`;
      });
      get(`https://minecraft-api.com/api/ping/online/${interaction.options.getString('ip')}/${interaction.options.getInteger('port') || 25565}/json`, {json:true}, (res, err, body) => {
        description += `Online: ${body.online}\n`;
      });
      get(`https://minecraft-api.com/api/ping/maxplayers/${interaction.options.getString('ip')}/${interaction.options.getInteger('port') || 25565}/json`, {json:true}, (res, err, body) => {
        description += `Max Players: ${body.maxplayers}\n`;
      });
      interaction.reply({embeds:[embed.setDescription(description).setTitle(`${interaction.options.getString('ip')}`).setColor('#429826')]})
    }
  }
};