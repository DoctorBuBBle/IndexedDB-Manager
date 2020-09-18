import React from 'react';
import Dialog from './Dialog';
import { v4 as uid } from 'uuid';

export default function(props){
    const buttonsPosition = "mt-3 px-1 buttons " + (props.position ? props.position : "is-right");
    const buttons = props.buttons.map(conf => {
        const css = "button is-hoverable" + (conf.isPrimary ? " is-primary" : "");
        conf.ref = React.createRef();
        return (
            <button ref={conf.ref} key={uid()} className={css} onClick={conf.onClick}>
                {conf.label}
            </button>
        )
    })

    return (
        <div>
            <Dialog title={props.title}>
                {props.children}
            </Dialog>
            <div className={buttonsPosition}>
                {buttons}
            </div>
        </div>
    )
}