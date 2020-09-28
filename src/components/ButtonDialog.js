import React from 'react';
import Dialog from './Dialog';
import { v4 as uid } from 'uuid';

/**
 * 
 * @param {Object} props - {
 *      {Array} buttons: {
 *          label
 *          position: "is-right"
 *          isPrimary: false,
 *          onClick: callback function
 *      }
 * }
 */
export default function(props){
    const buttonsPosition = "mt-3 px-1 buttons " + (props.position ? props.position : "is-right");
    const buttons = props.buttons.map(conf => {
        debugger;
        if (!conf.label) {
            return conf;
        } else {
            const css = "button is-hoverable" + (conf.isPrimary ? " is-primary" : "");
            conf.ref = React.createRef();
            return (
                <button ref={conf.ref} key={uid()} className={css} onClick={conf.onClick}>
                    {conf.label}
                </button>
            )
        }
    });

    return (
        <div className="fd">
            <Dialog className={props.className} title={props.title}>
                {props.children}
            </Dialog>
            <div className={buttonsPosition}>
                {buttons}
            </div>
        </div>
    )
}