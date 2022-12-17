console.log("-done-");

var socket = io();


    const audioButton=document.getElementById('audioButton');
    const audioPlayer=document.getElementById('audioPlayer');
    audioButton.onclick=function(){


        
        filePath.click();
        filePath.addEventListener("change",()=>{
            
            socket.emit("audioPlay");
           // socket.emit("videoPlay");
            console.log(filePath.value);
        })
         //socket.emit("audioPlay");


    }

    
    socket.on("playAudio",()=>{
  
        console.log("****");
        const src=document.getElementById('audioSource');
        src.setAttribute('src','http://localhost:8000/audio');

        audioPlayer.removeAttribute("hidden");

        audioPlayer.load();
        audioPlayer.play();

    });

    audioPlayer.onpause=()=>{
        socket.emit("audioPause");
    }


    socket.on("pauseAudio",()=>{
        audioPlayer.pause();
    });

    audioPlayer.onplay=()=>{
        socket.emit("resumed")
    }

    socket.on("resumeAudio",()=>{
        audioPlayer.play();
    })
    
    const videoButton=document.getElementById("videoButton");    
    const videoPlayer=document.getElementById('videoPlayer');
    let filePath=document.getElementById("filePath");
    videoButton.onclick=function() {


        
        filePath.click();
        filePath.addEventListener("change",()=>{
            
            socket.emit("videoPlay");
            console.log(filePath.value);
        })


    }

    socket.on("playVideo",()=>{

        console.log("--------");
        const source=document.getElementById("source");
        source.setAttribute("src", "http://localhost:8000/video");

        videoPlayer.removeAttribute("hidden");
        
        videoPlayer.load();
        videoPlayer.play();  

    });

    videoPlayer.onpause=()=>{
        socket.emit("videoPaused");
    }

    socket.on("pauseVideo",()=>{
        videoPlayer.pause();
    });

    videoPlayer.onplay=()=>{
        console.log("------")
        socket.emit("videoResumed");
    }

    socket.on("resumeVideo",()=>{
        videoPlayer.play();
    })
     
    // ------------------------------

    const form = document.getElementById('send-container');
    const messageInput = document.getElementById('messageInp');
    const messageContainer = document.querySelector('.container')
    
    var audio = new Audio('ting.mp3');
    
    const append = (message, position)=>{
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.classList.add('message');
        messageElement.classList.add(position)
        messageContainer.append(messageElement);
        messageContainer.scrollTop = messageContainer.scrollHeight;
        if(position == 'left'){
            console.log('sound is playing');
            audio.play();
        }
    }
    
    
    form.addEventListener('submit', (e)=>{
        e.preventDefault();
        const message = messageInput.value;
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        messageInput.value = '';
    })
    
    // const name = prompt("Enter your name to join LetsChat")
    const name="stranger";
    socket.emit('new-user-joined', name)
    
    socket.on('user-joined', name=>{
        append(`${name} joined the chat`, 'right');
    })
    
    socket.on('receive', data=>{
        append(`${data.name }: ${data.message}`, 'left')
    })
    
    socket.on('left', name=>{
        append(`${name } left the chat`, 'left');
    })
    


