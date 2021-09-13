modules.export = {
  name: 'test',
  description: 'Just a simple test command',
  command: false,
  options: [],
  executeI(client, interaction) {
    interaction.reply('Test Ran');
  }
}