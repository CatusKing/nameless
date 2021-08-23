const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'punish',
	description: 'Punishes a user',
  usage: `punish <2-5> <@User>`,
  command: true,
  aliases: ['punish'],
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
        if (interaction.options.getInteger('level') == 2) {
          const duration = 120;
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          target.roles.add(role, `Muted by ${interaction.user}`);
          setUserMuted(target.id, duration);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Muted ${target} for 1 hour\nAction by ${interaction.user}\n${target} was muted for 1h due to a level 2 infraction`).setColor('#9e9d9d') ] });
          log('834179033289719839', `Muted ${target} for 1 hour\nAction by ${interaction.user}\n${target} was muted for 1h due to a level 2 infraction`, '#9e9d9d');
        } else if (interaction.options.getInteger('level') == 3) {
          const duration = 2880;
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          target.roles.add(role, `Muted by ${interaction.user}`);
          setUserMuted(target.id, duration);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Muted ${target} for 1 day\nAction by ${interaction.user}\n${target} was muted for 1h due to a level 3 infraction`).setColor('#9e9d9d') ] });
          log('834179033289719839', `Muted ${target} for 1 day\nAction by ${interaction.user}\n${target} was muted for 1h due to a level 3 infraction`, '#9e9d9d');
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
          log('834179033289719839', `Banned ${target} for 1 day due to a level 4 infraction\nAction by ${interaction.user}`, '#9e9d9d');
        } else if (args[0] == 5) {
          const duration = -1;
          try {
            target.send('Perm banned. For more information contact the mod that banned you or one of the owners(CactusKing101#2624, spoon#3631, mutya#9580)\nhttps://discord.gg/Hja2gSnsAu');
          } catch (err) {}
          try {
            target.ban({reason: `Perm banned`, days: 1});
          } catch (err) {}
          setUserBanned(target.id, duration);
          interaction.reply({ embeds: [ new MessageEmbed().setDescription(`Banned ${target} for 1 day\nAction by ${interaction.user}`).setColor('#9e9d9d') ] });
          log('834179033289719839', `Banned ${target} for 1 day\nAction by ${interaction.user}`, '#9e9d9d');
        }
      }
    } else interaction.reply({ embeds: [ new MessageEmbed().setDescription(`You don't have perms for this`).setColor('#9e9d9d') ] });
  },
	execute(client, msg, args, reply, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned) {
    if (msg.member.roles.cache.has('830496065366130709') || msg.member.roles.cache.has('830495937301577759') || msg.member.roles.cache.has('830495908336369694')) {
      const target = msg.mentions.members.first();
      if (target == null || target.id == msg.author.id) return reply(msg.channel.id, `You must mention a user that is not yourself`, '#9e9d9d');
      if (isNaN(args[0]) || args[0] < 0 || args[0] > 5) return reply(msg.channel.id, `The punishment level must be between 2-5`, '#9e9d9d');
      else {
        if (args[0] == 2) {
          const duration = 120;
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          target.roles.add(role, `Muted by ${msg.author}`);
          setUserMuted(target.id, duration);
          reply(msg.channel.id, `Muted ${target} for 1 hour\nAction by ${msg.author}\n${target} was muted for 1h due to a level 2 infraction`, '#9e9d9d');
          log('834179033289719839', `Muted ${target} for 1 hour\nAction by ${msg.author}\n${target} was muted for 1h due to a level 2 infraction`, '#9e9d9d');
        } else if (args[0] == 3) {
          const duration = 2880;
          const role = client.guilds.cache.get('830495072876494879').roles.cache.get('830495536582361128');
          target.roles.add(role, `Muted by ${msg.author}`);
          setUserMuted(target.id, duration);
          reply(msg.channel.id, `Muted ${target} for 1 day\nAction by ${msg.author}\n${target} was muted for 1h due to a level 3 infraction`, '#9e9d9d');
          log('834179033289719839', `Muted ${target} for 1 day\nAction by ${msg.author}\n${target} was muted for 1h due to a level 3 infraction`, '#9e9d9d');
        } else if (args[0] == 4) {
          const duration = 2880;
          try {
            target.send('Temp banned for a day. For more information contact the mod that banned you or one of the owners(CactusKing101#2624, spoon#3631, mutya#9580)\nhttps://discord.gg/Hja2gSnsAu');
          } catch (err) {}
          try {
            target.ban({reason: `Temp banned`, days: 1});
          } catch (err) {}
          setUserBanned(target.id, duration);
          reply(msg.channel.id, `Banned ${target} for 1 day\nAction by ${msg.author}`, '#9e9d9d');
          log('834179033289719839', `Banned ${target} for 1 day\nAction by ${msg.author}`, '#9e9d9d');
        } else if (args[0] == 5) {
          const duration = -1;
          try {
            target.send('Perm banned. For more information contact the mod that banned you or one of the owners(CactusKing101#2624, spoon#3631, mutya#9580)\nhttps://discord.gg/Hja2gSnsAu');
          } catch (err) {}
          try {
            target.ban({reason: `Perm banned`, days: 1});
          } catch (err) {}
          setUserBanned(target.id, duration);
          reply(msg.channel.id, `Banned ${target} for 1 day\nAction by ${msg.author}`, '#9e9d9d');
          log('834179033289719839', `Banned ${target} for 1 day\nAction by ${msg.author}`, '#9e9d9d');
        }
      }
    } else reply(msg.channel.id, `You don't have perms for this`, `#9e9d9d`);
  }
};