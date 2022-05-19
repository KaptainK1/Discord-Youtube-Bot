const { SlashCommandBuilder } = require('@discordjs/builders');
const searchVideo = require('../SearchYoutubeVideo.js');
const getVideo = require('../GetYoutubeVideo.js')

module.exports = {
    data: new SlashCommandBuilder()
    .setName("play")
    .setDescription('Query for a song to play')
    .addStringOption(option =>
                    option.setName('query')
                    .setDescription('Enter your search')
                    .setRequired(true)),
    async execute(interaction, player){
        console.log(interaction);
        // console.log(interaction.options.getString('query'));
        let video = await searchVideo(interaction.options.getString('query'));

        console.log('video :>> ', video);

        let videoID = video.items[0].id.videoId;
        console.log('videoID :>> ', videoID);

        //start here next time, need to parse through video object to get information
        // newVideoID :>>  {
        //     kind: 'youtube#videoListResponse',
        //     etag: 'fPERZZqM-9koXePdgytqi_gWlk0',
        //     items: [
        //       {
        //         kind: 'youtube#video',
        //         etag: 'prkUebFlDG09R4m6jHUZBJSG1xo',
        //         id: 'hKft6E4K8KY',
        //         snippet: [Object],
        //         contentDetails: [Object],
        //         player: [Object],
        //         recordingDetails: {}
        //       }
        //     ],
        //     pageInfo: { totalResults: 1, resultsPerPage: 1 }
        //   }
          
        let newVideoID = await getVideo(videoID);
        console.log('newVideoID :>> ', newVideoID);
        let youtube_id = video.items[0].id.videoId;
        // await interaction.reply(`https://www.youtube.com/watch?v=${youtube_id}>`);

        if (!interaction.member.voice.channelId) {
            return await interaction.reply({ content: "You are not in a voice channel!", ephemeral: true });
        }
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
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

        await interaction.deferReply();
        const track = await player.search(query, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({ content: `❌ | Track **${query}** not found!` });

        console.log(track);
        queue.addTrack(track);

        //if the queue is not playing, then there are no tracks in the queue
        if (!queue.playing){
            //play the track we just found
            queue.play();
        }
        return await interaction.followUp({ content: `⏱️ | Loading track **${track.title}**!` });

    }
};
