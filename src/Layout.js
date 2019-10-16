import React, { Component } from 'react';
import io from 'socket.io-client';
import Login from './Login';
import ChatSection from './ChatSection';

export default class Layout extends Component {
    constructor(){
        super();
        this.state = {socket: null, user: null}      
      }
      componentWillMount(){
        this.initSocket();
      }
      initSocket = () => {
        const socket = io("http://localhost:3231").on('connect', () => {console.log('connected to server')});
        this.setState({socket});       
      }
      setUser = (user) => {
        const {socket} = this.state;
        socket.emit('USER_TO_USERS', user);
        this.setState({user});
      }
      render(){
        const {socket, user} = this.state;
        return (
          <div className='w-100 vh-75 flex items-center justify-center'>
            <div className='w-100'>
            {
              !user ? <Login socket={socket} setUser={this.setUser}/> :
                          <ChatSection socket={socket} user={user}/> 
              }           
            </div>
                                  
          </div>
        );
      }  
}

