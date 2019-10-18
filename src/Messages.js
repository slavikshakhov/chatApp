import React, {Component} from 'react';
import './Popup.css';




export default class Messages extends Component {
    constructor(){
        super();
        this.state = {}
    }    
    printPublicMessages = (publicMessages) => {
        const {user} = this.props;
        const publicMes = publicMessages ? 
                publicMessages.map((mes, i) => {                   
                    console.log(mes);
                    console.log(mes.time);        
                    return (
                        <div key={i} className={(user && mes.sender) && user.name === mes.sender.name ? 'red f5 ph3 pv2' : ''}>
                            <div>Message from {mes.user.name[0].toUpperCase() + mes.user.name.slice(1)} to All <span>sent at {mes.time}</span></div>            
                            <div className='fw6'>{mes.message}</div>             
                        </div>
                    )
                
                }) : null;
       return publicMes;
    }
    /*

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
    
    */
   //activePrivateMessages is array of messages related to the sender (user) with corresponding private receivers
   printPrivateMessagesOfActiveReceiver = (activePrivateMessages) => {   
       console.log(activePrivateMessages);
       return activePrivateMessages.map(mes => {
           return (
               <div key={mes.id}>
                   <div>{mes.message}</div><span className='ml3 green'>Sent at {mes.time}</span>
               </div>
           )
       })
   }
    render(){   
        const {publicMessages, privateMessages, activePrivateMessages, oppositeChatter, popup} = this.props;  
         console.log(publicMessages, privateMessages, activePrivateMessages, oppositeChatter);
         const popupClass = popup ? 'popup' : '';
         const classes = `tc fw3 f5 ttu ${popupClass}`;

         let publMes = !publicMessages ? null : publicMessages.length > 0 ? this.printPublicMessages(publicMessages) : null;
        return (
            
            <div className='w-100 h-100 bg-yellow flex'>                
                    <div className='bg-light-blue w-50'>
                    <div className='tc fw3 f5 ttu'><span className='fw5 f3'>public Messages</span> Sent to All Logged in Users</div>
                    {publMes}                    
                </div>   
                
                {activePrivateMessages.length > 0 && 
                    <div className='bg-yellow w-50'>
                    <div className={classes}><span className='fw5 f3'>Private Messages with {oppositeChatter.name}</span> 
                            <div>{ this.printPrivateMessagesOfActiveReceiver(activePrivateMessages) }</div>                                                     
                    </div> 
                           
                </div>                
                }              
                
            </div>
        )
    }
   
}
