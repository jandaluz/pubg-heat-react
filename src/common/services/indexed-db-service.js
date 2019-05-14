const ONE_WEEK_IN_MILIS = 1000*60*60*24*7;

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
            db.createObjectStore("user", { keyPath: "setting"});
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

function mapNeedsRefresh(db, codeName) {
    const dbRequest = db.transaction("maps")
        .objectStore("maps")
        .get(codeName);
    return new Promise( (resolve, reject) => {
        dbRequest.onsuccess = (event) => {
            const now = new Date();
            const mapRowObj = event.target.result;
            if(mapRowObj) {
                const diff = now - mapRowObj.timestamp;
                resolve(diff > ONE_WEEK_IN_MILIS);
            } else {
                resolve(true);
            }
        };
        dbRequest.onerror = (event) => {
            resolve(true);
        }
    });
}

export default {
    openDb,
    getMapImgData,
    mapNeedsRefresh
}