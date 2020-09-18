import React, { useState } from 'react';
import LoadingSpinner from './Spinner/LoadingSpinner';
import Dialog from './Dialog';
import { v4 as uuid } from 'uuid';

export default function DataTables(props) {
    const [tables, setTables] = useState(null);

    const getAddTableClasses = (isLoading) => {
        let css = "button is-primary is-hoverable";

        if (isLoading) {
            css += " is-loading";
        }

        return css;
    }
    const handleAddTableClick = function (event) {
        if (!event.currentTarget.classList.contains("is-loading") && typeof props.onAddTable === "function") {
            props.onAddTable()
        }
    }
    const handeRemoveTableClick = (tableName) => {
        if (typeof props.onRemoveTable === "function") {
            props.onRemoveTable(tableName);
        }
    }
 
    let content;

    if (tables === null) {
        content = <LoadingSpinner/>;

        if (typeof props.tables.then === "function") {
            props.tables.then(tables => { setTables(tables); });
        } else if (Array.isArray(props.tables)) {
            setTables(props.tables);
        }

    } else if (Array.isArray(tables)) {
        content = (
            <table className="table is-fullwidth is-hoverable">
                <tbody>
                    {
                        tables.map((table) => {
                            return (
                                <tr key={uuid()}>
                                    <td className="list-item" onClick={props.onClick}>
                                        <span className="pointer">{table.label}</span>
                                    </td>
                                    <td className="list-item">
                                        <span className="icon is-small has-text-primary pointer" onClick={handeRemoveTableClick.bind(this, table.label)}>
                                            <i className="fas fa-trash"></i>
                                        </span>
                                    </td>
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        );
    }

    return (
        <div>
            <Dialog title="Tables">
                {content}
            </Dialog>
            <div className="mt-3 buttons is-centered">
                <button className={getAddTableClasses(tables === null)} onClick={handleAddTableClick}>
                    <span className="icon is-small">
                        <i className="fas fa-plus"></i>
                    </span>
                </button>
            </div>
        </div>
    );
}
