import React from "react";
import Box from "./Boxes/Box";
import ButtonDialog from "./ButtonDialog";
import ColumnTypes from "./ColumnTypes";
import ComponentTable from "./Form/CompTable";
import { v4 as uid } from 'uuid';

export default class Table extends React.Component {
    ref = React.createRef();
    autoSaveRef = React.createRef();
    intervals = [];
    buttons = [{
        label: "Close",
        onClick: this.props.onClose
    }, (
        <button ref={this.autoSaveRef} key={uid()} className="button is-hoverable is-loading"></button>
    ),{
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

    getElements(){
        setTimeout(() => {
            this.showLoading();
            this.props.db.getData(this.props.table.label).then((data) => {
                this.ref.current.val(data.elements);
                this.updateAutoSaveBtn();
                this.hideLoading();
            }).catch(() => {
                this.hideLoading();
            });
        }, 1);
    }

    updateAutoSaveBtn(){
        if (this.intervals.length === 0) {
            let nextSave = 10;
            this.intervals.push(setInterval(() => this.save(), 10000));
            this.intervals.push(setInterval(() => {
                if (this.autoSaveRef.current) {
                    this.autoSaveRef.current.classList.remove('is-loading');
                    nextSave--
                    if (nextSave === 0) {
                        nextSave = 10;
                    }
                    this.autoSaveRef.current.innerText = `Auto save in ${nextSave}`;
                }
            }, 1000));
        }
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
            if (button?.ref !== this.autoSaveRef && button?.ref?.current) {
                button.ref.current.classList.remove('is-loading');
            }
        });
    }

    save(){
        this.showLoading();
        const waitASec = () => setTimeout(() => {
            this.hideLoading();
            this.updateAutoSaveBtn();
        }, 100);
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

    componentWillUnmount() {
        this.intervals.forEach(id => clearInterval(id));
    }
}
