const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const fs=require("fs");

console.log(path.join(__dirname,"../public"));
// Express Middleware for serving static files
app.use(express.static(path.join(__dirname,"../public")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,'../public/index.html'));
});

app.get("/audio",function(req,res){

  console.log("----");

  stat = fs.statSync('../public/audio.mp3');
  res.writeHead(200, {
      'Content-Type': 'audio/mpeg',
      'Content-Length': stat.size
  });

  fs.createReadStream('../public/audio.mp3').pipe(res);
});

app.get("/video",function(req,res){
    const range = req.headers.range;
    if(!range){
        res.status(400).send("requires range header");
    }
    
        
   const videoPath="../public/video.mp4";
   const videoSize=fs.statSync("../public/video.mp4").size;

   

    const CHUNK_SIZE=10**6;

    const start=Number(range.replace(/\D/g,""));
    const end=Math.min(start+CHUNK_SIZE,videoSize-1);

    const contentLength=end-start+1;

    const headers={
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges":"bytes",
        "Content-length":contentLength,
        "Content-Type":"video.mp4"
    }

    res.writeHead(206,headers);

    const videoStream=fs.createReadStream(videoPath,{start,end});

    videoStream.pipe(res);
});

// io.on('connection', (socket) => {
//   console.log('a user connected');

//   socket.on("videoPlay",()=>{
//     console.log("clicked");
//     io.sockets.emit("playVideo");
//   });

//   socket.on("audioPlay",()=>{
//     console.log("clicked");
//     io.sockets.emit("playAudio");
//   });

//   socket.on("audioPause",()=>{
//     socket.broadcast.emit("pauseAudio");
//   })

//   socket.on("resumed",()=>{
//     socket.broadcast.emit("resumeAudio");
//   })

// });

// ---------------------------------------------



io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on("videoPlay",()=>{
    
    console.log("clicked path");
    io.sockets.emit("playVideo");
  });

  socket.on("audioPlay",()=>{
    console.log("clicked");
    io.sockets.emit("playAudio");
  });

  socket.on("audioPause",()=>{
    socket.broadcast.emit("pauseAudio");
  })

  socket.on("resumed",()=>{
    socket.broadcast.emit("resumeAudio");
  })


  socket.on("videoPaused",()=>{
    socket.broadcast.emit("pauseVideo");
  })

  socket.on("videoResumed",()=>{
    console.log("--ress--");
    socket.broadcast.emit("resumeVideo");
  })

});



const users = {};

 io.on('connection', socket=>{
    console.log("conn");
     socket.on('new-user-joined', name=>{
         console.log("New user", name);
         users[socket.id] = name;
         socket.broadcast.emit('user-joined', name);
     });

     socket.on('send', message=>{
         socket.broadcast.emit('receive', {message: message, name: users[socket.id]})
     });

     socket.on('disconnect', message=>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
 })







server.listen(8000, () => {
  console.log('listening on *:8000');
});