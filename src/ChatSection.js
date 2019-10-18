import React, { Component } from 'react';
import Users from './Users';
import MessageInput from './MessageInput';
import Messages from './Messages';

export default class ChatSection extends Component {
    constructor(){
        super();
        this.state = {users: null, receiver: null, oppositeChatter: null, publicMessages: null, privateMessages: null, activePrivateMessages: [], 
                        isPublic: true, error: '', typer: null, isTyping: false, popup: false}
    }
    componentWillMount(){        
        this.initSocket(this.props.socket);        
      }
      initSocket = (socket) => {                            
        socket.on('USERS', (users) => {
          console.log(users);
          this.setState({users});
        });     

        //oppositeChatter is receiver if this user is sender, and is user if it received message from the user
        //popup will be true for the receiver, not sender
        socket.on('MESSAGE', (messages, isPublic, oppositeChatter, popup) => { 
           console.log(messages);           
           console.log(isPublic); 
           console.log(popup);            
           isPublic ? this.setState({publicMessages: messages}) :
                 this.setState({activePrivateMessages: messages, oppositeChatter, popup});        
        }                         
        );
        socket.on('TYPING', (isTyping, typer) => {      
            this.setState({isTyping, typer});
        });  
    }
    setReceiver = (receiver) => {        
        this.setState({receiver, isPublic: false});
        console.log(receiver);
    }
    setPublicChat = () => {
        this.setState({ receiver: null, isPublic: true});
    }
    setMessage = (message) => {
        const {socket, user} = this.props;
        const {isPublic, receiver} = this.state;     
        console.log(isPublic, receiver);
        if(user){ 
          socket.emit('MESSAGE', message, user, isPublic, receiver);          
         }         
         else {
            this.setState({error: 'before sending a message, please first log in'});
         }
        this.setTyping(false);   
    }
    setTyping = (isTyping) => {
        const {socket, user} = this.props;
        const {isPublic, receiver} = this.state;
        socket.emit('TYPING', isTyping, isPublic, user, receiver);    
    }
    
    
    render() {
        const {users, oppositeChatter, error, publicMessages, privateMessages, activePrivateMessages, isPublic, popup} = this.state;
        const {user} = this.props;
        console.log(activePrivateMessages, publicMessages, privateMessages, oppositeChatter, popup, isPublic);
        return (
            <div>
                <div className='f4 fw6 ma5 tc red'>Your are logged in as {user && user.name}</div>
                <div className='flex'>                
                    <div className='w-20'>
                    <Users users={users} user={user} setReceiver={this.setReceiver} setPublicChat={this.setPublicChat} />
                    </div>                
                    <div className='w-80 flex flex-column justify-end'>
                        <Messages oppositeChatter={oppositeChatter} publicMessages={publicMessages} privateMessages={privateMessages}
                                 activePrivateMessages={activePrivateMessages} user={user} isPublic={isPublic} popup={popup} />
                        <MessageInput setMessage={this.setMessage} userError={error} setTyping={this.setTyping} />
                    </div>               
                    
                </div>
            </div>
            
        )
    }
}
