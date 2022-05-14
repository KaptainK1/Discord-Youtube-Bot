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
import WebSocket from 'ws';
import { Client, Intents, Interaction, VoiceChannel } from 'discord.js';

// import { joinVoiceChannel } from '@discordjs/voice';

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES] });

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

  // console.log(client);
  // console.log(player);

  // console.log("Voice from client");
  // const { voice } = client;
  // console.log(voice);

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





    if (name === 'play') {
      // console.log("Search:")
      // console.log(data);

      // const video = await getVideo(value);
      let video = await getVideo(value);
      // console.log("Youtube Video:")
      //  console.log(video)

       let youtube_id = video.items[0].id.videoId;
      //  console.log("Youtube ID:")
      // console.log(youtube_id);

      if(video != null){
        // video = `<iframe src="https://www.youtube.com/watch?v=${youtube_id}>`
        // console.log(video);
      } else {
        console.log("error with video")
      }
      
      const channel = await GetChannel("music", guild_id);
      const channelID = channel.id;
      console.log(channelID);
      if(channelID == null){
        throw new Error("Channel name not found. exiting")
      }

      // const connection = joinVoiceChannel({
      //   channelId: channel_id,
      //   guildId: guild_id,
      //   adapterCreator: channel.guild.voiceAdapterCreator,
      // });

      // console.log(connection);

      if ( channel_id !== channelID) {

      // return res.send({
      //   type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      //   data: {
      //     // content: 'you searched for: ' + value,
      //     content: `You are not in the music voice channel!`,
      //   },
      // });
    }

      //get the guild object which is needed for the queue
      const newguild = await client.guilds.fetch(guild_id);

      //get the channel object which is needed for the queue
      const newChannel = await newguild.channels.fetch(channelID);
                          // .then(channel => console.log(channel.name))
                          // .catch(console.error);

      const resolvedChannel = newguild.channels.resolve(newChannel);

      console.log("resolved Channel:");
      console.log(resolvedChannel);
      console.log(resolvedChannel === newChannel);

      //move member functionality if needed
      // const moveMemberURL = `guilds/${guild_id}/members/964914300684750848`;
      // const moveMemberRequest = await DiscordRequest(moveMemberURL, {method: 'PATCH', body: {channel_id: channelID}});
      // const moveMemberResult = await moveMemberRequest.json();
      // const channelRequest = await DiscordRequest(channelURL, { method: 'GET' } );
      const gatewayRequest = await DiscordRequest('gateway/bot', {method: 'GET'});
      // console.log("gatewayRequest")
      // console.log(gatewayRequest.json())

      // const ws = new WebSocket(`wss://${gatewayRequest.url}`);
      // console.log(`wss://${gatewayRequest.url}`);

      // ws.on('open', function open() {
      //   ws.send({
      //     "op": 4,
      //     "d": {
      //       "guild_id": `${guild_id}`,
      //       "channel_id": `${channelID}`,
      //       "self_mute": false,
      //       "self_deaf": false
      //     }
      //   });
      // });
      
      // ws.on('message', function message(data) {
      //   console.log('received: %s', data);
      // });
    

      //begin music player code

      const query = `https://www.youtube.com/watch?v=${youtube_id}>`;
      // const queue = player.createQueue(newguild, {
      //   metadata: {
      //     channel: resolvedChannel
      //   }
      // });

      player.play(message, query);

      
      // console.log(queue.toJSON());
      // console.log(resolvedChannel);


      //get the connection to the voice channel
      /*
      try {
        console.log("queue.connection");
        console.log(queue.connection);
        if(!queue.connection) await queue.connect(resolvedChannel);
        console.log("queue.connection");
        console.log(queue.connection);

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
      */



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
