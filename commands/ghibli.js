const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const request = require("request");

module.exports = {
	name: 'ghibli',
	description: 'Send a Ghibli Studio menu',
	usage: `ghibli`,
	command: false,
  slash: true,
  options: [],
  executeI(client, interaction) {
    if (!['473110112844644372', '576154421579481090'].includes(interaction.user.id)) return
    request('https://ghibliapi.herokuapp.com/films', { json: true }, (err, res, body) => {
      interaction.reply({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body[0].title).setDescription(body[0].description).setAuthor(body[0].director) ], components: [new MessageActionRow().addComponents(new MessageButton().setCustomId('films_1').setLabel('Next').setStyle('PRIMARY')), new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_0_people`).setLabel('People').setStyle('SECONDARY'), new MessageButton().setLabel('Species').setCustomId(`films_0_species`).setStyle('SECONDARY'))] });
    });
  },
  button: true,
  buttonId: '_',
  executeB(client, interaction) {
    if (!['473110112844644372', '576154421579481090'].includes(interaction.user.id)) return;
    var split = interaction.customId.split('_');
    split[1] = Number(split[1]);
    if (split[0] == 'films') {
      request('https://ghibliapi.herokuapp.com/films', { json: true }, (err, res, body) => {
        var components = [];
        if (split[1] + 1 >= body.length) components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1] - 1}`).setLabel('Back').setStyle('PRIMARY')));
        else if (split[1] == 0) components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId('films_1').setLabel('Next').setStyle('PRIMARY')));
        else components.push(new MessageActionRow().addComponents([new MessageButton().setCustomId(`films_${split[1] - 1}`).setLabel('Back').setStyle('PRIMARY'), new MessageButton().setCustomId(`films_${split[1] + 1}`).setLabel('Next').setStyle('PRIMARY')]));
        if (split[2] == 'people') {
          components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1]}`).setLabel('Back to Film').setStyle('SECONDARY')));
          if (body[split[1]].people[0] == 'https://ghibliapi.herokuapp.com/people/') {
            interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body[split[1]].title).setDescription(`The people for this film are not set :(`).setAuthor(`Director: ${body[split[1]].director}`).setFooter(`${split[1] + 1}/${body.length}`) ], components: components });  
          } else {
            if (split[3] == null) {
              if (body[split[1]].people.length > 1) components.push(new MessageActionRow().addComponents(new MessageButton().setLabel('Next Person').setCustomId(`films_${split[1]}_people_1`).setStyle('SECONDARY')));
              request(body[split[1]].people[0], { json: true }, (err, res, body2) => {
                interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body2.name).setDescription(`Age: \`${body2.age}\u200B\`\nGender: \`${body2.gender}\u200B\`\nHair Color: \`${body2.hair_color}\u200B\`\nEye Color: \`${body2.eye_color}\u200B\``).setAuthor(`Director: ${body[split[1]].director}`).setFooter(`${split[1] + 1}/${body.length}`) ], components: components });  
              });
            } else {
              split[3] = Number(split[3]);
              if (split[3] + 1 >= body[split[1]].people.length) components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1]}_people_${split[3] - 1}`).setLabel('Back Person').setStyle('SECONDARY')));
              else if (split[3] == 0 && body[split[1].people.length > 1]) components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1]}_people_1`).setLabel('Next Person').setStyle('SECONDARY')));
              else if (split[3] == 0) {}
              else components.push(new MessageActionRow().addComponents([new MessageButton().setCustomId(`films_${split[1]}_people_${split[3] - 1}`).setLabel('Back Person').setStyle('SECONDARY'), new MessageButton().setCustomId(`films_${split[1]}_people_${split[3] + 1}`).setLabel('Next Person').setStyle('SECONDARY')]));      
              request(body[split[1]].people[split[3]], { json: true }, (err, res, body2) => {
                interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body2.name).setDescription(`Age: \`${body2.age}\u200B\`\nGender: \`${body2.gender}\u200B\`\nHair Color: \`${body2.hair_color}\u200B\`\nEye Color: \`${body2.eye_color}\u200B\``).setAuthor(`Director: ${body[split[1]].director}`).setFooter(`${split[1] + 1}/${body.length}`) ], components: components });  
              });
            }
          }
        } else if (split[2] == 'species') {
          components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1]}`).setLabel('Back to Film').setStyle('SECONDARY')));
          if (body[split[1]].people[0] == 'https://ghibliapi.herokuapp.com/species/') {
            interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body[split[1]].title).setDescription(`The species for this film is not set :(`).setAuthor(`Director: ${body[split[1]].director}`).setFooter(`${split[1] + 1}/${body.length}`) ], components: components });  
          } else {
            if (split[3] == null) {
              if (body[split[1]].species.length > 1) components.push(new MessageActionRow().addComponents(new MessageButton().setLabel('Next Species').setCustomId(`films_${split[1]}_species_1`).setStyle('SECONDARY')));
              request(body[split[1]].species[0], { json: true }, (err, res, body2) => {
                interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body2.name).setDescription(`Classification: \`${body2.classification}\u200B\`\nHair Colors: \`${body2.hair_colors}\u200B\`\nEye Colors: \`${body2.eye_colors}\u200B\``).setAuthor(`Director: ${body[split[1]].director}`).setFooter(`${split[1] + 1}/${body.length}`) ], components: components });  
              });
            } else {
              split[3] = Number(split[3]);
              if (split[3] + 1 >= body[split[1]].species.length) components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1]}_species_${split[3] - 1}`).setLabel('Back Species').setStyle('SECONDARY')));
              else if (split[3] == 0 && body[split[1].species.length > 1]) components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1]}_species_1`).setLabel('Next Species').setStyle('SECONDARY')));
              else if (split[3] == 0) {}
              else components.push(new MessageActionRow().addComponents([new MessageButton().setCustomId(`films_${split[1]}_species_${split[3] - 1}`).setLabel('Back Species').setStyle('SECONDARY'), new MessageButton().setCustomId(`films_${split[1]}_species_${split[3] + 1}`).setLabel('Next Species').setStyle('SECONDARY')]));      
              request(body[split[1]].species[split[3]], { json: true }, (err, res, body2) => {
                interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body2.name).setDescription(`Classification: \`${body2.classification}\u200B\`\nHair Colors: \`${body2.hair_colors}\u200B\`\nEye Colors: \`${body2.eye_colors}\u200B\``).setAuthor(`Director: ${body[split[1]].director}`).setFooter(`${split[1] + 1}/${body.length}`) ], components: components });  
              });
            }
          }
        } else {
          components.push(new MessageActionRow().addComponents(new MessageButton().setCustomId(`films_${split[1]}_people`).setLabel('People').setStyle('SECONDARY'), new MessageButton().setLabel('Species').setCustomId(`films_${split[1]}_species`).setStyle('SECONDARY')));
          interaction.update({ embeds: [ new MessageEmbed().setColor('#9e9d9d').setTitle(body[split[1]].title).setDescription(body[split[1]].description).setAuthor(`Director: ${body[split[1]].director}`).setFooter(`${split[1] + 1}/${body.length}`) ], components: components });  
        }
      });
    }
  }
};