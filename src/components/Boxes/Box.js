import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuid } from 'uuid';

class Box extends React.Component {
    ref = React.createRef();
    state = {

    };

    remove() {
        this.setState({
            message: false
        });
    }

    show(message, buttons) {
        this.setState({
            message: message,
            buttons: buttons
        });
    }

    render() {
        if (typeof this.state.message === "string") {
            const onButtonClick = (button) => {
                button.onClick();
                this.remove();
            }
    
            const buttons = this.state.buttons.map(button => {
                const css = "button is-hoverable" + (button.isPrimary ? " is-primary" : "");
    
                return (
                    <button key={uuid()} className={css} onClick={onButtonClick.bind(this, button)}>
                        {button.label}
                    </button>
                );
            });
    
            return (
                <div ref={this.ref} className="message-box">
                    <div className="content box">
                        <h3 className="has-text-light">{this.state.message}</h3>
                        <div className="buttons is-right">
                            {buttons}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="hidden"></div>
            );
        }
        
    }
}

const ref = React.createRef();

ReactDOM.render(
    <React.StrictMode>
        <Box ref={ref}/>
    </React.StrictMode>,
    document.getElementById("boxes")
);

export default {
    show: (message, buttons) => {
        ref.current.show(message, buttons);
    },
    remove: () => {
        ref.current.remove();
    }
}