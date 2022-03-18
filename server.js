const http = require("http");
const express = require('express');
const fs = require('fs');
const socket = require('socket.io');
const lib = require("./lib/lib");

class Server {
    instance; // for singleton

    server;
    app;
    io;
    activeSockets = [];

    PORT = 3000;
    HOST = 'localhost';

    constructor() {
        if(Server.instance == null) {
            Server.instance = this;
        }
        Server.instance.initialize();
        Server.instance.configApp();
        Server.instance.handleRoute();
        Object.freeze(this);
        return Server.instance;
    }

    initialize() {
        this.app = express();
        this.server = http.createServer(this.app);
        this.io = socket(this.server);
    }

    handleRoute() {
        this.app.get("/", async (req, res) => {
            res.locals.videos = [];
            try {
                const videos = await lib.getAllVideos();
                res.locals.videos = videos;
            }
            catch(err) {
                console.log(err);
            }
            finally {
                res.render('index');
            }
        });

        this.app.get("/videos", async (req, res) => {
            res.locals.videos = [];
            try {
                const videos = await lib.getAllVideos();
                res.locals.videos = videos;
            }
            catch(err) {
                console.log(err);
            }
            finally {
                res.render('videos');
            }
        });

        this.app.get('/videos/:id', async (req, res) => {
            // videos other than current video for suggestion
            res.locals.video_info = {};
            res.locals.sug_videos = [];
            try {
                let videos = await lib.getAllVideos();
                videos = videos.filter(vd => {
                    if(vd["id"] === req.params.id) {
                        res.locals.video_info = vd;
                    }
                    return vd["id"] !== req.params.id;
                });
                res.locals.sug_videos = videos;
            }
            catch(err) {
                console.log(err);
            }
            finally {
                res.render('video-view');
            }
        })

        // for streaming video
        this.app.get("/video/:id", async (req, res) => {
            try {
                const range = req.headers.range;

                const videoPath = await lib.getVideoPathById(req.params.id);
                const videoSize = fs.statSync(__dirname+videoPath).size;

                const CHUNK_SIZE = 10**6; // 1MB
                const start = Number(range.replace(/\D/g, ""));
                const end = Math.min(start+CHUNK_SIZE, videoSize-1);
                const contentLength = end-start+1;
                const headers = {
                    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
                    'Accept-Range': "bytes",
                    'Content-Length': contentLength,
                    'Content-Type': 'video/3gp'
                };
                res.writeHead(206, headers);
                const stream = fs.createReadStream(__dirname+videoPath, {start, end});
                stream.pipe(res);
            }
            catch(err) {
                console.log(err);
                res.json({isError: true, error_text: "No video found"});
            }
        });

        this.app.all("/*", (req, res) => {
            res.redirect("/");
        });
    }

    configApp() {
        this.app.set("view engine", "ejs");
        this.app.use("/public" ,express.static(__dirname+"/public"));
        this.app.use(express.json());

        // error middleware
        this.app.use((err, req, res, next) => {
            res.status(500).end("Server error");
        })
    }

    listen() {
        this.server.listen(this.PORT, () => {
            console.log(`Server running on ${this.HOST}:${this.PORT}`);
        })
    }
}

module.exports = Server;