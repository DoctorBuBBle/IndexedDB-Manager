import React from 'react';
import FormComponent from './FormComponent';
import FormComponentBase from './FormComponentBase';

export default class Checkbox extends FormComponentBase {
    onChange(event){
        if (this.ref.current){
            this.setState({
                value: this.ref.current.checked
            });
            FormComponentBase.prototype.onChange.call(this, event);
        }
    }

    render(){
        return (
            <FormComponent label={this.props.label} >
                <input ref={this.ref} type="checkbox" defaultValue={this.state.value} onChange={this.onChange.bind(this)}></input>
            </FormComponent>
        );
    }
}