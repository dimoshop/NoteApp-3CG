import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { NoteItem } from '../components/NoteItem.js';
import { EvilIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
const NoteListScreen = ({ navigation }) => {
  const [notes, setNotes] = useState([]);
  const isFocused = useIsFocused();
  const [listStyle, setListStyle] = useState('single-column'); // default style

  useEffect(() => {
    getNotes();
  }, [isFocused]);

  const getNotes = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@notes');
      if (jsonValue != null) {
        setNotes(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log(e);
    }
  };

  const deleteNote = async (id) => {
    try {
      const filteredNotes = notes.filter((note) => note.id !== id);
      setNotes(filteredNotes);
      await AsyncStorage.setItem('@notes', JSON.stringify(filteredNotes));
    } catch (e) {
      console.log(e);
    }
  };

  const toggleListStyle = () => {
    setListStyle(listStyle === 'single-column' ? 'two-columns' : 'single-column');
  };

  const renderNoteItem = ({ item }) => (
    <View style={listStyle === 'single-column' ? null : styles.noteItem}>
      <NoteItem
        note={item}
        onPress={() => navigation.navigate('EditNote', { id: item.id })}
        onDelete={() => deleteNote(item.id)}
      />
    </View>
  );

  const renderSeparator = () => <View style={listStyle === 'single-column' ? null : styles.separator} />;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Notes</Text>
        <TouchableOpacity onPress={toggleListStyle}>
          <Ionicons name={listStyle === 'single-column' ? 'grid' : 'list'} size={32} color="blue" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        key={listStyle}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNoteItem}
        ItemSeparatorComponent={renderSeparator}
        numColumns={listStyle === 'single-column' ? 1 : 2}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
        <EvilIcons name="plus" size={50} color="blue" onPress={() => navigation.navigate('AddNote')} style={styles.plus} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16 // set a value for marginBottom
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  plus: {
    backgroundColor: 'white',
  },
  noteItem: {
    flex: 0.5,
  },
  separator: {
    height: 16,
  },
});
export default NoteListScreen;
