const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require("discord.js");
const { flags } = require('../general/config.json');

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

module.exports = {
	name: 'flag',
	description: 'Sends a random country flag to guess but if you get it wrong you must pay a 500🦴 fee to try again',
  slash: true,
  options: [],
  disabled: false,
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.roles.cache.has('879961023191318568')) return interaction.reply({ embeds: [new MessageEmbed().setColor('#9e9d9d').setDescription('Sorry you have been banned from using this command. Use `/buy flag` to pay the 500🦴 fee to be unbanned.')]});
    const random = Math.floor(flags.length * Math.random());
    const options = [{label: flags[random][1], value: `${flags[random][0]}-${flags[random][0]}`}];
    const randoms = [random];
    while(randoms.length < 5) {
      const random2 = Math.floor(flags.length * Math.random());
      if (randoms.includes(random2)) continue;
      randoms.push(random2);
      options.push({ label: flags[random2][1], value: `${flags[random2][0]}-${flags[random][0]}` });
    }
    shuffleArray(options);
    const components = [];
    for(let i = 0; i < options.length; ++i) {
      components.push(new MessageButton()
				.setCustomId(options[i].value)
				.setLabel(options[i].label)
				.setStyle('SUCCESS'),
			);
    }
    interaction.reply({ 
      embeds: [new MessageEmbed().setColor('#9e9d9d').setTitle('What country is this?').setImage(`https://flagcdn.com/h240/${flags[random][0].toLowerCase()}.png`).setFooter('You have 20 seconds')],
      components: [new MessageActionRow().addComponents(components)]
    });
    setTimeout(() => {
      interaction.fetchReply().then((msg) => {
        if (msg.embeds[0].footer == null) return;
        if (msg.embeds[0].footer.text == 'You have 20 seconds') msg.edit({ components: [], embeds: [new MessageEmbed().setColor('#ff7784').setDescription('You ran out of time.\nYou were banned from the \`/flag\` command for not answering within 20 seconds.\nDo `/buy flag` to pay the 500🦴 fee to be unbanned.')] });
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('879961023191318568');
        interaction.member.roles.add(role);
      }).catch(err => console.warn(err));
    }, 20000);
  },
  button: true,
  buttonId: '-',
  executeB(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.roles.cache.has('879961023191318568')) return interaction.reply({ ephemeral: true, content: 'Hey uhm- you\'re banned from using this command until you do `/buy flag`' });
    var guess = interaction.customId.split('-')[0];
    var answer = interaction.customId.split('-')[1];
    var answerCountry = '';
    var guessCountry = interaction.component.label;
    for(let i = 0; i < flags.length; ++i) {
      if (flags[i][0] == interaction.customId.split('-')[1]) answerCountry = flags[i][1];
    }
    if (guess == answer) {
      interaction.message.edit({ embeds: [new MessageEmbed().setColor('#baffc9').setDescription(`${interaction.user}, Pog you got it right! The flag was **${answerCountry}**\n+75🦴`)], components: [] });
      addUserBalance(interaction.user.id, 75);
      addUserBalance('bank', -75);
      log('830503210951245865', `+75🦴 to ${interaction.user} for answering the flag correctly`, '#baffc9');
    } else {
      interaction.message.edit({ embeds: [new MessageEmbed().setColor('#ff7784').setDescription(`${interaction.user}, You got it wrong :( The answer was **${answerCountry}** not **${guessCountry}**\nYou were banned from the \`/flag\` command for getting the flag wrong. Do \`/buy flag\` to pay the 500🦴 fee to be unbanned.`)], components: [] });
      const role = client.guilds.cache.get('830495072876494879').roles.cache.get('879961023191318568');
      interaction.member.roles.add(role);
    }
  }
};
