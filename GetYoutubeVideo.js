const fetch = require('node-fetch');
// import fetch from 'node-fetch';
require('dotenv').config();

module.exports = async(videoID) => {
    console.log("videoID: " + videoID);
    const baseURL = "https://www.googleapis.com/youtube/v3/videos?";
    const params = "part=contentDetails,id,player,statistics,snippet"
    const video_ID = `&id=${videoID}`;
    const key = "&key=" + process.env.YOUTUBE_KEY;
    const url = baseURL + params + video_ID + key;
    //const url = "https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&key=" + process.env.YOUTUBE_KEY + "&q=" + search;
    const res = await fetch(url);
  
    if(!res.ok){
      const data = await res.json();
    //   console.log(res.status);
      throw new Error(JSON.stringify(data));
    }
    return res.json();
  };