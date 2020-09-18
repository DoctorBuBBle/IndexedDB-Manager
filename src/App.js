import React, { useState } from 'react';
import './App.scss';
import IndexedDB from './components/DataBase/IndexedDB';
import DataTables from './components/DataTables';
import EditDataTable from './components/EditDataTable';

const STATES = {
  LIST_DATA_TABLES: 1,
  ADD_DATA_TABLE: 2,
  SHOW_DATA_TABLE: 3,
  CHANGE_DATA_TABLE: 4,
  REMOVE_DATA_TABLE: 5
};

function App() {
  const dataBase = new IndexedDB();
  const [state, setState] = useState(STATES.LIST_DATA_TABLES);
  const listDataTables = () => setState(STATES.LIST_DATA_TABLES);
  const addDataTable = () => setState(STATES.ADD_DATA_TABLE);

  let content;

  if (state === STATES.LIST_DATA_TABLES) {
    content = <DataTables tables={dataBase.getTables()} onAddTable={addDataTable}/>;
  }
  if (state === STATES.ADD_DATA_TABLE) {
    content = <EditDataTable onCancel={listDataTables} db={dataBase} onSave={listDataTables}></EditDataTable>
  }

  return (
    <div className="section">
      {content}
    </div>
  );
}

export default App;
