const socket = io('/');
const videoGrid = document.getElementById('video-grid');
const myVideo = document.createElement('video');
myVideo.muted = true;
let myVideoStream;
//gives the ability to get vedio and audio output from chrome
// it will return promise it can be resolved or not.
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream =>{
    myVideoStream = stream;
    addVedioStream(myVideo, stream);
})
const addVedioStream = (video, stream)=> {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
        video.play();
    })
    videoGrid.append(video);
}
socket.on('user-connected', ()=>{
    connectToNewUser();
})

const connectToNewUser = () =>{
    console.log('new user');
}
socket.emit('join-room', ROOM_ID)