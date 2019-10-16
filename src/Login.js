import React, { Component } from 'react'

export default class Login extends Component {
    constructor(){
        super();
        this.state = {name: '', user: null, error: ''}
    }
    onInputChange = ({target}) => {
        this.setState({name: target.value});
        console.log(this.state.name);
      }
    onFormSubmit = (e) => {
       const {setUser} = this.props;
        e.preventDefault();
        const {socket} = this.props;
        const {name} = this.state;               
        if(name.length <= 0){
            const err = 'You have not entered any name';                    
            this.setState({error: err});
        }
        else {
          socket.emit('NAME', this.state.name, ({error, user}) =>{
            console.log(`error: ${error}, user: ${JSON.stringify(user)}`);
            if(user){
              setUser(user);     
              this.setState({error: ''})          
            }
            else{            
              this.setState({error});
            }             
          });      
        }
        
      }
    render() {
        console.log(this.props.socket);
        const {error} = this.state;               
        return (
            <div className='tc w-50'>
                <form onSubmit={this.onFormSubmit}>
                    <label htmlFor='name'>Enter your name</label>
                    <input onChange={this.onInputChange} ref={(input) => { this.textInput = input}} id='name' placeholder={'Enter Your Name'} value={this.state.name} />                            
                </form>   
                {error.length > 0 && <div>{error}</div>}
            </div>
        )
    }
}

