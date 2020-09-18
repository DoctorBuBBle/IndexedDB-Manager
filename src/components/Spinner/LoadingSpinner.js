import React from 'react';
import './LoadingSpinner.scss';

export default function(){
    return (
        <div className="level">
            <div className="level-item">
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        </div>
    );
}