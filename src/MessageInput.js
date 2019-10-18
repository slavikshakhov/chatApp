import React, { Component } from 'react'

export default class MessageInput extends Component {
    constructor(){
        super();
        this.state = {message: '', errors: []}
    }
    onMessageSubmit = (e) => {
        e.preventDefault();
        const {setMessage} = this.props;
        const {message} = this.state;
        if(message.length >= 0){
            setMessage(this.state.message);
            this.setState({message: ''});    
        }
        else  {
            const err = 'The message should be at least one character';
            const {errors} = this.state;
            this.setState({errors: [...errors, err] });
        }
        
    }
    onMessageChange = ({target}) => {
        const {setTyping} = this.props;
        let isTyping = target.value.length >= 1 ? true : false;
        this.setState({message: target.value});
        console.log(this.state.message);    
        setTyping(isTyping);    
    }
    submitText = e => {
        if(e.keyCode === 13) {
          this.onMessageSubmit(e);
        }
      }
    render() {
        const {errors} = this.state;
        const {userError} = this.props;
        let errs = [];
        if(userError.length > 0){
            errs = [...errors, userError]
        }
        const mappedErrors = errs.length > 0 ? errs.map((er, i) => {
            return <div key={i}>{er}</div>
        })
            : null;
        const classes = errors.length > 0 ? 'bg-red' : '';
        return (
            <div className='h4 tc bg-grey'>
                <form className='w-100 flex flex-row'>                    
                    <textarea className='w-100 h4 mr2' id='message' placeholder='Enter your message here' 
                            ref={(input) => { this.textInput = input}} onChange={this.onMessageChange} value={this.state.message}
                            onKeyDown={this.submitText} />
                    {/* <input type='submit' value='Send' /> */}                    
                </form>
                <div className={classes}>{mappedErrors}</div>
            </div>
        )
    }
}
