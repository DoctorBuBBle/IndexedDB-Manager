import React, { useState } from 'react';
import Box from './components/Boxes/Box';
import IndexedDB from './components/DataBase/IndexedDB';
import DataTables from './components/DataTables';
import DataTable from './components/DataTable';
import EditDataTable from './components/EditDataTable';
import LoadingSpinner from './components/Spinner/LoadingSpinner';
import JSZip from 'jszip';

async function onUpload (dataBase, button, event) {
  //const error = () => Box.show('Can\'t import ZIP file');
  const errorTable = (tableName) => Box.show(`Can't update table ${tableName}`);
  button.current.classList.add('is-loading');
  let zipBlob = event.target.files[0];
  let arrayBuffer = await zipBlob.arrayBuffer();
  let zip = await (new JSZip()).loadAsync(arrayBuffer);
  let fileNames = Object.getOwnPropertyNames(zip.files)

  for (let index = 0; index < fileNames.length; index++) {
    const fileName = fileNames[index];
    const tableName = fileName.slice(0, fileName.length - 4);
    const rows = [];
    zip.file(fileName)
       .internalStream("string")
       .on("data", data => {debugger; rows.push(data); })
       .on("error", errorTable.bind(this, tableName))
       .on("end", () => {
        //const content = rows;
        debugger;
        button.current.classList.remove('is-loading');
       })
  }

  debugger;

}

const onDownload = (dataBase, event) => {
  const button = event.currentTarget;
  const errorMsg = table => { Box.show(`Ups can't download ${table.label}`)}
  const ZIP = new JSZip();
  const addFile = (name, content) => ZIP.file(name + '.csv', content);
  const error = () => Box.show("Download failed");
  const getLine = (rows, table, data) => {
    (data?.elements || []).forEach(element => {
      const row = [];

      table.columns.forEach(column => {
        let val = element[column?.name?.value]?.value;
        if (typeof val === "object") {
          val = val.label;
        }
        if (val !== undefined && val !== null) {
          row.push(`"${val}"`);
        } else {
          row.push(`""`);
        }
      });

      rows.push(row.join(','));
    });

    return rows;
  }
  
  button.classList.add('is-loading');
  dataBase.getTables().then(tables => {
    let promises = [];

    tables.forEach(table => {
      const rows = [];

      const headerLine = table.columns.map(column => {
        return `"${column?.name?.value}"`;
      }).join(',');
      rows.push(headerLine);

      let promise = dataBase.getData(table.label)
        .then(getLine.bind(this, rows, table))
        .then(rows => {
          return rows.join('\n');
        })
        .then(addFile.bind(this, table.label))
        .catch(errorMsg.bind(this, table));

      promises.push(promise);        
    });

    return Promise.all(promises).then(() => {
      return ZIP.generateAsync({type: "base64"}).then(base64 => {
        window.open("data:application/zip;base64," + base64);
      });
    })
  }).catch(error).finally(() => {
    button.classList.remove('is-loading');
  });

}

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
    content = <DataTables tables={dataBase.getTables()} onImportZip={onUpload.bind(this, dataBase)} onDownload={onDownload.bind(this, dataBase)} onAddTable={addDataTable} onShowTable={showTable} onRemoveTable={removeDataTable} onEditTable={editDataTable}/>;
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
    <div className="fd section">
      {content}
    </div>
  );
}

export default App;
