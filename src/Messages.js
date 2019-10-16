import React, {Component} from 'react';



export default class Messages extends Component {
    constructor(){
        super();
        this.state = {}
    }    
    printPublicMessages = () => {
        const {publicMessages, user} = this.props;
        const publicMes = publicMessages ? 
                publicMessages.map((mes, i) => {                   
                    console.log(mes);
                    console.log(mes.time);        
                    return (
                        <div key={i} className={(user && mes.sender) && user.name === mes.sender.name ? 'red f5 ph3 pv2' : ''}>
                            <div>Message from {mes.sender.name[0].toUpperCase() + mes.sender.name.slice(1)} to {mes.receiver.name} <span>sent at {mes.time}</span></div>            
                            <div className='fw6'>{mes.message}</div>             
                        </div>
                    )
                
                }) : null;
       return publicMes;
    }
    printPrivateMessages = () => {
        const {privateMessages, user} = this.props;  
        let grouppedMessages = {};             
        if(privateMessages.length > 0){            
            for(const {sender, receiver, id, message, time, isPublic} of privateMessages){
                if(!grouppedMessages[sender.name]){
                    grouppedMessages[sender.name] = [];
                }
                grouppedMessages[sender.name].push({receiver, id, message, time, isPublic});                              
            } 
            //this.setState({grouppedMessages});   
                
        }        
        console.log(privateMessages);
        console.log(grouppedMessages);
        const privateMessagesBySender = grouppedMessages ? Object.keys(grouppedMessages).map((senderOfThisMessage, i) => {
                    return (
                        <div key={i} className='ma2 ba'>
                            <div>Chat with {senderOfThisMessage}</div>
                            {
                                grouppedMessages[senderOfThisMessage].map((mes, i) => {
                                    console.log(mes);
                                    return (
                                        <div key={i} className={(user && mes.receiver) && user.name === mes.receiver.name ? '' : 'red f5'}>                    
                                            <div>{mes.message}</div>
                                            <div>sent at {mes.time}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )                    
                }) : null
        return privateMessagesBySender;
    }   
    
    render(){               
        return (
            <div className='w-100 h-100 bg-yellow flex'>
                <div className='bg-light-blue w-50'>
                    <div className='tc fw3 f5 ttu'><span className='fw5 f3'>public Messages</span> Sent to All Logged in Users</div>
                    <div className='pv4'>{this.printPublicMessages()}</div>
                </div>                 
                <div className='bg-yellow w-50'>
                    <div className='tc fw3 f5 ttu'><span className='fw5 f3'>Private Messages</span> with Selected Logged In Users
                             {!this.props.privateMessages && <p>{`Empty now`}</p>}
                    </div>
                    <div>{this.printPrivateMessages()}</div>                
                </div>
            </div>
        )
    }
   
}
