const express = require('express');
const app = express();
const server = require('http').Server(app);

app.get('/',(req, res)=>{
    res.render('room');
})
// to render the html we need view engine which is ejs in our case
app.set('view engine', 'ejs');


server.listen(3030);