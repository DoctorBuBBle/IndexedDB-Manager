import React, { useState } from 'react';
import LoadingSpinner from './Spinner/LoadingSpinner';
import Table from './Form/Table';
import Dialog from './Dialog';

export default function DataTables(props) {
    const [tables, setTables] = useState(null);
    const fileUploadRef = React.createRef();
    const uploadButton = React.createRef();

    const download = (event) => {
        if (typeof props.onDownload === "function") {
            props.onDownload(event);
        }
    }
    function importZip (event) {
        if (typeof props.onImportZip === "function") {
            props.onImportZip(uploadButton, event);
        }
    }
    const getAddTableClasses = (isLoading) => {
        let css = "button is-primary is-hoverable";

        if (isLoading) {
            css += " is-loading";
        }

        return css;
    }
    const handleAddTableClick = function (event) {
        if (typeof props.onAddTable === "function") {
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
        label: (
            <span className="icon is-medium is-size-5 has-text-primary">
                <i className="fas fa-plus"></i>
            </span>
        ),
        sort: false,
        onHeaderClick: handleAddTableClick,
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
                <button className={getAddTableClasses(tables === null)} onClick={download} title="Download as ZIP file">
                    <span className="icon is-small">
                        <i className="fas fa-download"></i>
                    </span>
                </button>
                <button ref={uploadButton} className={"hidden" || getAddTableClasses(tables === null)} onClick={() => fileUploadRef.current.click()} title="Import ZIP file">
                    <span className="icon is-small">
                        <i className="fas fa-upload"></i>
                    </span>
                </button>
                <input ref={fileUploadRef} className="hidden" type="file" onChange={importZip} />
            </div>
        </div>
    );
}
