const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'ignore',
	description: 'Toggles ignore mode for the current channel',
  usage: `ignore`,
  command: true,
  aliases: ['ignore'],
  slash: true,
  options: [],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.roles.cache.has('830496065366130709')) {
      if (ignoredCh.includes(interaction.channel.id)) {
        for (var i = 0; i < ignoredCh.length; i++) {

          if (ignoredCh[i] == interaction.channel.id) {
            ignoredCh.splice(i, 1);
            interaction.reply({ embeds: [ new MessageEmbed().setDescription(`No longer ignoring this channel\nid: ${interaction.channel.id}`).setColor('#9e9d9d') ] });
            break;
          }
        }
      } else {
        ignoredCh.push(interaction.channel.id);
        interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Ignoring this channel from auto mod\nid: ${interaction.channel.id}`).setColor('#9e9d9d') ] });
      }
      setServerIgnoredCh(ignoredCh);
      return ignoredCh;
    } else interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Sorry you don't have perms for this`).setColor('#9e9d9d') ] });
  },
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh) {
    if (msg.member.roles.cache.has('830496065366130709')) {
      if (ignoredCh.includes(msg.channel.id)) {
        for (var i = 0; i < ignoredCh.length; i++) {

          if (ignoredCh[i] == msg.channel.id) {
            ignoredCh.splice(i, 1);
            reply(msg.channel.id, `No longer ignoring this channel\nid: ${msg.channel.id}`, '#9e9d9d');
            break;
          }
        }
      } else {
        ignoredCh.push(msg.channel.id);
        reply(msg.channel.id, `Ignoring this channel from auto mod\nid: ${msg.channel.id}`, '#9e9d9d');
      }
      setServerIgnoredCh(ignoredCh);
      return ignoredCh;
    } else return reply(msg.channel.id, `Sorry you don't have perms for this`, '#9e9d9d');
	},
};