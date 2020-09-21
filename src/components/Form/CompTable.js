import React from 'react';
import Box from '../Boxes/Box';
import Table from './Table';
import FormComponent from './FormComponent';
import { cloneDeep } from 'lodash';

/**
 * props - {
 *      column - Array of {
 *          label: <label>
 *          comp: <comp>
 *          props: <props>
 *      }
 *      elements - Array of {
 *          value: value
 *          ...props
*       }
 * }
 */

export default class ComponentTable extends React.Component {
    tableRef = React.createRef();
    columns = [];
    elements = [];
    state = {
        columns: this.init()
    }

    onChange(column, element, oldOnChange, comp, value, event){
        if (typeof element[column.key] !== "object") {
            element[column.key] = {};
        }

        element[column.key].value = value;
        if (typeof oldOnChange === "function") {
            oldOnChange(comp, value, event);
        }
    }

    init(){
        const columns = this.props.columns.map(column => {
            if (typeof column.render !== "function") {
                column.render = (element, elements, column) => {
                    const props = {
                        ref: React.createRef(),
                        ...column.props,
                        ...element[column.key]
                    };
                    props.onChange = this.onChange.bind(this, column, element, props.onChange);
                    return React.createElement(column.comp, props)
                }
            }
            return column;
        });
        
        columns.push({
            label: (
                <span className="icon is-medium is-size-5 has-text-primary">
                    <i className="fas fa-plus"></i>
                </span>
            ),
            onHeaderClick: this.addElement.bind(this, undefined),
            render: (element) => {
                return (
                    <FormComponent>
                        <span className="icon is-medium is-size-5 has-text-primary">
                            <i className="fas fa-trash"></i>
                        </span>
                    </FormComponent>
                );
            },
            onClick: this.removeElement.bind(this)
        });

        return columns;
    }

    addElement(element = cloneDeep(this.props.defaultElemToAdd)) {
        this.tableRef.current.add(element);
    }

    removeElement(elementToRemove) {
        Box.show(
            `Do you want to remove this element?`, 
            [{label: "No"}, {label: "Yes", isPrimary: true, onClick: () => this.tableRef.current.remove(elementToRemove)}]
        );
    }

    render(){
        return (
            <Table ref={this.tableRef} columns={this.state.columns} elements={this.props.elements}/>
        )
    }

    val(elements){
        let tableData = this.tableRef.current.val(elements);
        if (Array.isArray(tableData)){
            
            let results = tableData.map(element => {
                let result = {};
                this.state.columns.forEach(column => {
                    if (column.key !== undefined && column.key !== null) {
                        result[column.key] = element[column.key];
                    }
                });
                return result;
            });

            return results;
        }
    }
}

ComponentTable.defaultProps = {
    columns: [],
    elements: [],
    defaultElemToAdd: {}
}