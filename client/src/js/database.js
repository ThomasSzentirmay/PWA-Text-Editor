import { openDB } from 'idb';

const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

const putDb = async (content) => {
  try {
    const db = await openDB('jate', 1);
    const tx = db.transaction('jate', 'readwrite');
    const store = tx.objectStore('jate');
    await store.put(content);
    await tx.complete;
    console.log('Data added to the database successfully');
  } catch (error) {
    console.error('Error adding data to the database:', error);
  }
};

const getDb = async () => {
  try {
    const db = await openDB('jate', 1);
    const tx = db.transaction('jate', 'readonly');
    const store = tx.objectStore('jate');
    const data = await store.getAll();
    await tx.complete;
    console.log('Data retrieved from the database:', data);
    return data;
  } catch (error) {
    console.error('Error retrieving data from the database:', error);
    return null;
  }
};

initdb();

export { putDb, getDb };