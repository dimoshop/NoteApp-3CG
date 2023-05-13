import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import NoteListScreen from './screens/NoteListScreen';
import AddNoteScreen from './screens/AddNoteScreen';
import EditNoteScreen from './screens/EditNoteScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="NoteList" component={NoteListScreen} options={{ title: 'My Notes' }} />
        <Stack.Screen name="AddNote" component={AddNoteScreen} options={{ title: 'Add Note' }} />
        <Stack.Screen name="EditNote" component={EditNoteScreen} options={{ title: 'Edit Note' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
