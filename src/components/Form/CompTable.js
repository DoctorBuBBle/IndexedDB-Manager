import React from 'react';
import Button from './Button';
import Table from './Table';
import isEqual from 'fast-deep-equal';

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

    constructor(props) {
        super(props);
        this.init();
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
        this.columns = this.props.columns.map(column => {
            column.render = (element, elements, column) => {
                const props = {
                    ...column.props,
                    ...element[column.key]
                };
                props.onChange = this.onChange.bind(this, column, element, props.onChange);

                return React.createElement(column.comp, props)
            }
            return column;
        });
        
        this.columns.push({
            label: (
                <span className="icon pl-4 is-small has-text-primary pointer" onClick={this.addElement.bind(this, undefined)}>
                    <i className="fas fa-plus"></i>
                </span>
            ),
            render: (element) => {
                return (
                    <Button className="is-white">
                        <span className="icon is-small has-text-primary pointer" onClick={this.removeElement.bind(this, element)}>
                            <i className="fas fa-trash"></i>
                        </span>
                    </Button>
                );
            }
        });
    }

    addElement(element = {}) {
        this.tableRef.current.add(element);
    }

    removeElement(elementToRemove) {
        return this.tableRef.current.remove(elementToRemove);
    }

    render(){
        return (
            <Table ref={this.tableRef} columns={this.columns} elements={this.props.elements}/>
        )
    }

    val(){
        return this.tableRef.current.val();
    }
}

ComponentTable.defaultProps = {
    columns: [],
    elements: []
}