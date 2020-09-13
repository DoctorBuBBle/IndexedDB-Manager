import { v4 as uuid } from 'uuid';
import isEqual from 'fast-deep-equal';
import React from 'react';

/**
 * 
 * @param {Object} props - {
 *      {Array} columns .- Array of column configurations
 *      {Array} elements - Array of objects
 * }
 * 
 * {Object} column - {
 *      {String} label
 *      {Function | String} render
 *      {Function} onClick
 * }
 */
export default class Table extends React.Component {

    state = {
        elements: this.props.elements,
        columns: this.props.columns
    };

    add(element){
        this.setState({
            elements: this.state.elements.concat(element)
        });
    }

    remove(elementToRemove) {
        let index = this.state.elements.findIndex(element => isEqual(elementToRemove, element))
        if (index > -1) {
            let copy = [...this.state.elements];
            copy.splice(index, 1);
            this.setState({
                elements: copy
            });
            return true;
        }

        return false;
    }

    getElements(){
        return this.state.elements;
    }

    sortTable(){

    }

    render() {
        const headerRow = this.state.columns.map((column, i) => {
            return (
                <th key={uuid()} className="list-item" onClick={this.sortTable.bind(this, column)}>{column.label}</th>
            )
        });

        const bodyRows = this.state.elements.map((element, i) => {
            const bodyColumns = this.state.columns.map(column => {
                const tdCss = "list-item" + (typeof column.onClick === "function" ? " pointer" : "");
                const onClick = (column, element, event) => { 
                    if (typeof column.onClick === "function") {
                        column.onClick(element, event, column);
                    }
                }
                let value;
    
                if (typeof column.render === "function") {
                    value = column.render(element, this.state.elements, column);
                } else if (typeof column.render === "string") {
                    value = element[column.render];
                } else if (column.render !== null && column.render !== undefined) {
                    value = column.render
                }
    
                return (
                    <td key={uuid()} className={tdCss} 
                        onClick={onClick.bind(this, column, element)}>
                            {value}
                    </td>
                )
            })

            return (
                <tr key={uuid()}>
                    {bodyColumns}
                </tr>
            )
        })

        return (
            <table className="table is-fullwidth is-hoverable">
                <tbody>
                    <tr key={uuid()}>
                        {headerRow}
                    </tr>
                    {bodyRows}
                </tbody>
            </table>
        );
    }
}

Table.defaultProps = {
    elements: [],
    columns: []
}