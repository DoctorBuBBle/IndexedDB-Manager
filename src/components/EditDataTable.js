import React from 'react';
import ButtonDialog from './ButtonDialog';
import ColumnTypes from './ColumnTypes';
import Button from './Form/Button';
import FormComponent from './Form/FormComponent';
import Input from './Form/Input';
import Table from './Form/Table';

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
                return  <Input value={element.name} placeholder="A column name is required" onKeyUp={this.onColumnNameChange.bind(this, element)}/>
            }
        }, {
            label: "Type",
            render: element => {
                return <ColumnTypes select={element.type} onSelect={this.onColumnTypeChange.bind(this, element)}/>
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

    onColumnTypeChange(column, columnType) {
        column.type = columnType;
    }

    onColumnNameChange(column, input) {
        const value = input.val().toString().trim();

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
        debugger
        const value = this.inputRef.current.val();
        const columns = this.tableRef.current.val();
        let columnsHaveNames = true;

        for(var i = 0; i < columns.length && columnsHaveNames; i++) {
            const name = columns[i].name;
            columnsHaveNames = name !== undefined && name !== null && /^([a-z])+([a-z0-9])*$/i.test(columns[i].name);
        }

        if (
            value !== null && 
            value !== undefined && 
            typeof value === "string" && 
            value.trim().length > 0 &&
            columnsHaveNames
            ) 
        {
            return;
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