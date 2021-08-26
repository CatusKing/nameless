const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'unmute',
	description: 'Unmute another user',
  usage: `unmute [@User]`,
  command: false,
  slash: true,
  options: [
    {
      type: 'USER',
      name: 'target',
      description: 'The person you want to mute',
      required: false
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.roles.cache.has('830496065366130709') || interaction.member.roles.cache.has('830495937301577759') || interaction.member.roles.cache.has('830495908336369694')) {
      const target = interaction.options.getMember('target') || interaction.member;
      const muted = getUserMuted(target.id);
      if (muted != 0) {
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        target.roles.remove(role, `Muted removed by ${interaction.user}`);
        setUserMuted(target.id, 0);
        interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Unmuted ${target}\nAction by ${interaction.user}`).setColor('#9e9d9d') ] });
        interaction.fetchReply()
          .then(reply => log('834179033289719839', `Unmuted ${target}\nAction by ${interaction.user}\n[Jump to!](${message.url})`, '#9e9d9d'));
      } else interaction.reply({ embeds: [ new MessageEmbed().setDescription('This user isn\'t muted').setColor('#9e9d9d') ] });
    } else interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You don't have perms for this`).setColor('#9e9d9d') ] });
  }
};