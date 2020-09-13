import React from 'react';

export default function(props){
    return (
        <div className="container">
            <div>
                <h1 className="title has-text-light mb-5 is-1 has-text-centered">{props.title}</h1>
            </div>
            <div className="box">
                {props.children}
            </div>
        </div>
    )
}