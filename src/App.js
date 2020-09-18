import React, { useState } from 'react';
import './App.scss';
import Box from './components/Boxes/Box';
import IndexedDB from './components/DataBase/IndexedDB';
import DataTables from './components/DataTables';
import EditDataTable from './components/EditDataTable';
import LoadingSpinner from './components/Spinner/LoadingSpinner';

const STATES = {
  LIST_DATA_TABLES: 1,
  ADD_DATA_TABLE: 2,
  SHOW_DATA_TABLE: 3,
  CHANGE_DATA_TABLE: 4,
  SHOW_LOADING: 5
};

function App() {
  const dataBase = new IndexedDB();
  const [state, setState] = useState(STATES.LIST_DATA_TABLES);
  const loading = () => setState(STATES.SHOW_LOADING);
  const listDataTables = () => setState(STATES.LIST_DATA_TABLES);
  const addDataTable = () => setState(STATES.ADD_DATA_TABLE);
  const removeDataTable = (name) => {
    Box.show(`Do you want to delete the table ${name}?`, [{
      label: "No",
      onClick: () => {}
    }, {
      label: "Yes",
      isPrimary: true,
      onClick: () => {
        loading();
        dataBase.removeTable(name).then(() => {
          listDataTables();
        });
      }
    }]);
  };

  let content;

  if (state === STATES.LIST_DATA_TABLES) {
    content = <DataTables tables={dataBase.getTables()} onAddTable={addDataTable} onRemoveTable={removeDataTable}/>;
  }
  if (state === STATES.ADD_DATA_TABLE) {
    content = <EditDataTable onCancel={listDataTables} db={dataBase} onSave={listDataTables}></EditDataTable>
  }
  if (state === STATES.SHOW_LOADING) {
    content = <LoadingSpinner />
  }

  return (
    <div className="section">
      {content}
    </div>
  );
}

export default App;
