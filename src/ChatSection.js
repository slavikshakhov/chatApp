import React, { Component } from 'react';
import Users from './Users';
import MessageInput from './MessageInput';
import Messages from './Messages';

export default class ChatSection extends Component {
    constructor(){
        super();
        this.state = {users: null, receiver: {name: 'all'}, isPublic: true, error: '', 
            publicMessages: [], privateMessages: [], typer: null, isTyping: false}
    }
    componentWillMount(){        
        this.initSocket(this.props.socket);        
      }
      initSocket = (socket) => {                            
        socket.on('USERS', (users) => {
          console.log(users);
          this.setState({users});
        });     
        socket.on('MESSAGE', (messageObj) => {
           if(messageObj.isPublic){
               const publicMessages = [...this.state.publicMessages, messageObj];
               this.setState({publicMessages})
           }
           else {
            const privateMessages = [...this.state.privateMessages, messageObj];            
            this.setState({privateMessages})
           }
        }                         
        );
        socket.on('TYPING', (isTyping, typer) => {      
            this.setState({isTyping, typer});
        });  
    }
    setReceiver = (receiver) => {        
        this.setState({receiver, isPublic: false});
    }
    setPublicChat = () => {
        this.setState({receiver: {name: 'all'}, isPublic: true});
    }
    setMessage = (message) => {
        const {socket, user} = this.props;
        const {isPublic, receiver} = this.state;               
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
        const {users, receiver, error, publicMessages, privateMessages, isPublic} = this.state;
        const {user} = this.props;
        console.log(receiver);
        return (
            <div>
                <div className='f4 fw6 ma5 tc red'>Your are logged in as {user && user.name}</div>
                <div className='flex'>                
                    <div className='w-20'>
                    <Users users={users} user={user} setReceiver={this.setReceiver} setPublicChat={this.setPublicChat} />
                    </div>                
                    <div className='w-80 flex flex-column justify-end'>
                        <Messages publicMessages={publicMessages} privateMessages={privateMessages} user={user} isPublic={isPublic} />
                        <MessageInput setMessage={this.setMessage} userError={error} setTyping={this.setTyping} />
                    </div>               
                    
                </div>
            </div>
            
        )
    }
}
