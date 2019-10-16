import React, { Component } from 'react'

export default class Users extends Component {
    render() {
        const {user, users, setReceiver, setPublicChat} = this.props;        
        const otherUsers = (users && user) ?
           Object.keys(users).filter(u => users[u].name !== user.name).map((u, i) => { 
              console.log(users[u].name);
              return (<div>                        
                        <div className='dib'>name: {users[u].name}</div>
                        <button className='dib bg-green'  key={i} onClick={() => setReceiver(users[u])}>Select</button>                        
                      </div>)
           }
          )  
           : null;              
        return (
            <div>
                <div className='dib ma3'>Public Chat</div>                
                <button className='dib bg-green' onClick={setPublicChat}>Select</button>
                <div>{otherUsers ? otherUsers : user.name}</div> 
                
                
            </div>
        )
    }
}
