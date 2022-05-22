const { SlashCommandBuilder } = require('@discordjs/builders');
const searchVideo = require('../SearchYoutubeVideo.js');
const getVideo = require('../GetYoutubeVideo.js');
const { Player } = require('discord-player');
const { Track } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("jump")
    .setDescription('jump to a particular track in the queue')
    .addStringOption(option =>
                    option.setName('track')
                    .setDescription('Enter the track to jump to')
                    .setRequired(true)),
    async execute(interaction, player){
        console.log(interaction);

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        }
        if (interaction.guild.me.voice.channelId && 
            interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
        }
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });

        // verify vc connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({ content: "Could not join your voice channel!", ephemeral: true });
        }

        let foundTrack = null;

        for(let i = 0; i < queue.tracks.length; i++){
            if(queue.tracks[i].title === interaction.options.getString('track')){
                foundTrack = queue.tracks[i];
            }
        }

        if(foundTrack === null || foundTrack === undefined){
            return await interaction.reply({ content: `Track ${interaction.options.getString('track')} not found!` });
        }

        queue.jump(foundTrack);
        return await interaction.reply({ content: `Jumping to Track ${interaction.options.getString('track')}!` });

    }
};
