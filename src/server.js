
const app = require('http').createServer();
const io = require('socket.io')(app);
const uuid = require('uuid/v4');


let users = {};
let messages = [];
let privateMessages = [];



io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('NAME', (name, cb) => {
        if(name in users){
            cb({error: 'username is taken', user: null});
        }
        else {
            cb({error: '', user: {name, id: uuid(), socketID: socket.id}});
        }
    });
    socket.on('USER_TO_USERS', (user) => {
        const allUsers = Object.assign({}, users);
        allUsers[user.name] = user;
        users = allUsers;
        console.log(users);
        io.emit('USERS', users);
    });
    socket.on('MESSAGE', (message, user, isPublic, receiver = null) => {
        const messageObj = {message, isPublic, sender: user, receiver, id: uuid(), time: getTime(new Date(Date.now()))};        
        // eslint-disable-next-line no-unused-expressions
        isPublic ? io.emit('MESSAGE', messageObj) :
                 (socket.broadcast.to(receiver.socketID).emit('MESSAGE', messageObj), socket.emit('MESSAGE', messageObj))        
    });
    socket.on('TYPING', (isTyping, isPublic, user, receiver) => {
        if(isTyping && isPublic){          
             socket.broadcast.emit('TYPING', isTyping, user);   
        }          
        else if(isTyping && !isPublic){
            socket.broadcast.to(receiver.socketID).emit('TYPING', isTyping, user);           
        } 
        else if(!isTyping) {
            io.emit('TYPING', false, null);  
        }
    });       
});

const getTime = (date)=>{
    return `${date.getHours()}:${("0"+date.getMinutes()).slice(-2)}`; }

app.listen(3231, () => console.log(`server is running on port 3231`));