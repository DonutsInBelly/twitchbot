# Carlin's Twitch Bot

Hello! This is a bot that I have been building for my streams and I pretty much built most of it on stream! If you're interested in what' goes on in the development of the bot, visit my channel at https://www.twitch.tv/dominusbelli

This bot is also free to use if you want use it for yourself!

## Setup

1. Install Node.js
2. `npm install`
3. You may want to remove the `points.json` file if you don't want my currently set points for gambling
4. In `src/app.ts`, look for a line that looks like this

```
const chatClient = new ChatClient(auth, { channels: ["dominusbelli"] });
```

Add whatever channels you want the bot to be in 5. `npm run compile` 6. `npm start`
