# Carlin's Twitch Bot

Hello! This is a bot that I have been building for my streams and I pretty much built most of it on stream! If you're interested in what' goes on in the development of the bot, visit my channel at https://www.twitch.tv/dominusbelli

This bot is also free to use if you want use it for yourself!

## Setup

1. Install Node.js
2. `npm install`
3. Set up the `.env` file. See the next section on what goes in it.
4. You may want to remove the `points.json` file if you don't want my currently set points for gambling
5. In `src/app.ts`, look for a line that looks like this

```
const chatClient = new ChatClient(auth, { channels: ["dominusbelli"] });
```

Add whatever channels you want the bot to be in

6. `npm run compile`
7. `npm start`

## The .env File

```
TWITCH_CLIENT_ID=<Twitch Client ID, get from https://dev.twitch.tv/>
TWITCH_CLIENT_SECRET=<Twitch Client Secret, get from https://dev.twitch.tv/>
TWITCH_ACCESS_TOKEN=<Follow the steps in the next section to get this.>
TWITCH_REFRESH_TOKEN=<Follow the steps in the next section to get this.>
CHANNELS=<list of channels to listen to, comma-separated without spaces>
DISCORD_SERVER_INVITE=<Discord Server invite, if you have one>
```

## Getting Twitch Access Token and Refresh Tokens

1. Have your client ID ready.
2. Wherever REDIRECT_URL is used, use http://localhost if you dont have one.
3. Replace the variables in this url and remove the whitespace

```
https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID
	&redirect_uri=REDIRECT_URI
	&response_type=code
	&scope=chat:read+chat:edit
```

4. Use Postman and send a GET request to that URL, you should get redirected to URL containing the `code` as a query parameter.

```
http://localhost/?code=394a8bc98028f39660e53025de824134fb46313
    &scope=viewing_activity_read
    &state=c3ab8aa609ea11e793ae92361f002671
```

5. Build another URL, this time containing the `code` you got from the previous step.

```
https://id.twitch.tv/oauth2/token?client_id=CLIENT_ID
    &client_secret=CLIENT_SECRET
    &code=CODE_FROM_LAST_REQUEST
    &grant_type=authorization_code
    &redirect_uri=REDIRECT_URI
```

6. This time, using Postman, send a POST request to this new URL. You should receive a JSON response looking like this and should contain your Access Token and Refresh Token for your `.env` file.

```
{
  "access_token": "0123456789abcdefghijABCDEFGHIJ",
  "refresh_token": "eyJfaWQmNzMtNGCJ9%6VFV5LNrZFUj8oU231/3Aj",
  "expires_in": 3600,
  "scope": ["chat:read", "chat:edit"],
  "token_type": "bearer"
}
```
