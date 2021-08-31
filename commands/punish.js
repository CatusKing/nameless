const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'punish',
	description: 'Punishes a user',
  usage: `punish <2-5> <@User>`,
  command: false,
  slash: true,
  options: [
    {
      type: 'USER',
      name: 'target',
      description: 'The person you want to punish',
      required: true
    },
    {
      type: 'INTEGER',
      name: 'level',
      description: 'The level of punishment',
      choices: [
        {
          name: '1',
          value: 1
        },
        {
          name: '2',
          value: 2
        },
        {
          name: '3',
          value: 3
        },
        {
          name: '4',
          value: 4
        },
        {
          name: '5',
          value: 5
        },
      ],
      required: true
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (interaction.member.roles.cache.has('830496065366130709') || interaction.member.roles.cache.has('830495937301577759') || interaction.member.roles.cache.has('830495908336369694')) {
      const target = interaction.options.getMember('target');
      if (target == null || target.id == interaction.user.id) return interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You must mention a user that is not yourself`).setColor('#9e9d9d') ] });
      else {
        if (interaction.options.getInteger('level') == 1) {
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Hey ${target}, you were just warned by ${interaction.user}\n${target} was warned due to a level 1 infraction`).setColor('#9e9d9d') ] });
        } else if (interaction.options.getInteger('level') == 2) {
          const duration = 120;
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          target.roles.add(role, `Muted by ${interaction.user}`);
          setUserMuted(target.id, duration);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Muted ${target} for 1 hour\nAction by ${interaction.user}\n${target} was muted for 1h due to a level 2 infraction`).setColor('#9e9d9d') ] });
          interaction.fetchReply()
            .then(reply => log('834179033289719839', `Muted ${target} for 1 hour\nAction by ${interaction.user}\n${target} was muted for 1h due to a level 2 infraction\n[Jump to!](${reply.url})`, '#9e9d9d'))
        } else if (interaction.options.getInteger('level') == 3) {
          const duration = 2880;
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          target.roles.add(role, `Muted by ${interaction.user}`);
          setUserMuted(target.id, duration);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Muted ${target} for 1 day\nAction by ${interaction.user}\n${target} was muted for 1h due to a level 3 infraction`).setColor('#9e9d9d') ] })
          interaction.fetchReply()
            .then(reply => log('834179033289719839', `Muted ${target} for 1 day\nAction by ${interaction.user}\n${target} was muted for 1 day due to a level 3 infraction\n[Jump to!](${reply.url})`, '#9e9d9d'))
        } else if (interaction.options.getInteger('level') == 4) {
          const duration = 2880;
          try {
            target.send('Temp banned for a day. For more information contact the mod that banned you or one of the owners(CactusKing101#2624, spoon#3631, mutya#9580)\nhttps://discord.gg/Hja2gSnsAu');
          } catch (err) {}
          try {
            target.ban({reason: `Temp banned`, days: 1});
          } catch (err) {}
          setUserBanned(target.id, duration);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Banned ${target} for 1 day due to a level 4 infraction\nAction by ${interaction.user}`).setColor('#9e9d9d') ] });
          interaction.fetchReply()
            .then(reply => log('834179033289719839', `Banned ${target} for 1 day due to a level 4 infraction\nAction by ${interaction.user}\n[Jump to!](${reply.url})`, '#9e9d9d'));
        } else if (interaction.options.getInteger('level') == 5) {
          const duration = -1;
          try {
            target.send('Perm banned. For more information contact the mod that banned you or one of the owners(CactusKing101#2624, spoon#3631, mutya#9580)\nhttps://discord.gg/Hja2gSnsAu');
          } catch (err) {}
          try {
            target.ban({reason: `Perm banned`, days: 1});
          } catch (err) {}
          setUserBanned(target.id, duration);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Perma Banned ${target}\nAction by ${interaction.user}`).setColor('#9e9d9d') ] });
          interaction.fetchReply()
            .then(reply => log('834179033289719839', `Perma Banned ${target}\nAction by ${interaction.user}\n[Jump to!](${reply.url})`, '#9e9d9d'));
        }
      }
    } else interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You don't have perms for this`).setColor('#9e9d9d') ] });
  }
};