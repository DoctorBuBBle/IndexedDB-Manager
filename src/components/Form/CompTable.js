import React from 'react';
import Table from './Table';

export default class ComponentTable extends React.Component {
    
    render(){


        return (
            <Table ref={this.tableRef} columns={this.state.columns} elements={}/>
        )
    }
}