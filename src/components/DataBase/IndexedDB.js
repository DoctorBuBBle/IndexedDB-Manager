export default class DataBase {

    async getDataBase(){
        if (!window.indexedDB) {
            throw new Error("Your browser doesn't support a stable version of IndexedDB. You need to use the latest version of Chrome or Firefox to use this webside.");
        }

        if (!this.getDataBase.result) {
            this.getDataBase.result = new Promise((resolve, reject) => {
                let request = window.indexedDB.open("main");
                request.onerror = function(event) {
                    reject("To use this webapp you need to allow it access to your IndexedDB");
                };
                request.onsuccess = function(event){
                    resolve(event.target.result);
                };
            });
        }

        return this.getDataBase.result;
    }

    /**
     * Creates a table with the given name and columns.
     * @param {String} name 
     * @param {Array} columns - An array of objects that configurate each column
     * 
     * column: {
     *      {String} name - The name of the column
     *      {Object} config - undefined or an object that configurates the column
     * }
     */
    async createTable(name, columns){
        let db = await this.getDataBase();

        return new Promise((resolve, reject) => {
            let objectStore = db.createObjectStore(name, {keyPath: "id", autoIncrement: true});
            
            if (Array.isArray(columns)) {
                columns.forEach(element => {
                    if (typeof element === "string") {
                        element = { name: element };
                    }
                    if (typeof element !== "object") {
                        reject("A column is not an object or string");
                    }

                    let config = element.config || {
                        unique: false
                    };
                    objectStore.createIndex(element.name, element.name, config);
                });
            }

            objectStore.transaction.oncomplete = function(evet){
                resolve();
            };
        });
    }
 
    async getTables(){
        const db = await this.getDataBase();

        return Array.prototype.slice.call(db.objectStoreNames, 0);
    }
}