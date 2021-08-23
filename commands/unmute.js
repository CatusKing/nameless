const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'unmute',
	description: 'Unmute another user',
  usage: `unmute [@User]`,
  command: true,
  aliases: ['unmute'],
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
        log(msg.channel.id, `Unmuted ${target}\nAction by ${msg.author}`, '#9e9d9d');
      } else interaction.reply({ embeds: [ new MessageEmbed().setDescription('This user isn\'t muted').setColor('#9e9d9d') ] });
    } else interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You don't have perms for this`).setColor('#9e9d9d') ] });
  },
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted) {
    if (msg.member.roles.cache.has('830496065366130709') || msg.member.roles.cache.has('830495937301577759') || msg.member.roles.cache.has('830495908336369694')) {
      const target = msg.mentions.members.first() || msg.member;
      const muted = getUserMuted(target.id);
      if (muted != 0) {
        const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
        target.roles.remove(role, `Muted removed by ${msg.author}`);
        setUserMuted(target.id, 0);
        reply(msg.channel.id, `Unmuted ${target}\nAction by ${msg.author}`, '#9e9d9d');
        log(msg.channel.id, `Unmuted ${target}\nAction by ${msg.author}\n[Jump to!](${msg.url})`, '#9e9d9d');
      } else reply(msg.channel.id, 'This user isn\'t muted', '#9e9d9d');
    } else reply(msg.channel.id, `You don't have perms for this`, `#9e9d9d`);
  }
};