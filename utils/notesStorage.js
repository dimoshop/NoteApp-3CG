import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('notes.db');

export const addNote = (title, content, images) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'INSERT INTO notes (title, content, images) VALUES (?, ?, ?)',
        [title, content, JSON.stringify(images)],
        (_, result) => {
          resolve(result.insertId);
        },
        (_, error) => {
          reject(error);
        },
      );
    });
  });
};
