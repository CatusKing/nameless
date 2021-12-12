const { get } = require('request');
const { icoe } = require('../icoe');
module.exports = {
  name: 'minecraft',
  description: 'The command for the minecraft server',
  slash: true,
  options: [
    {
      name: 'server',
      type: 'SUB_COMMAND',
      description: 'Get the server status',
      options: []
    },
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.options.getSubcommand('server')) {
      get('https://minecraft-api.com/api/ping/mc.catusking.com/25565/json', (res, err, body) => {
        console.log(body);
      });
    }
  }
};