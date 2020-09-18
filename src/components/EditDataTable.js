import React from 'react';
import ButtonDialog from './ButtonDialog';
import ColumnTypes from './ColumnTypes';
import ComponentTable from './Form/CompTable';
import Input from './Form/Input';
import { isValid } from './utilities';

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
    columns = [{
        label: "Column name",
        comp: Input,
        key: "name",
        props: {
            placeholder: "A column name is required",
            onChange: (comp, value) => {
                if (this.checkColumnName(value)) {
                    comp.setValid();
                } else {
                    comp.setInvalid();
                }
            }
        }
    }, {
        label: "Type",
        comp: ColumnTypes,
        key: "type",
        props: {}
    }]

    checkColumnName(name){
        return name !== undefined && name !== null && /^([a-z])+([a-z0-9])*$/i.test(name);
    }

    save(){
        const tableName = this.inputRef.current.val();
        const columns = this.tableRef.current.val();
        
        let columnsAreValid = true;        
        for(var i = 0; i < columns.length && columnsAreValid; i++) {
            const column = columns[i];
            
            columnsAreValid = this.checkColumnName(column?.name?.value)
            if (column?.type?.value?.value) {
                column.type.value.value = undefined;
            }
        }

        if (isValid(tableName) && columnsAreValid) {
            this.props.db.createTable(tableName, columns);
            this.props.onSave();
        } else {
            this.inputRef.current.setInvalid();
        }
    }

    render(){
        return (
            <ButtonDialog title={this.title} buttons={this.buttons}>
                <Input ref={this.inputRef} label="Name" placeholder="A tabel name is required"/>
                <ComponentTable ref={this.tableRef} columns={this.columns} elements={this.props.elements}/>
            </ButtonDialog>
        )
    }
}

DataTable.defaultProps = {
    elements: [{}]
}