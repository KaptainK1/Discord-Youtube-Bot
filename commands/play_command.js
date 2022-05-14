const { SlashCommandBuilder } = require('@discordjs/builders');
const { getVideo } = require('../GetYoutubeVideo.js');

// const play_command = new SlashCommandBuilder()
//         .setName("play")
//         .setDescription('Query for a song to play')
//         .addStringOption(option =>
//                         option.setName('query')
//                         .setDescription('Enter your search')
//                         .setRequired(true));


module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription('Query for a song to play')
    .addStringOption(option =>
                    option.setName('query')
                    .setDescription('Enter your search')
                    .setRequired(true)),
    async execute(interaction){
        console.log(interaction);
        // let video = getVideo();
        await interaction.reply("Play test!")
    },
};