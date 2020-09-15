import React from 'react';
import ButtonDialog from './ButtonDialog';
import ColumnTypes from './ColumnTypes';
import Button from './Form/Button';
import Input from './Form/Input';
import Table from './Form/Table';
import isValid from './isValid';

/**
 * props: {
 *      {String} table - Name of the table to edit. Undefined if a new table should be created
 *      {Array} columns - The columns of this table.
 *      {Function} onCancel - Callback for cancel button
 *      {Function} onSave - Callback for save button
 * }
 */
export default class DataTable extends React.Component {
    inputRef = React.createRef();
    tableRef = React.createRef();
    title = this.props.table ? "Change Table '"  + this.props.table + "'" : "Create Table";
    buttons = [{
        label: "Cancel",
        onClick: this.props.onCancel
    }, {
        label: "Save",
        isPrimary: true,
        onClick: this.save.bind(this)
    }];
    columns = [
        {
            label: "Column name",
            render: (element) => {
                return  <Input ref={element.refs[0]} value={element.name} placeholder="A column name is required" onKeyUp={this.onColumnNameChange.bind(this, element)}/>
            }
        }, {
            label: "Type",
            render: element => {
                return <ColumnTypes ref={element.refs[1]} value={element.type} onChange={this.onColumnTypeChange.bind(this, element)}/>
            }
        }, {
            label: (
                <span className="icon pl-4 is-small has-text-primary pointer" onClick={this.addColumn.bind(this)}>
                    <i className="fas fa-plus"></i>
                </span>
            ),
            render: (element) => {
                return (
                    <Button className="is-white">
                        <span className="icon is-small has-text-primary pointer" onClick={this.removeColumn.bind(this, element)}>
                            <i className="fas fa-trash"></i>
                        </span>
                    </Button>
                );
            } 
        }
    ];

    getColumnsWithRefs() {
        if (this.elements) {
            return this.elements;
        }

        this.elements = this.props.columns.map(this.getColumnWithRefs.bind(this));

        return this.elements;
    }

    getColumnWithRefs(element){
        element.refs = this.columns.map(column => {
            return React.createRef();
        });

        return element;
    }

    onColumnTypeChange(column, select, columnType) {
        column.type = columnType;
    }

    onColumnNameChange(column, input) {
        const value = input.val()

        if (isValid(value) && /^([a-z])+([a-z0-9])*$/i.test(value)){
            input.setValid();
        } else {
            input.setInvalid();
        }

        column.name = value;
    }

    removeColumn(column){
        this.tableRef.current.remove(column);
    }

    addColumn(){
        this.tableRef.current.add(this.getColumnWithRefs({}));;
    }

    save(){
        const tableName = this.inputRef.current.val();
        const columns = this.tableRef.current.val();
        const dbColumns = [];
        let columnsAreValid = true;
        
        for(var i = 0; i < columns.length; i++) {
            const dbColumn = {};
            const column = columns[i];
            const name = column.refs[0].current.val();
            if (!isValid(name)) {
                column.refs[0].current.setInvalid();
            } else {
                dbColumn.name = name;
            }

            columnsAreValid = name !== undefined && name !== null && /^([a-z])+([a-z0-9])*$/i.test(columns[i].name);

            if (columnsAreValid) {
                dbColumn.type = column.refs[1].current.val();
            }

            dbColumns.push(dbColumn);
        }

        if (isValid(tableName) && columnsAreValid) {
            debugger;
            return;
            this.props.onSave(tableName, dbColumns);
        } else {
            this.inputRef.current.setInvalid();
        }
    }

    render(){
        return (
            <ButtonDialog title={this.title} buttons={this.buttons}>
                <Input ref={this.inputRef} label="Name" placeholder="A tabel name is required"/>
                <Table ref={this.tableRef} editable={true} columns={this.columns} elements={this.getColumnsWithRefs()}/>
            </ButtonDialog>
        )
    }
}

DataTable.defaultProps = {
    columns: [{}]
}