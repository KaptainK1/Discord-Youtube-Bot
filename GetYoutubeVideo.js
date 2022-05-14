const fetch = require('node-fetch');
require('dotenv').config();

async function getVideo(search){
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