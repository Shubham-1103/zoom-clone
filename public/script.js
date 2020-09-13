// getting the reference to the socket
const socket = io('/')
const videoGrid = document.getElementById('video-grid')
const myVideo = document.createElement('video')
myVideo.muted = true
let myVideoStream
// peer library allow us to run the peer server
/**
 * param 1: it is an Id we left it undefined beacuse we want our peer server to take care of Id generation.
 * param 2: host, port  
 */  
var peer = new Peer(undefined, {
    path: '/peerjs',
    host: '/',
    port: '443'
});
//gives the ability to get vedio and audio output from chrome
// it will return promise it can be resolved or not.
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVedioStream(myVideo, stream);
    peer.on('call', call=>{
        call.answer(stream)
        const vedio = document.createElement('vedio')
        call.on('stream', userVedioStream=>{
            addVedioStream(vedio, userVedioStream)
        })
    })
    //listening to the event when user connected 
    socket.on('user-connected', (userId, stream)=>{
        setTimeout(()=>connectToNewUser(userId,stream), 3000);
    })


    const  connectToNewUser = (userId, stream) =>{
        // this will call a user to which we had given a certain ID
        const call =  peer.call(userId,stream);
        const vedio = document.createElement('vedio'); 
        //when user will send us his stream 
    call.on('stream', userVedioStream=>{
            addVedioStream(vedio,userVedioStream)
        })
    }

    let text = $('input')

    $('html').keydown((e)=>{
        if(e.which == 13 && text.val().length !=0){
        socket.emit('message', text.val());
        text.val('')
        }
    }) 
    socket.on('createMessage', message=>{
        $('ul').append(`<li class = "message"><b>user</b><br/>${message}</li>`);
        scrollBottom();
    })
})
const addVedioStream = (video, stream)=> {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
} 
/**
 * as soon as we actually connect with our peer server and get back an ID 
 * we actually want to run this code.
 */
peer.on('open', id=>{
    socket.emit('join-room', ROOM_ID, id);
})



const scrollBottom = ()=>{
    let d = $(".main__chat__window");
    d.scrollTop(d.prop("scrollHeight"));
}

const muteUnmute = () =>{
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if(enabled){
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    }
    else{
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}
const setMuteButton = ()=>{
    const html = `<i class = "fas fa-microphone"></i>
    <span>Mute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html; 
}

const setUnmuteButton = ()=>{
    const html = `<i class = "unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
    `
    document.querySelector('.main__mute__button').innerHTML = html; 
}

const playStop = ()=>{
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if(enabled){
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo();
    }
    else{
        setStopVideo();
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}

const setPlayVideo = ()=>{
    const html = `
    <i class="stop fas fa-video-slash"></i>
    <span> Play Video <span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

const setStopVideo = ()=>{
    const html = `
    <i class="fas fa-video"></i>
    <span> Stop Video <span>
    `
    document.querySelector('.main__video__button').innerHTML = html;
}

