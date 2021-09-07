const { MessageEmbed } = require('discord.js');
const config = require('../general/config.json');
module.exports = {
	name: 'shop',
	description: 'Displays what you can use your points for',
	command: false,
	aliases: ['shop'],
	slash: true,
	options: [],
	executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
		var description = '';
		for (let i = 0; i < config.shop.length; ++i) description += `\n${config.shop[i][0]}`;
		interaction.reply({ embeds: [ new MessageEmbed().setDescription(description).setColor('#9e9d9d') ] });
	}
};