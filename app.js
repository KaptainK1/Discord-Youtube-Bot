import 'dotenv/config';
import express from 'express';
import {
  InteractionType,
  InteractionResponseType,
  InteractionResponseFlags,
  MessageComponentTypes,
  ButtonStyleTypes,
} from 'discord-interactions';
import { VerifyDiscordRequest, DiscordRequest, getVideo, GetChannel, GetGuild } from './utils.js';
import {
  HasGuildCommands,
  PLAY_COMMAND,
} from './commands.js';

import { Player } from 'discord-player';
import { Client, Intents, Interaction } from 'discord.js';

// const { Client, Intents } = require("discord.js");
// const { REST } = require("@discordjs/rest");
// const { Routes } = require("discord-api-types/v9");
// const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });
// const { Player } = require("discord-player");
// const fs = require("fs");
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

//const player = new Player(client);

// add the trackStart event so when a song will be played this message will be sent
// player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`))



// Create an express app
const app = express();
const player = new Player(client);
player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Now playing **${track.title}**!`))
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post('/interactions', async function (req, res) {
  // Interaction type and data
  const { type, id, data, member, channel_id } = req.body;

  console.log("req body");
  console.log(req.body);

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name, guild_id } = data;
    const opts = data.options[0];
    const value = opts.value;

    // console.log("Request_Body:")
    // console.log(req.body);

    // console.log("Member:")
    // console.log(member);

    const user_id = member.user.id;
    // console.log("User ID:")
    // console.log(user_id);
    // console.log("Guild ID:")
    // console.log(guild_id);

    if (name === 'play') {
      console.log("Search:")
      console.log(data);


      
      // const video = await getVideo(value);
      let video = await getVideo(value);
      console.log("Youtube Video:")
       console.log(video)

       let youtube_id = video.items[0].id.videoId;
      //  console.log("Youtube ID:")
      // console.log(youtube_id);

      if(video != null){
        // video = `<iframe src="https://www.youtube.com/watch?v=${youtube_id}>`
        console.log(video);
      } else {
        console.log("error with video")
      }

      // const channelURL = `channels/${channel_id}`;
      // const channelRequest = await DiscordRequest(channelURL, { method: 'GET' } );
      // const channel = await channelRequest.json();
      
      const channel = await GetChannel("music", guild_id);
      const channelID = channel.id;
      console.log(channelID);
      if(channelID == null){
        throw new Error("Channel name not found. exiting")
      }

      if ( channel_id !== channelID) {

      // return res.send({
      //   type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      //   data: {
      //     // content: 'you searched for: ' + value,
      //     content: `You are not in the music voice channel!`,
      //   },
      // });
    }

      // const guild = await GetGuild(guild_id);
      // console.log("Guild stringify:")
      // console.log(guild);
      // const guildObject = JSON.parse(`"${guild}"`);
      // console.log("Guild:")
      // console.log(guildObject);

      //get a guild object for discord.js
      // const guildManager = client.guilds;

      //get the guild object which is needed for the queue
      const newguild = await client.guilds.fetch(guild_id)

      //get the channel object which is needed for the queue
      const newChannel = await client.channels.fetch(channelID);
                          // .then(channel => console.log(channel.name))
                          // .catch(console.error);


                          //start here need to debug the new channel, cant get channel members for some reason
      console.log("channel member count");
      console.log(newChannel.memberCount);

      console.log("channel members");
      // console.log(newChannel.members);

      // const channelMemebers = newChannel.members.forEach( x => console.log(x));

      for (const [key, value] of newChannel.members.entries()){
        console.log(key, value);
      }



      console.log("channels");
      console.log(newChannel);

      console.log("is voice channel?")
      console.log(newChannel.isVoice());

      console.log("new guild");
      console.log(newguild);

      //move member functionality if needed
      // const moveMemberURL = `guilds/${guild_id}/members/${user_id}`;
      // const moveMemberRequest = await DiscordRequest(moveMemberURL, {method: 'PATCH', body: {channel_id: channelID}});
      // const moveMemberResult = await moveMemberRequest.json();

      //begin music player code

      const query = `https://www.youtube.com/watch?v=${youtube_id}>`;
      const queue = player.createQueue(newguild, {
        metadata: {
          channel: newChannel
        }
      });

      
      console.log(queue.toJSON());



      //get the connection to the voice channel
      try {
        console.log(queue.connection);
        if(!queue.connection) await queue.connect(newChannel);

      } catch {

        //if cannot get the connection, destroy the queue object and return a message to the general chat
        queue.destroy();
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            // content: 'you searched for: ' + value,
            content: `Could not join voice channel ${newChannel.name}!`,
          },
        });
      }



      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // content: 'you searched for: ' + value,
          content: "https://www.youtube.com/watch?v=" + youtube_id,

        },
      });
    }

  }

  /**
   * Handle requests from interactive components
   * See https://discord.com/developers/docs/interactions/message-components#responding-to-a-component-interaction
   */
  if (type === InteractionType.MESSAGE_COMPONENT) {
    // custom_id set in payload when sending message component
    const componentId = data.custom_id;
  }
});

// client.once("ready", () => {
//   console.log("I'm ready !");
// });

app.listen(3000, () => {
  console.log('Listening on port 3000');

  // Check if guild commands from commands.json are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    PLAY_COMMAND
  ]);
});
