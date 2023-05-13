export const addNote = (title, content, image) => ({
    type: 'ADD_NOTE',
    payload: {
      title,
      content,
      image,
    },
  });
  
  export const removeNote = (id) => ({
    type: 'REMOVE_NOTE',
    payload: {
      id,
    },
  });
  