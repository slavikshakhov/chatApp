import React, {Component} from 'react';
import io from 'socket.io-client';

class App extends Component{
  constructor(){
    super();
    this.state = {name: '', users: null, privateUsers: null, socket: null, user: null, message: '',
                   messages: null, isPublic: true, selectedUser: null, typer: null, error: '' }
  }
  componentDidMount(){
    this.initSocket();
  }
  initSocket = () => {
    const socket = io("http://localhost:3231").on('connect', () => {console.log('connected to server')})
    this.setState({socket});
    socket.on('USERS', (users) => {
      console.log(users);
      this.setState({users});
    });
    socket.on('MESSAGES', (messages) => {
      console.log(messages);
      this.setState({messages});
    });
    socket.on('TYPING', (isTyping, typer) => {      
      this.setState({isTyping, typer});
    })
  }
  onInputChange = ({target}) => {
    this.setState({name: target.value});
    console.log(this.state.name);
  }
  onFormSubmit = (e) => {
    e.preventDefault();
    this.state.socket.emit('NAME', this.state.name, ({error, user}) =>{
      console.log(`error: ${error}, user: ${JSON.stringify(user)}`);
      this.setState({user});     
      this.state.socket.emit('USER_TO_USERS', user);    
    })

  }
  onMessageChange = ({target}) => {
    let isTyping = target.value.length >= 1 ? true : false;
    this.setState({message: target.value});
    console.log(this.state.message);    
    this.setTyping(isTyping);    
  }
  onMessageSubmit = (e) => {
    const {socket, message, user, isPublic, selectedUser} = this.state;
    e.preventDefault();        
    if(message.length > 0 && user){ 
      socket.emit('MESSAGE', message, user, isPublic, selectedUser);
      this.setState({message: ''});
     }
     else if(!user){
        this.setState({error: 'please log in first before typing your message!'});
        this.setState({message: ''});
     }
     else if(message.length === 0){
        this.setState({error: 'you are trying to send an empty message!'});
     }
    this.setTyping(false);    
  }
  setTyping = (isTyping) => {
    const {socket, isPublic, user, selectedUser} = this.state;
    socket.emit('TYPING', isTyping, isPublic, user, selectedUser);    
  }
  setSelectedUser = (selectedUser) => {
    this.setState({selectedUser, isPublic: false})
  }
  setPublicChat = () => {
    this.setState({isPublic: true});
  }
  render(){
    console.log(this.state.messages);
    console.log(JSON.stringify(this.state.users));
    console.log(JSON.stringify(this.state.messageObj));
    const {user, users, messages} = this.state;
    const otherUsers = users && user ?
       Object.keys(users).filter(u => users[u].name !== user.name).map((u, i) => { 
          console.log(users[u].name);
          return (<div key={i} onClick={() => this.setSelectedUser(users[u])}>
                    <div>name: {users[u].name}</div>
                    <div>id: {users[u].id}</div>
                   </div>)
       }
      )  
       : null;    
    console.log(otherUsers);
    
    const allMessages = messages ? 
       messages.map((mes, i) => {
         console.log(mes);
         console.log(mes.time);        
         return (
           <div key={i} className={(user && mes.sender) && user.name === mes.sender.name ? 'red' : ''}>
             <div>Message from {mes.sender.name} <span>sent at {mes.time}</span></div>            
             <div>{mes.message}</div>             
           </div>
         )
          
       }) :
       null;
       
    return (
      <div>
        <form onSubmit={this.onFormSubmit}>
         <label htmlFor='name'>Enter your name</label>
         <input onChange={this.onInputChange} ref={(input) => { this.textInput = input}} id='name' placeholder={'Enter Your Name'} value={this.state.name} />
         <p>logged in user: {this.state.name}</p>         
        </form>          
        <div>
          <div onClick={this.setPublicChat}>Public Chat</div>
            {otherUsers && <div><span>Other logged in users: </span>{otherUsers}</div> }            
        </div>
        <form onSubmit={this.onMessageSubmit}>
          <label htmlFor='message'>Enter your message</label>
          <input id='message' ref={(input) => { this.textInput = input}} onChange={this.onMessageChange} value={this.state.message}/>
        </form>
        <div className='bg-red'>{this.state.error.length > 0 ? this.state.error : ''}</div>
        <div>{(this.state.isTyping && this.state.typer) && (
                <p>{this.state.typer.name} is typing ...</p>                
        )}</div>  
         <div>{allMessages}</div>     
      </div>
    );
  }  
}

export default App;
