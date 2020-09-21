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
    const handleShowTableClick = table => {
        if (typeof props.onShowTable === "function") {
            props.onShowTable(table);
        }
    }
    const COLUMNS = [{
        label: "Name",
        render: "label",
        onClick: handleShowTableClick
    }, {
        label: "Edit",
        sort: false,
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
        sort: false,
        render: (element) => {
            return (
                <span className="icon is-small has-text-primary">
                    <i className="fas fa-trash"></i>
                </span>
            );
        },
        onClick: handeRemoveTableClick

    }];

    const sort = (column, elements, sortASC) => {
        return elements.sort((a, b) => {
            const nameA = a.label;
            const nameB = b.label;

            if (nameA < nameB) {
                return sortASC? -1 : 1;
            }
            if (nameA > nameB) {
                return sortASC? 1 : -1;
            }
        
            // names must be equal
            return 0;
        });
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
        content = <Table columns={COLUMNS} elements={tables} sortBy={sort}/>;
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
