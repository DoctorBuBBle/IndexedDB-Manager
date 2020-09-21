import React from 'react';
import Box from './Boxes/Box';
import ButtonDialog from './ButtonDialog';
import ColumnTypes from './ColumnTypes';
import ComponentTable from './Form/CompTable';
import Input from './Form/Input';
import { cloneDeep } from 'lodash';

/**
 * props: {
 *      {String} table - Name of the table to edit. Undefined if a new table should be created
 *      {Array} columns - The columns of this table.
 *      {Function} onCancel - Callback for cancel button
 *      {Function} onSave - Callback for save button
 * }
 */
export default class DataTable extends React.Component {
    loadingSpinner = React.createRef();
    inputRef = React.createRef();
    tableRef = React.createRef();
    title = this.props?.table?.label ? "Change Table '"  + this.props.table.label + "'" : "Create Table";
    buttons = [{
        label: "Cancel",
        onClick: this.props.onCancel
    }, {
        label: "Save",
        isPrimary: true,
        onClick: this.save.bind(this)
    }];
    defaultElem = {
        type: {
            value: ColumnTypes.defaultProps.value
        }
    }
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
        return name !== undefined && name !== null && /^([a-z])+([a-z_\- 0-9])*$/i.test(name);
    }

    showLoading(){
        this.buttons.forEach(button => {
            if (button?.ref?.current) {
                button.ref.current.classList.add('is-loading');
            }
        });
    }

    hideLoading(){
        this.buttons.forEach(button => {
            if (button?.ref?.current) {
                button.ref.current.classList.remove('is-loading');
            }
        });
    }

    save(){
        const tableName = this.inputRef.current.val();
        const columns = this.tableRef.current.val();
        
        if (!this.checkColumnName(tableName)) {
            Box.show(`The table name contains illegal characters. The table name must start with a letter and can also contain numbers, minus, underscores and whitespace.`)
            this.inputRef.current.setInvalid();
            return;
        }

        let columnsAreValid = columns.length > 0;
        if (!columnsAreValid) {
            Box.show('A table must have at least one column');
        }

        const columnNames = [];
        for(var i = 0; i < columns.length && columnsAreValid; i++) {
            const column = columns[i];

            if (!this.checkColumnName(column?.name?.value)) {
                Box.show(`The column "${column?.name?.value}" contains illegal characters. A column must start with a letter and can also contain numbers, minus, underscores and whitespace.`);
                columnsAreValid = false;
            }
            if (columnNames.indexOf(column?.name?.value) > -1) {
                Box.show(`A number of columns have the name "${column?.name?.value}". A column name must be unique.`);
                columnsAreValid = false;
            } else {
                columnNames.push(column?.name?.value);
            }
            if (column?.type?.value === undefined) {
                Box.show(`The column "${column?.name?.value}" has no type`);
                columnsAreValid = false;
            }
        }

        if (columnsAreValid) {
            this.showLoading();
            this.props.db.createTable(tableName, columns, typeof this.props?.table?.label === "string").then(this.props.onSave).catch(this.hideLoading.bind(this));
        }
    }

    render(){
        return (
            <ButtonDialog title={this.title} buttons={this.buttons}>
                <Input ref={this.inputRef} label="Name" value={this.props?.table?.label} placeholder="A tabel name is required"/>
                <ComponentTable ref={this.tableRef} columns={this.columns} elements={this.props?.table?.columns || [cloneDeep(this.defaultElem)] } defaultElemToAdd={this.defaultElem}/>
            </ButtonDialog>
        )
    }
}
