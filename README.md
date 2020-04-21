# NyaaStats
A user state page builder for Minecraft.

# How to use
You can simply build your own web pages, just follow this instruction.

_You need to do these command in a series._

## First grab user data from map folder
1. Clone the project.
2. `npm install`.
3. Rename config.example.yml to config.yml and modify it.
4. Run `npm start`. This will take long time to grab the informations for each user, be patient. Your data will be written to your `output` directory defined in config file.

## Build web pages
1. Go into `web` folder.
2. `npm install && npm run build`.

## Build skin render
1. Go into `skin` folder.
2. `npm install && npm run build`.

## That's all
Now you can find all the files you need in the `web/dist` folder.

Move files in place:

* Move everything under `web/dist` to your webroot
* Move the output directory you defined to `webroot/data`

### Final File Structures

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
  + skin
```

Upload webroot to you server, and configure your nginx server like this:

```
server {
  listen 80 default_server;
  listen [::]:80 default_server;

  root /your/root/path;

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

> Notice:

>If you want to deploy without nignx, you will need to change the router mode from `history` to `hash` [here](https://github.com/NyaaCat/NyaaStats/blob/713303de573ac36b9cd7ef8f20100aa3eb993273/web/src/router/index.js#L11). Remember to rebuild web pages.

## Update player data

Run `npm start` in the root folder of this project which means recreate the data folder and upload it to your web root. You don't need to run other commands everytime you update players' data but needed when we upgrade the code of our web client.




# Credits
The skin render is almost a copy from [NameMC](https://namemc.com). Thanks for their excellent work.
