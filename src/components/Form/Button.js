import React from 'react';
import FormComponent from './FormComponent';

export default function Button (props){
    const content = props.children || props.label;

    return (
        <FormComponent>
            <button className={"button " + props.className} onClick={props.onClick}>
                {content}
            </button>
        </FormComponent>
    )
}

Button.defaultProps = {
    className: ""
}