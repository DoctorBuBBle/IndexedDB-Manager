import React from 'react';
import FormComponent from './FormComponent';
import FormComponentBase from './FormComponentBase';
import throttle from 'lodash.throttle';

/**
 *  {String} label
 *  {String} type - default 'text'
 *  {String} placeholder
 *  {Anything} initalValue
 *  {Boolean} readOnly
 */

export default class Input extends FormComponentBase {

    throttledChange = throttle(this.onChange.bind(this), 100);

    _getValue(){
        if (this.ref.current) {
            return this.ref.current.value;
        } else {
            return this.state.value;
        }
    }

    ontest(event){
        console.log("onChange event fired: ", this.ref.current.value, event);
    }

    render() {
        return (
            <FormComponent label={this.props.label}>
                <input 
                    className="input" 
                    ref={this.ref} 
                    placeholder={this.props.placeholder} 
                    type={this.props.type} 
                    defaultValue={this.state.value} 
                    readOnly={this.props.readOnly} 
                    onChange={this.throttledChange}/>
            </FormComponent>
        );
    }
}

Input.defaultProps =  {
    type: "text",
    onKeyUp: () => {}
};