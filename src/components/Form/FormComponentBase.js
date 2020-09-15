import React from 'react';

export default class extends React.Component {
    ref = React.createRef();
    state = {
        value: this.props.value
    }

    triggerChange(event){
        if (typeof this.props.onChange === "function") {
            this.props.onChange(this, this.val(), event);
        }
    }

    setInvalid(){
        if (this.ref.current) {
            this.ref.current.classList.add('is-danger');
        }
    }

    setValid(){
        if (this.ref.current){
            this.ref.current.classList.remove('is-danger');
        }
    }

    val(value){
        if (value) {
            this._setValue(value);
        } else {
            return this._getValue();
        }
    }

    _setValue(value){
        this.setState({
            value: value
        });
    }

    _getValue(){
        return this.state.value;
    }
}