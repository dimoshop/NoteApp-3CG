import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Entypo } from '@expo/vector-icons';
const NoteItem = ({ note, onPress, onDelete }) => {
  const { id, title, content, images ,selectedColor} = note;

  return (
    <TouchableOpacity style={{ ...styles.container, backgroundColor: selectedColor}} onPress={onPress}>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.content}>{content}</Text>
        {images.length > 0 && (
          <View style={styles.imagesContainer}>
            {images.slice(0, 3).map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.image}
              />
            ))}
            {images.length > 3 && (
              <View style={styles.moreImagesContainer}>
                <Text style={styles.moreImagesText}>+{images.length - 3}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={styles.arrowContainer}>
        <Text style={styles.arrow}></Text>
        {onDelete && (
          <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(id)}>
           <Entypo name="trash" size={24} color="red"  backgroundColor="transparent" style={styles.deleteButton}/>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFCCFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#A0A0A0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom:10,
    marginLeft:5,
    marginRight:5,
    borderRadius:20,
  },
  contentContainer: {
    flex: 1,
    
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  content: {
    fontSize: 16,
    color: '#808080',
    marginBottom: 5,
  },
  imagesContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 5,
  },
  moreImagesContainer: {
    width: 50,
    height: 50,
    borderRadius: 5,
    backgroundColor: '#F0F0F0',
    marginLeft: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moreImagesText: {
    color: '#A0A0A0',
    fontWeight: 'bold',
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A0A0A0',
  },
  deleteButton: {
    borderRadius: 5,
    padding: 5,
    marginTop: 5,
  },
});


export {NoteItem};

