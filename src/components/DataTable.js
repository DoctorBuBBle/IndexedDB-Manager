import React from "react";
import ButtonDialog from "./ButtonDialog";
import ColumnTypes from "./ColumnTypes";
import ComponentTable from "./Form/CompTable";

export default class Table extends React.Component {
    ref = React.createRef();
    buttons = [{
        label: "Close",
        onClick: this.props.onClose
    }, {
        label: "Save",
        isPrimary: true,
        onClick: this.save.bind(this)
    }];
    state = {
        columns: this.getColumns()
    }

    async getElements(){
        let data = await this.props.db.getData(this.props.table.label);
        this.ref.current.val(data.elements);
    }

    getColumns(){
        return this.props.table.columns.map(column => {
            return {
                label: column.name.value,
                comp: ColumnTypes.MAP[column.type.value.value],
                key: column.name.value,
                props: {}
            }
        });
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
        this.showLoading();
        const waitASec = () => setTimeout(() => this.hideLoading(), 500);
        this.props.db.setData(this.props.table.label, this.ref.current.val()).then(waitASec, waitASec);
    }

    render(){
        if (!this.state.elements) {
            this.getElements();
        }

        return (
            <ButtonDialog label={this.props.table.label} buttons={this.buttons}>
                <ComponentTable ref={this.ref} columns={this.state.columns} elements={this.state.elements || []} />
            </ButtonDialog>
        );
    }
}
