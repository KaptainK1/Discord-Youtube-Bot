import 'dotenv/config';
import fetch from 'node-fetch';
import { verifyKey } from 'discord-interactions';
import gapi from 'googleapis';

//need to import google apis here

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
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
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

// Simple method that returns a random emoji from list
export function getRandomEmoji() {
  const emojiList = ['😭','😄','😌','🤓','😎','😤','🤖','😶‍🌫️','🌏','📸','💿','👋','🌊','✨'];
  return emojiList[Math.floor(Math.random() * emojiList.length)];
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function getVideo(search){
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
  // console.log(res);
  return res.json();
}

// export async function getVideo(search){
//   console.log("you searched for: " + search);
//   const baseURL = "https://www.googleapis.com/youtube/v3/search?";
//   const params = "part=snippet&type=video&maxResults=1"
//   const key = "&key=" + process.env.YOUTUBE_KEY;
//   const query = "&q=" + search;
//   const url = baseURL + params + key + query;
//   //const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&key=" + process.env.YOUTUBE_KEY + "&q=" + search;
//   const response = await fetch(url)
//   .then(res => {
//     if(res.ok){
//       return res.json()
//     } else {
//       console.log("Error calling youtube api" + res.err)
//     }
//   })
//   .then(data => {
//     console.log(data)
//   })
//   .catch(error => console.warn(error));
//   console.log(response);
//   return response;
// }

//youtube functions
// export function authenticate() {
//   return gapi.auth2.getAuthInstance()
//       .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
//       .then(function() { console.log("Sign-in successful"); },
//             function(err) { console.error("Error signing in", err); });
// }
// export function loadClient() {
//   gapi.client.setApiKey(process.env.YOUTUBE_KEY);
//   return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
//       .then(function() { console.log("GAPI client loaded for API"); },
//             function(err) { console.error("Error loading GAPI client for API", err); });
// }
// // Make sure the client is loaded and sign-in is complete before calling this method.
// export function execute() {
//   return gapi.client.youtube.search.list({
//     "part": [
//       "utxo bitcoin"
//     ]
//   })
//       .then(function(response) {
//               // Handle the results here (response.result has the parsed body).
//               console.log("Response", response);
//             },
//             function(err) { console.error("Execute error", err); });
// }
// gapi.load("client:auth2", function() {
//   gapi.auth2.init({client_id: "YOUR_CLIENT_ID"});
// });