import React from 'react';
import ReactDOM from 'react-dom';
import { v4 as uuid } from 'uuid';

const LEVEL = {
    INFO: "has-text-light",
    WARNING: "has-text-warning",
    WARN: "has-text-warning",
    ERROR: "has-text-danger"
};

class Box extends React.Component {
    ref = React.createRef();
    state = {

    };

    remove() {
        this.setState({
            message: false
        });
    }

    show(message, buttons, level) {
        this.setState({
            message: message,
            level: level || LEVEL.INFO,
            buttons: buttons || [{label: "OK" , isPrimary: true}]
        });
    }

    render() {
        if (typeof this.state.message === "string") {
            const onButtonClick = (button) => {
                if (typeof button.onClick === "function") {
                    button.onClick();
                }
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
                        <h3 className={this.state.level}>{this.state.message}</h3>
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
    show: function() {
        ref.current.show.apply(ref.current, arguments);
    },
    remove: () => {
        ref.current.remove();
    },
    LEVEL: LEVEL
}