import React from 'react';
import FormComponent from './FormComponent';
import FormComponentBase from './FormComponentBase';

export default class Checkbox extends FormComponentBase {
    onChange(event){
        if (this.ref.current){
            this.setState({
                value: this.ref.current.checked
            });
            if (typeof this.props.onChange === "function") {
                this.props.onChange(this, this.ref.current.checked, event);
            }
        }
    }

    render(){
        return (
            <FormComponent label={this.props.label} >
                <input ref={this.ref} type="checkbox" defaultChecked={this.state.value} onChange={this.onChange.bind(this)}></input>
            </FormComponent>
        );
    }
}