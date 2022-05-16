const { SlashCommandBuilder } = require('@discordjs/builders');
const getVideo = require('../GetYoutubeVideo.js');
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
        // console.log(interaction);
        // console.log(interaction.options.getString('query'));
        let video = await getVideo(interaction.options.getString('query'));
        let youtube_id = video.items[0].id.videoId;
        await interaction.reply(`https://www.youtube.com/watch?v=${youtube_id}>`)
        // console.log(video);
        // await interaction.reply("Play test!")
    },
};


// async function getVideo(search){
//     console.log("you searched for: " + search);
//     const baseURL = "https://www.googleapis.com/youtube/v3/search?";
//     const params = "part=snippet&type=video&maxResults=1"
//     const key = "&key=" + process.env.YOUTUBE_KEY;
//     const query = "&q=" + search;
//     const url = baseURL + params + key + query;
//     //const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&key=" + process.env.YOUTUBE_KEY + "&q=" + search;
//     const res = await fetch(url);
  
//     if(!res.ok){
//       const data = await res.json();
//       console.log(res.status);
//       throw new Error(JSON.stringify(data));
//     }
//     return res.json();
//   }