const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require("discord.js");
const { flags } = require('../general/config.json');

function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

module.exports = {
	name: 'flag',
	description: 'Sends a random country flag to guess but if you get it wrong you must pay a 500🦴 fee to try again',
	usage: `flag`,
	command: true,
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.id != '473110112844644372') return;
    if (interaction.member.roles.cache.has('879961023191318568')) return interaction.reply({ embeds: [new MessageEmbed().setColor('#9e9d9d').setDescription('Sorry you have been banned from using this command. Use `/buy flag` to pay the 500🦴 fee to be unbanned.')]});
    var random = Math.floor(flags.length * Math.random());
    var options = [{ label: flags[random][1], value: `${flags[random][0]}-${flags[random][0]}` }];
    var randoms = [random];
    for(let i = 0; i < 4; ++i) {
      var random2 = Math.floor(flags.length * Math.random());
      if (randoms.includes(random2)) continue;
      randoms.push(random2);
      options.push({ label: flags[random2][1], value: `${flags[random2][0]}-${flags[random][0]}` });
    }
    shuffleArray(randoms);
    const row = new MessageActionRow()
      .addComponents(
        new MessageSelectMenu()
          .setCustomId('flag')
          .setPlaceholder('Nothing selected')
          .addOptions(options)
      );
    interaction.reply({ 
      embeds: [new MessageEmbed().setColor('#9e9d9d').setTitle('What country is this?').setImage(`https://www.countryflags.io/${flags[random][0]}/flat/64.png`).setFooter('You have 20 seconds')],
      components: [row]
    })
    setTimeout(() => {
      interaction.fetchReply().then((msg) => {
        if (msg.embeds[0].footer == null) return;
        if (msg.embeds[0].footer.text == 'You have 20 seconds') msg.edit({ components: [], embeds: [new MessageEmbed().setColor('#ff7784').setDescription('You ran out of time.\nYou were banned from the \`/flag\` command for not answering within 30 seconds.\nDo `/buy flag` to pay the 500🦴 fee to be unbanned.')] });
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('879961023191318568');
        interaction.member.roles.add(role);
      });
    }, 20000);
  },
  selectMenu: true,
  executeSM(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    var guess = interaction.values[0].split('-')[0];
    var answer = interaction.values[0].split('-')[1];
    var answerCountry = '';
    var guessCountry = '';
    for(let i = 0; i < flags.length; ++i) {
      if (flags[i][0] == interaction.values[0].split('-')[1]) answerCountry = flags[i][1];
      if (flags[i][0] == interaction.values[0].split('-')[0]) guessCountry = flags[i][1];
    }
    if (guess == answer) {
      interaction.message.edit({ embeds: [new MessageEmbed().setColor('#baffc9').setDescription(`${interaction.user}, Pog you got it right! The flag was **${answerCountry}**\n+100🦴`)], components: [] });
      addUserBalance(interaction.user.id, 100);
      log('830503210951245865', `+100🦴 to ${interaction.user} for answering the flag correctly`, '#baffc9');
    } else {
      interaction.message.edit({ embeds: [new MessageEmbed().setColor('#ff7784').setDescription(`${interaction.user}, You got it wrong :( The answer was **${answerCountry}** not **${guessCountry}**\nYou were banned from the \`/flag\` command for getting the flag wrong. Do \`/buy flag\` to pay the 500🦴 fee to be unbanned.`)], components: [] });
      const role = client.guilds.cache.get('830495072876494879').roles.cache.get('879961023191318568');
      interaction.member.roles.add(role);
    }
  }
};