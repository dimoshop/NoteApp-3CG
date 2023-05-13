const initialState = {
    notes: [],
  };
  
  const notesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'ADD_NOTE':
        return {
          ...state,
          notes: [
            ...state.notes,
            {
              id: Date.now(),
              title: action.payload.title,
              content: action.payload.content,
              image: action.payload.image,
            },
          ],
        };
      case 'REMOVE_NOTE':
        return {
          ...state,
          notes: state.notes.filter((note) => note.id !== action.payload.id),
        };
      default:
        return state;
    }
  };
  
  export default notesReducer;
  