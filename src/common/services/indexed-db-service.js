function openDb(dbName) {
    const dbRequest = indexedDB.open("pubg-heat", 3);
    return new Promise( (resolve, reject) => {
        dbRequest.onerror = (event) => {
            console.error("db error", event);
            reject(new Error('db error'));
        };
        dbRequest.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore("maps", { keyPath: "codeName" });
            resolve(db);
        }

        dbRequest.onsuccess = (event) => {
            const db = event.target.result;
            resolve(db);
        }
    })
}

function getMapImgData(db, codeName) {
    const dbRequest = db.transaction("maps")
        .objectStore("maps")
        .get(codeName);
    return new Promise( (resolve, reject) => {
        dbRequest.onsuccess = (event) => {
            const mapRowObj = event.target.result;
            resolve(mapRowObj.mapData);
        };
        dbRequest.onerror = (event) => {
            console.error("db error", event);
            reject(new Error('db error'));
        };
    });
}

export default {
    openDb,
    getMapImgData
}