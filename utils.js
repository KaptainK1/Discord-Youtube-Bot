import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';


export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get('X-Signature-Ed25519');
    const timestamp = req.get('X-Signature-Timestamp');

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send('Bad request signature');
      throw new Error('Bad request signature');
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = 'https://discord.com/api/v9/' + endpoint;
  console.log(endpoint)
  console.log(options);
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  console.log(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ...options
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export async function searchVideo(search){
  console.log("you searched for: " + search);
  const baseURL = "https://www.googleapis.com/youtube/v3/search?";
  const params = "part=snippet&type=video&maxResults=1"
  const key = "&key=" + process.env.YOUTUBE_KEY;
  const query = "&q=" + search;
  const url = baseURL + params + key + query;
  //const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&key=" + process.env.YOUTUBE_KEY + "&q=" + search;
  const res = await fetch(url);

  if(!res.ok){
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  return res.json();
}


export async function GetChannel(channelName, guildID){

  const channelURL = `guilds/${guildID}/channels`;
  const channelRequest = await DiscordRequest(channelURL, { method: 'GET' } );
  const channels = await channelRequest.json();
  let _channel = null;

  channels.forEach(channel => {
    // console.log(channel.name);
    if(channel.name === channelName){
      _channel = channel;
    }
  });

  return _channel;

}

export async function GetGuild(guildID){
  const guildURL = `guilds/${guildID}`;
  const guildURequest = await DiscordRequest(guildURL, { method: 'GET' } );
  const guild = await guildURequest.json();
  return guild;
}
