import Box from "../Boxes/Box";

export default class DataBase {

    async getDataBase(){
        if (!window.indexedDB) {
            throw new Error("Your browser doesn't support a stable version of IndexedDB. You need to use the latest version of Chrome or Firefox to use this webside.");
        }

        if (!this.getDataBase.result) {
            this.getDataBase.result = new Promise((resolve, reject) => {
                let tablesPromise;
                let dataPromise;
                let request = window.indexedDB.open("main", 4);
                request.onerror = function(event) {
                    reject("To use this webapp you need to allow it access to your IndexedDB");
                };
                request.onsuccess = function(event){
                    if (tablesPromise) {
                        Promise.all([tablesPromise, dataPromise]).then(db => {
                            resolve(db);
                        })
                    } else {
                        resolve(event.target.result);
                    }
                };
                request.onupgradeneeded = function(event) {
                    let db = event.target.result;
                    let tablesStore = db.createObjectStore("tables", {
                        keyPath: "label",
                        autoIncrement: false
                    });
                    tablesStore.createIndex("label", "label", {unique: true});

                    tablesPromise = new Promise((resolve, reject) => {
                        tablesStore.transaction.oncomplete = function(){
                            resolve(db)
                        }
                    });
                    
                    let dataStore = db.createObjectStore("data", {
                        keyPath: "table",
                        autoIncrement: false
                    });

                    dataStore.createIndex("label", "label", {unique: true});

                    dataPromise = new Promise (resolve => {
                        dataStore.transaction.oncomplete = function(){
                            resolve(db);
                        }
                    });
                }
            });
        }

        return this.getDataBase.result;
    }

    /**
     * Creates a table with the given name and columns.
     * @param {String} name 
     * @param {Array} columns - An array of objects that configurate each column
     * @param {Boolean} overwrite - default false
     * 
     * column: {
     *      {String} name - The name of the column
     *      {Object} config - undefined or an object that configurates the column
     * }
     */
    async createTable(name, columns, overwrite){
        let db = await this.getDataBase();

        return new Promise((resolve, reject) => {
            let transaction = db.transaction(["tables", "data"], "readwrite");
            transaction.oncomplete = event => { resolve(); }
            transaction.onerror = event => { 
                Box.show('Ups! I can\'t create or save the changes to your table', [{ label: "OK" }], Box.LEVEL.ERROR);
                reject();
            }
            
            const addToObjectStore = () => {
                transaction.objectStore("tables").put({
                    label: name,
                    columns: columns
                });
                transaction.objectStore("data").put({
                    table: name,
                    elements: []
                });
            }

            if (!overwrite) {
                let request = transaction.objectStore("tables").get(name);
                request.onsuccess = function(event) {
                    if (typeof event.target.result === "object") {
                        Box.show(`The table ${name} already exists`, [{ label: "OK" }], Box.LEVEL.WARN);
                        reject();
                    } else {
                        addToObjectStore();
                    }
                };
                request.onerror = function(event){
                    reject();
                }
            } else {
                addToObjectStore();
            }
        });
    }

    async removeTable(name) {
        let db = await this.getDataBase();
        
        let transaction = db.transaction(["tables", "data"], "readwrite");
        let tablesReq = transaction.objectStore("tables").delete(name);

        const tablesPromise = new Promise((resolve, reject) => {
            tablesReq.onsuccess = resolve;
            tablesReq.onerror = reject;
        });

        let dataReq = transaction.objectStore("data").delete(name);
        const dataPromise = new Promise((resolve, reject) => {
            dataReq.onsuccess = resolve;
            dataReq.onerror = reject;
        });

        return Promise.all([tablesPromise, dataPromise]);
    }
 
    async getTables(){
        const db = await this.getDataBase();
        const objectStore = db.transaction("tables").objectStore("tables");

        return new Promise((resolve, reject) => {
            objectStore.getAll().onsuccess = function(event) {
                resolve(event.target.result);
            }

            objectStore.getAll().onerror = function(event) {
                reject(event);
            }
        });
    }
}