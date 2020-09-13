import React from 'react';
import FormComponent from './FormComponent';

export default function button (props){
    const content = props.children || props.label;

    return (
        <FormComponent>
            <button className={"button " + props.className} onClick={props.onClick}>
                {content}
            </button>
        </FormComponent>
    )
}

button.defaultProps = {
    className: ""
}