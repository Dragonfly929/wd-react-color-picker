// db.js
import Dexie from 'dexie';

const db = new Dexie('colorPickerDB');
db.version(1).stores({
  favoriteColors: '++id,color',
  likedColors: '++id,color',
});

export default db;
