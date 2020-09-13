import React from 'react';
import FormComponent from './FormComponent';

/**
 *  {String} label
 *  {String} type - default 'text'
 *  {String} placeholder
 *  {Anything} initalValue
 *  {Boolean} readOnly
 */

export default class Input extends React.Component {
    input = React.createRef();
    state = {
        value: this.props.initialValue
    }

    setInvalid(){
        this.input.current.classList.add('is-danger');
    }

    setValid(){
        this.input.current.classList.remove('is-danger');
    }

    setValue(value) {
        this.setState({
            value: value
        });
    }

    getValue() {
        return this.input.current.value;
    }

    render() {
        return (
            <FormComponent label={this.props.label}>
                <input className="input" ref={this.input} placeholder={this.props.placeholder} type={this.props.type} value={this.state.value} readOnly={this.props.readOnly} onKeyUp={this.props.onKeyUp.bind(this, this)}/>
            </FormComponent>
        );
    }
}

Input.defaultProps =  {
    type: "text",
    onKeyUp: () => {}
};