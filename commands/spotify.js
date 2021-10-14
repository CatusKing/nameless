const { icoe } = require("../icoe");

module.exports = {
	name: 'spotify',
	description: 'Manage your spotify link',
  slash: true,
  options: [
    {
      name: 'link',
      type: 'SUB_COMMAND',
      description: 'Link your spotify',
      options: [
        {
          type: 'STRING',
          name: 'token',
          description: 'The access token our website provides you',
          required: false
        }
      ]
    }, 
    {
      name: 'unlink',
      type: 'SUB_COMMAND',
      description: 'Unlink your spotify'
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.options.getSubcommand() == 'link') {
      db.set(`discord.users.${interaction.user.id}.spotify`, interaction.options.getString('token'));
      interaction.reply({ content: `Set token to ${interaction.options.getString('token')}`, ephemeral: true });  
    } else {
      db.delete(`discord.users.${interaction.user.id}.spotify`);
      interaction.reply('done!');
    }
  }
};