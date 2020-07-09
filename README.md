# NyaaStats
A user state page builder for Minecraft.

# How to use
You can simply build your own web pages, just follow this instruction.

_You need to do these commands in a series._

## First grab user data from map folder
1. Clone the project.
2. Run `npm install`.
3. Rename `config.example.yml` to `config.yml`, read it and update it with your preferences.
4. Run `npm start`. It might take a long time running several tasks for each of your players, so be patient. The result data will be written to the directory you defined as `render.output` in `config.yml`.

## Build web pages
1. Go into `web` folder.
2. Run `npm install && npm run build`.

## Prepare to deploy
Now you can find all the files you need in the `web/dist` folder. Create a folder named `webroot` and collect your files:

1. Move everything UNDER `web/dist` to webroot folder.
2. Move the `render.output` directory you defined to `webroot/data`.

Your webroot folder should now look like this:

```
- webroot
  + index.html
  + css
  - data  # here's the data that main application produces
    + info.json
    + players.json
    + (...) Player UUID directories
  + fonts
  + img
  + js
```

## That's all!

Upload webroot folder to your server, and configure your server like this: (We assume you use Nginx)

```
server {
  listen 80 default_server;
  listen [::]:80 default_server;

  root /your/path/to/webroot;

  index index.html;

  server_name example.com;

  location / {
    try_files $uri $uri/ @rewrites;
  }

  location @rewrites {
    rewrite ^(.+)$ /index.html last;
  }
}
```

> If you don't use Nginx, or you don't want to change any server config (by switching to "hash mode"), please read https://router.vuejs.org/guide/essentials/history-mode.html for further information.
> 
> In case you want to switch, the router config can be found at `/web/src/router/index.js`.

## Update player data

Run `npm start` in the root folder of this project which means recreate the data folder and upload it to your web root. You don't need to run other commands everytime you update players' data but needed when we upgrade the code of our web client.

# Credits
The skin render is almost a copy of [NameMC](https://namemc.com). Thanks for their excellent work.
