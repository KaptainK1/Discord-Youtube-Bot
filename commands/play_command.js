const { SlashCommandBuilder } = require('@discordjs/builders');
// const searchVideo = require('../SearchYoutubeVideo.js');
// const getVideo = require('../GetYoutubeVideo.js');
// const { Player } = require('discord-player');
// const { Track } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription('Query for a song to play')
    .addStringOption(option =>
                    option.setName('query')
                    .setDescription('Enter your search')
                    .setRequired(true)),
    async execute(interaction, player){
        // console.log(interaction);
        // console.log(interaction.options.getString('query'));
        // let video = await searchVideo(interaction.options.getString('query'));
        // console.log('video :>> ', video);

        // let videoID = video.items[0].id.videoId;
        // console.log('videoID :>> ', videoID);
          
        // let newVideoID = await getVideo(videoID);
        // console.log('newVideoID :>> ', newVideoID);

        // const { snippet, contentDetails, statistics} = newVideoID.items[0];
        // const { title, description } = newVideoID.items[0].snippet.localized;
        // const author = newVideoID.items[0].snippet.channelTitle;
        // const url = `https://www.youtube.com/watch?v=${newVideoID.items[0].id}`;
        // const thumbnail = newVideoID.items[0].snippet.thumbnails.default.url;
        // const requestedBy = interaction.user;
        // const { duration } = newVideoID.items[0].contentDetails;
        // const { viewCount }= newVideoID.items[0].statistics;

        // let track = {};

        //boolean to check if what the user entered was a url for the video
        //otherwise consider what the user entered to be searched on yt
        // let isURL;

        // if(interaction.options.getString('query').startsWith('https://')){
        //     isURL = false;
        // } else {
        //     isURL = false;
        // }

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        }
        if (interaction.guild.me.voice.channelId && 
            interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
            return await interaction.reply({ content: "You are not in my voice channel!", ephemeral: true });
        }
        const query = interaction.options.getString('query');
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

        //reply to the channel from which the command was sent
        //use deferReply otherwise the reply might timeout


        // if(isURL){
            
        //     //since the user entered a url, query the video with the GetYoutubeVideo function
        //     let newVideoID = await getVideo(videoID);

        //     //from those results, build the track data
        //     const { snippet, contentDetails, statistics} = newVideoID.items[0];
        //     const { title, description } = newVideoID.items[0].snippet.localized;
        //     const author = newVideoID.items[0].snippet.channelTitle;
        //     const url = `https://www.youtube.com/watch?v=${newVideoID.items[0].id}`;
        //     const thumbnail = newVideoID.items[0].snippet.thumbnails.default.url;
        //     const requestedBy = interaction.user;
        //     const { duration } = newVideoID.items[0].contentDetails;
        //     const { viewCount }= newVideoID.items[0].statistics;

        //     trackData = {
        //         title: title,
        //         description: description,
        //         author: author,
        //         url: url,
        //         thumbnail: thumbnail,
        //         duration: duration,
        //         views: viewCount,
        //         requestedBy: requestedBy
        //     }
        // } else {
        await interaction.deferReply();
            const track = await player.search(query, {
                requestedBy: interaction.user
            }).then(x => x.tracks[0]);
        // }

        // const track = await player.search(query, {
        //     requestedBy: interaction.user
        // }).then(x => x.tracks[0]);

        if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

        // console.log(track);
        queue.addTrack(track);

        //if the queue is not playing, then there are no tracks in the queue
        if (!queue.playing){
            //play the track we just found
            queue.play();
        }
        return await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` });

    }
};
