const { MessageEmbed } = require('discord.js');
const { bulbs, local_ip } = require('../general/config.json');
const { hueToken } = require('../general/token.json');
const request = require('request');

module.exports = {
	name: 'hue',
	description: 'Controls Thomas\'(The owner\'s) lights',
  command: false,
  slash: true,
  options: [
    {
      name: 'on',
      description: 'Turns on the set lights',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'bulb',
          description: 'The bulb(s) you want to turn on',
          type: 'STRING',
          required: true,
          choices: bulbs
        },
      ]
    },
    {
      name: 'off',
      description: 'Turns off the set lights',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'bulb',
          description: 'The bulb(s) you want to turn off',
          type: 'STRING',
          required: true,
          choices: bulbs
        },
      ]
    },
    {
      name: 'color',
      description: 'Turns off the set lights',
      type: 'SUB_COMMAND',
      options: [
        {
          name: 'bulb',
          description: 'The bulb(s) you want to turn off',
          type: 'STRING',
          required: true,
          choices: bulbs
        },
        {
          name: 'hue',
          description: 'The hue of the lights you\'re setting (1-65535)',
          type: 'INTEGER',
          required: true,
        },
        {
          name: 'brightness',
          description: 'The brightness of the color',
          type: 'INTEGER',
          required: false,
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
          ]
        },
        {
          name: 'saturation',
          description: 'The saturation of the color',
          type: 'INTEGER',
          required: false,
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
          ]
        },
      ]
    }
  ],
  executeI(client, interaction, log, hours, getUserDaily, setUserDaily, getUserWeekly, setUserWeekly, getUserBalance, addUserBalance, floor, commands, updateLeaderboard, getUserMuted, setUserMuted, updateStatus, setServerAdmins, admins, setServerIgnoredCh, ignoredCh, setUserBanned, round, db) {
    if (!interaction.member.roles.cache.has('845764951481122869')) return interaction.reply({ embeds: [new MessageEmbed().setColor('#9e9d9d').setDescription(`Hey sorry you need the \`Hue\` role for this command. You can use \`/buy Hue\` to get the role`)] })
    const sub = interaction.options.getSubcommand();
    const lights = [];
    let path = '',
      des = '';
    request(`https://${local_ip}/api/${hueToken}/lights`, { json: true }, (err, res, body) => {
      if (err) return console.log(err);
      for (let i = 0; i < 20; ++i) {
        if (body[i] != null) lights.push(i);
      }
      let bulb = interaction.options.getString('bulb');
      if (sub == 'on') {
        const https = require("https");
        if (bulb == 'all') {
          path = `/api/${hueToken}/groups/1/action`;
          des = 'Turned on all the lights';
        } else {
          des = `Turned on Bulb #${bulb}`;
          bulb = lights[bulb - 1];
          path = `/api/${hueToken}/lights/${bulb}/state`;
        }
        const options = {
          hostname: local_ip,
          path: path,
          method: 'PUT'
        };

        const req = https.request(options, response => {
          console.debug(`statusCode: ${response.statusCode}, ${bulb}`);
        });

        req.on('error', error => {
          console.warn(error);
        });

        req.write(`{"on":${true}}`);

        req.end();
        interaction.reply({ embeds: [ new MessageEmbed().setDescription(des).setColor('#9e9d9d') ] });
      } else if (sub == 'off') {
        const https = require("https");
        if (bulb == 'all') {
          path = `/api/${hueToken}/groups/1/action`;
          des = 'Turned off all the lights';
        } else {
          des = `Turned off Bulb #${bulb}`;
          bulb = lights[bulb - 1];
          path = `/api/${hueToken}/lights/${bulb}/state`;
        }
        const options = {
          hostname: local_ip,
          path: path,
          method: 'PUT'
        };

        const req = https.request(options, response => {
          console.debug(`statusCode: ${response.statusCode}, ${bulb}`);
        });

        req.on('error', error => {
          console.warn(error);
        });

        req.write(`{"on":${false}}`);

        req.end();
        interaction.reply({ embeds: [ new MessageEmbed().setDescription(des).setColor('#9e9d9d') ] });
      } else if (sub == 'color') {
        let hue = interaction.options.getInteger('hue') || 1;
        if (hue > 65535 || hue < 1) hue = 1;
        const bri = Math.floor((interaction.options.getInteger('brightness') / 5) * 255) || 255;
        const sat = Math.floor((interaction.options.getInteger('saturation') / 5) * 255) || 255;
        const https = require("https");
        if (bulb == 'all') {
          path = `/api/${hueToken}/groups/1/action`;
          des = `Turned on all the lights and set it to \`\`\`\nhue: ${hue}\nbri: ${bri}\nsat: ${sat}\`\`\``;
        } else {
          des = `Turned on Bulb #${bulb} and set it to \`\`\`\nhue: ${hue}\nbri: ${bri}\nsat: ${sat}\`\`\``;
          bulb = lights[bulb - 1];
          path = `/api/${hueToken}/lights/${bulb}/state`;
        }
        const options = {
          hostname: local_ip,
          path: path,
          method: 'PUT'
        };

        const req = https.request(options, response => {
          console.debug(`statusCode: ${response.statusCode}, ${bulb}`);
        });

        req.on('error', error => {
          console.warn(error);
        });

        req.write(`{"on":${true},"hue":${hue},"bri":${bri},"sat":${sat}}`);

        req.end();
        interaction.reply({ embeds: [ new MessageEmbed().setDescription(des).setColor('#9e9d9d') ] });
      }
    });
  }
};