import React from 'react';

export default function(props){
    const classes = "fd container " + (props.className || "");

    return (
        <div className={classes}>
            <div>
                <h1 className="title has-text-light mb-5 is-1 has-text-centered">{props.title}</h1>
            </div>
            <div className="box-content box">
                {props.children}
            </div>
        </div>
    )
}