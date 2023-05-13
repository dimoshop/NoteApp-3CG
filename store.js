import { createStore } from 'redux';
import notesReducer from './reducers/notesReducer';

const store = createStore(notesReducer);

export default store;
