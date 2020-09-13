import React from 'react';
import ButtonDialog from './ButtonDialog';
import ColumnTypes from './ColumnTypes';
import Button from './form/Button';
import FormComponent from './form/FormComponent';
import Input from './form/Input';
import Table from './form/Table';

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
                return  <Input placeholder="A column name is required" onKeyUp={this.onColumnNameChange.bind(this, element)}/>
            }
        }, {
            label: "Type",
            render: <ColumnTypes/>
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

    onColumnNameChange(column, input) {
        const value = input.getValue().toString().trim();

        if (/^([a-z])+([a-z0-9])*$/i.test(value)){
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
        this.tableRef.current.add({

        });
    }

    save(){
        
        const value = this.inputRef.current.getValue();
        const columns = this.tableRef.current.getElements();
        const columnsHaveNames = true;

        for(var i = 0; i < columns.length && columnsHaveNames; i++) {
            columnsHaveNames = /^([a-z])+([a-z0-9])*$/i.test(columns[i].name);
        }

        if (
            value !== null && 
            value !== undefined && 
            typeof value === "string" && 
            value.trim().length > 0 &&
            columnsHaveNames
            ) 
        {
            this.props.onSave(value);
        } else {
            this.inputRef.current.setInvalid();
        }
    }

    render(){
        return (
            <ButtonDialog title={this.title} buttons={this.buttons}>
                <Input ref={this.inputRef} label="Name" placeholder="A tabel name is required"/>
                <FormComponent>
                    <Table ref={this.tableRef} editable={true} columns={this.columns} elements={this.props.columns}/>
                </FormComponent>
            </ButtonDialog>
        )
    }
}

DataTable.defaultProps = {
    columns: [{}]
}