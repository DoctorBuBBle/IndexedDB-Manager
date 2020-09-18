import React, { useState } from 'react';
import LoadingSpinner from './Spinner/LoadingSpinner';
import Table from './Form/Table';
import Dialog from './Dialog';

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
    const handeRemoveTableClick = (table) => {
        if (typeof props.onRemoveTable === "function") {
            props.onRemoveTable(table.label);
        }
    }
    const handeEditTableClick = table => {
        if (typeof props.onEditTable === "function") {
            props.onEditTable(table);
        }
    };
    const COLUMNS = [{
        label: "Name",
        render: "label",
        onClick: () => {}
    }, {
        label: "Edit",
        render: element => {
            return (
                <span className="icon is-small has-text-primary">
                    <i className="fas fa-pen"></i>
                </span>
            );
        },
        onClick: handeEditTableClick

    }, {
        label: "Remove",
        render: (element) => {
            return (
                <span className="icon is-small has-text-primary">
                    <i className="fas fa-trash"></i>
                </span>
            );
        },
        onClick: handeRemoveTableClick

    }];
 
    let content;

    if (tables === null) {
        content = <LoadingSpinner/>;

        if (typeof props.tables.then === "function") {
            props.tables.then(tables => { setTables(tables); });
        } else if (Array.isArray(props.tables)) {
            setTables(props.tables);
        }

    } else if (Array.isArray(tables)) {
        content = <Table columns={COLUMNS} elements={tables}/>;
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
