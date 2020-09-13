const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4:uuidv4} = require('uuid');
const io = require('socket.io')(server)
//peer js 
const {ExpressPeerServer} = require('peer');
const peerServer = ExpressPeerServer(server,{debug:true}); 


// telling where to look for 
app.use(express.static('public'));

app.use('/peerjs', peerServer); 

// to render the html we need view engine which is ejs in our case
app.set('view engine', 'ejs');

//redirection to random uuid
app.get('/',(req, res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req,res)=>{
    res.render('room',{roomId: req.params.room})
})
// this gonna run anytime someone connects to our web page
//admiting a socket here this is the actual socket the user is connecting to.
io.on('connection', socket=>{
    //setting up the events to listen to
    //this event is when someone connects to the room
    socket.on('join-room',(roomId, userId)=>{
        //we want the current socket to join the room 
        socket.join(roomId)
        //brodcasting message to the the room
        socket.to(roomId).broadcast.emit('user-connected', userId);
        socket.on('message', message=>{
            io.to(roomId).emit('createMessage', message)
        });
        socket.on('disconnect', () => {
            socket.to(roomId).broadcast.emit('user-disconnected', userId)
        })
    })
})

server.listen(process.env.PORT||3030);
