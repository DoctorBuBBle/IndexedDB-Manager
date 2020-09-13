import React from 'react';

export default class extends React.Component {
    render(){
        return (
            <div className="field">
                <label className="label">{this.props.label}</label>
                <div className="control">
                    {this.props.children}
                </div>
            </div>
        );
    }
}