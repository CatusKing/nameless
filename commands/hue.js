const { MessageEmbed } = require('discord.js');
const { bulbs } = require('../general/config.json');
const { hueToken, convertColors } = require('../general/token.json');
const { local_ip } = require('../general/config.json');
const request = require('request');

module.exports = {
	name: 'hue',
	description: 'Controls Thomas\'(The owner\'s) lights',
  usage: `hue`,
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
          description: 'Hex color of what you want',
          type: 'STRING',
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
    if (interaction.user.id != '473110112844644372') return interaction.reply(`no\n${client.users.cache.get('473110112844644372')} tell them to stop bothering me`)
    const sub = interaction.options.getSubcommand();
    var lights = [];
    var path = '';
    var des = '';
    request(`https://${local_ip}/api/${hueToken}/lights`, { json: true }, (err, res, body) => {
      if (err) return console.log(err);
      for (let i = 0; i < 20; ++i) {
        if (body[i] != null) lights.push(i);
      }
      var bulb = interaction.options.getString('bulb');
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
        const options = {
          method: 'GET',
          url: 'https://convert-colors.p.rapidapi.com/convert/hex/decimal/FF00FF',
          headers: {
            'x-rapidapi-host': 'convert-colors.p.rapidapi.com',
            'x-rapidapi-key': 'e82ba320d2msh04d4c7f7d1c847ap1d05bbjsne099d212cd7c',
            useQueryString: true
          }
        };
        request(options, (err, res, body) => {
          console.log(body)
          var bri = 255;
          var sat = 255;  
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
        });
      }
    });
  }
};