import React from "react";
import Box from "./Boxes/Box";
import ButtonDialog from "./ButtonDialog";
import ColumnTypes from "./ColumnTypes";
import ComponentTable from "./Form/CompTable";

export default class Table extends React.Component {
    ref = React.createRef();
    buttons = [{
        label: "Close",
        onClick: this.props.onClose
    }, {
        label: "Clear table",
        onClick: () => {
            Box.show(`Do you want to clear the table of all it's data?`, [{
                label: "No"
            }, {
                label: "Yes",
                isPrimary:  true,
                onClick: () => {
                    const after = () => {
                        this.hideLoading();
                        this.setState({
                            elements: null
                        });
                    }

                    this.showLoading();
                    this.props.db.setData(this.props.table.label).then(after, after);
                }
            }])
        }
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
            <ButtonDialog title={this.props.table.label} buttons={this.buttons}>
                <ComponentTable ref={this.ref} columns={this.state.columns} elements={this.state.elements || []} />
            </ButtonDialog>
        );
    }
}
