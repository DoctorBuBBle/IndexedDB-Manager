import React, { useState } from 'react';
import Box from './components/Boxes/Box';
import IndexedDB from './components/DataBase/IndexedDB';
import DataTables from './components/DataTables';
import DataTable from './components/DataTable';
import EditDataTable from './components/EditDataTable';
import LoadingSpinner from './components/Spinner/LoadingSpinner';
import JSZip from 'jszip';
import { find } from 'lodash';
import parseCSV from 'csv-parse/lib/sync';
import stringifyCSV from 'csv-stringify/lib/sync';

async function handleTableFile(database, tableName, fileData){
  try {
    let table = await database.getTable(tableName);
    let elements = parseCSV(fileData, {
      bom: true,
      columns: true,
      skip_empty_lines: true,
      on_record: record => { 
        let transRecord = {};
        Object.getOwnPropertyNames(record).forEach(prop => {
          transRecord[prop] = { value: record[prop] }
        });
        return transRecord;
      }
    });

    if (elements && elements.length) {
      if (typeof table !== "object") {
        table = {
          label: tableName,
          columns: []
        }
      }
      
      table.columns = Object.getOwnPropertyNames(elements[0]).map(columnName => {
        let column = find(table.columns, ['name.value', columnName]);
        if (!column) {
          column = {
            name: {value: columnName},
            type: {value: {label: "TEXT", value: "TEXT"}}
          }
        }
    
        return column;
      });
    
      await database.createTable(table.label, table.columns, true);
      await database.setData(table.label, elements);
    }
  } catch (e) {
    console.error(e);
    Box.show(`Can't update table ${tableName}`);
  }
}

async function onUpload (dataBase, button, event) {
  const errorTable = (tableName) => Box.show(`Can't update table ${tableName}`);
  button.current.classList.add('is-loading');
  let zipBlob = event.target.files[0];
  let arrayBuffer = await zipBlob.arrayBuffer();
  let zip = await JSZip.loadAsync(arrayBuffer);
  zip.forEach((relativePath, zipEntry) => {
    const tableName = zipEntry.name.slice(0, zipEntry.name.length - 4);
    zipEntry.async('string')
            .then(handleTableFile.bind(this, dataBase, tableName))
            .catch(errorTable.bind(this, tableName))
  });

  button.current.classList.remove('is-loading');
}

const onDownload = async (dataBase, event) => {
  const button = event.currentTarget;
  button.classList.add('is-loading');
  const ZIP = new JSZip();
  const tables = await dataBase.getTables();

  for (let index = 0; index < tables.length; index++) {
    const table = tables[index];
    const columns = table.columns.map(column => {
      return {
        header: column.name.value,
        key: column.name.value
      }
    });
    const data = await dataBase.getData(table.label);
    let elements = [];
    if (typeof data === "object" && data.elements && data.elements.length) {
      elements = data.elements;
    }

    const fileContent = stringifyCSV(elements, {
      columns: columns,
      header: true,
      cast: {
        object: o => {
          if (o?.value?.label) {
            return '' + o.value.label;
          } else {
            return '' + o?.value;
          }
        }
      }
    });

    ZIP.file(table.label + '.csv', fileContent);
  }

  let base64 = await ZIP.generateAsync({type: "base64"});
  window.open("data:application/zip;base64," + base64);

  button.classList.remove('is-loading');

  /*
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
      return 
    })
  }).catch(error).finally(() => {
    button.classList.remove('is-loading');
  });
  */

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
