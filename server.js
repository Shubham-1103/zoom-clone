const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4:uuidv4} = require('uuid');
const io = require('socket.io')(server)

// telling where to look for 
app.use(express.static('public'));

//redirection to random uuid
app.get('/',(req, res)=>{
    res.redirect(`/${uuidv4()}`);
})

app.get('/:room', (req,res)=>{
    res.render('room',{roomId: req.params.room})
})

io.on('connection', socket=>{
    socket.on('join-room',(roomId)=>{
        socket.join(roomId)
        socket.to(roomId).broadcast.emit('user-connected');
    })
})

// to render the html we need view engine which is ejs in our case
app.set('view engine', 'ejs');


server.listen(3030);