const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { flags } = require('../general/config.json');

module.exports = {
	name: 'flag',
	description: 'WIP',
	usage: `flag`,
	command: true,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var random = Math.floor(flags.length * Math.random());
    var options = [{ label: flags[random][1], value: `${flags[random][0]}-${flags[random][0]}` }];
    var randoms = [random];
    for(let i = 0; i < 4; ++i) {
      var random2 = Math.floor(flags.length * Math.random());
      if (randoms.includes(random2)) continue;
      randoms.push(random2);
      options.push({ label: flags[random2][1], value: `${flags[random2][0]}-${flags[random][0]}` });
    }
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('flag')
          .setPlaceholder('Nothing selected')
          .addOptions(options)
      );
    interaction.reply({ 
      embeds: [new MessageEmbed().setColor('#9e9d9d').setTitle('What country is this?').setImage(`https://www.countryflags.io/${flags[random][0]}/flat/64.png`).setFooter('You have 15 seconds')],
      components: [row]
    })
    setTimeout(() => {
      interaction.fetchReply().then((msg) => {
        if (msg.embeds[0].footer == null) return;
        if (msg.embeds[0].footer.text == 'You have 15 seconds') msg.edit({ components: [], embeds: [new MessageEmbed().setColor('#ff7784').setDescription('You ran out of time')] });
      });
    }, 15000);
  },
  selectMenu: true,
  executeSM(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var guess = interaction.values[0].split('-')[0];
    var answer = interaction.values[0].split('-')[1];
    console.log(flags.findIndex(interaction.values[0].split('-')[1]))
    if (guess == answer) interaction.message.edit({ embeds: [new MessageEmbed().setColor('#baffc9').setDescription(`${interaction.user}, Pog you got it right!`)], components: [] });
    else interaction.message.edit({ embeds: [new MessageEmbed().setColor('#ff7784').setDescription(`${interaction.user}, You got it wrong :(`)], components: [] });
  }
};