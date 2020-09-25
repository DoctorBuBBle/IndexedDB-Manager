import React from 'react';
import Box from '../Boxes/Box';
import Table from './Table';
import FormComponent from './FormComponent';
import { cloneDeep, orderBy } from 'lodash';
import escapeStringRegexp from 'escape-string-regexp';

function getRegex(s) {
    return new RegExp('.*(' + escapeStringRegexp(s) + ').*', 'g');
}

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
    searchInputRef = React.createRef();
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
            sort: false,
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

    sort(column, elements, sortASC) {
        const order = sortASC ? 'asc' : 'desc';
        const getter = o => {
            let value;
            if (column.key === 'type') {
                value = o[column.key]?.value?.label;
            } else {
                value = o[column.key]?.value;
            }
            
            return value;
        }
        
        return orderBy(elements, [getter], [order]);
    }

    search(){
        if (this.searchInputRef.current) {
            const val = this.searchInputRef.current.value;

            if (typeof val === "string" && val.trim() !== "") {
                const reg = getRegex(val);

                this.tableRef.current.filter(element => {
                    let found = false;
    
                    for (let index = 0; index < this.state.columns.length && !found; index++) {
                        const column = this.state.columns[index];
                        let prop = element[column.key]?.value;
                        
                        if (typeof prop === "object") {
                            prop = prop.label;
                        }
    
                        found = reg.test(prop);
                    }
    
                    return found;
                });
            } else {
                this.tableRef.current.clearFilter();
            }
        }
    }

    render(){
        return (
            <div>
                <div className="control is-expanded has-icons-left">
                    <input ref={this.searchInputRef} type="text" className="input" placeholder="Search" onChange={this.search.bind(this)} />
                    <span className="icon is-medium is-left">
                        <i className="fas fa-search"></i>
                    </span>
                </div> 
                <Table ref={this.tableRef} sortBy={this.sort} columns={this.state.columns} elements={this.props.elements}/>
            </div>
        );
    }

    filter(){
        this.tableRef.current.filter.apply(this.tableRef.current, arguments);
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