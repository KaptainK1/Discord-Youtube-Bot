const { SlashCommandBuilder } = require('@discordjs/builders');
// const searchVideo = require('../SearchYoutubeVideo.js');
// const getVideo = require('../GetYoutubeVideo.js');
// const { Player } = require('discord-player');
// const { Track } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription('removes a particular track from the queue')
    .addStringOption(option =>
                    option.setName('track')
                    .setDescription('Enter the track title to remove')
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

        await interaction.deferReply();
        for(let i = 0; i < queue.tracks.length; i++){
            if(queue.tracks[i].title === interaction.options.getString('track').toLowerCase()){
                foundTrack = queue.tracks[i];
            }
        }

        if(foundTrack === null || foundTrack === undefined){
            return await interaction.reply({ content: `Track ${interaction.options.getString('track')} not found!` });
        }

        queue.remove(foundTrack);
        return await interaction.reply({ content: `removing ${interaction.options.getString('track')}!` });

    }
};
