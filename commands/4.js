const { four } = require('../general/token.json');
module.exports = {
	name: '4',
	description: 'Yes',
  command: false,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var date = new Date();
    if (interaction.user.id == '576154421579481090' && date.getDate() == 19 && date.getMonth() == 11) {
      interaction.reply(four);
    } else interaction.reply('not yet');
  }
};

// ____          _____             _   _       ______          _   
// |___ \ ______ / ____|           | | | |     |  ____|        | |  
//   __) |______| (___   ___  _   _| |_| |__   | |__   __ _ ___| |_ 
//  |__ < ______ \___ \ / _ \| | | | __| '_ \  |  __| / _` / __| __|
//  ___) |______|____) | (_) | |_| | |_| | | | | |___| (_| \__ \ |_ 
// |____/       |_____/ \___/ \__,_|\__|_| |_| |______\__,_|___/\__|                                                                 