import React, { useState } from 'react';
import Box from './components/Boxes/Box';
import IndexedDB from './components/DataBase/IndexedDB';
import DataTables from './components/DataTables';
import DataTable from './components/DataTable';
import EditDataTable from './components/EditDataTable';
import LoadingSpinner from './components/Spinner/LoadingSpinner';

const STATES = {
  LIST_DATA_TABLES: 1,
  EDIT_DATA_TABLE: {id: 2},
  SHOW_DATA_TABLE: {id: 3},
  SHOW_LOADING: 5
};

function App() {
  const dataBase = new IndexedDB();
  const [state, setState] = useState(STATES.LIST_DATA_TABLES);
  const loading = () => setState(STATES.SHOW_LOADING);
  const listDataTables = () => setState(STATES.LIST_DATA_TABLES);
  const addDataTable = () => setState(STATES.EDIT_DATA_TABLE);
  const editDataTable = table => setState({id: STATES.EDIT_DATA_TABLE.id, data: table});
  const showTable = table => setState({id: STATES.SHOW_DATA_TABLE.id, data: table});
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
    content = <DataTables tables={dataBase.getTables()} onAddTable={addDataTable} onShowTable={showTable} onRemoveTable={removeDataTable} onEditTable={editDataTable}/>;
  }
  if (state.id === STATES.EDIT_DATA_TABLE.id) {
    content = <EditDataTable table={state.data} onCancel={listDataTables} db={dataBase} onSave={listDataTables}></EditDataTable>
  }
  if (state.id === STATES.SHOW_DATA_TABLE.id) {
    content = <DataTable table={state.data} onClose={listDataTables} db={dataBase} />
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
