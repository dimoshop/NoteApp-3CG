import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'expo-camera';
import { AntDesign } from '@expo/vector-icons';
const EditNoteScreen = ({ route, navigation }) => {
  const { id } = route.params;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [showCamera, setShowCamera] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  useEffect(() => {
    const getNote = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@notes');
        if (jsonValue != null) {
          const notes = JSON.parse(jsonValue);
          const note = notes.find((note) => note.id === id);
          if (note != null) {
            setTitle(note.title);
            setContent(note.content);
            setImages(note.images);
            setSelectedColor(note.selectedColor);
          }
        }
      } catch (e) {
        console.log(e);
      }
    };
    getNote();
  }, [id]);

  const saveNote = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@notes');
      if (jsonValue != null) {
        const notes = JSON.parse(jsonValue);
        const index = notes.findIndex((note) => note.id === id);
        if (index >= 0) {
          const updatedNote = {
            id: id,
            title: title,
            content: content,
            images: images,
            selectedColor: selectedColor ? selectedColor : 'white',
          };
          notes[index] = updatedNote;
          await AsyncStorage.setItem('@notes', JSON.stringify(notes));
          for (let i = 0; i < deletedImages.length; i++) {
            await AsyncStorage.removeItem(deletedImages[i]);
          }
          navigation.goBack();
        } else {
          Alert.alert('Note not found');
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
  
  const colors = ['lightblue', 'lightpink', 'lightgreen', 'gray'];

  const renderColorButton = (color) => {
    const selected = selectedColor === color;
    return (
      <TouchableOpacity
        key={color}
        style={[
          styles.colorButton,
          { backgroundColor: color },
          selected && { borderWidth: 4, borderColor: 'white' },
        ]}
        onPress={() => {
          setSelectedColor(color);
          
        }}
      >
        {selected && (
          <Ionicons
            name="checkmark-sharp"
            size={24}
            color="white"
            style={styles.checkmark}
          />
        )}
      </TouchableOpacity>

    );
  };

  const takePicture = async () => {
    if (camera) {
      let result = await camera.takePictureAsync();
      setImages([...images, result.uri]);
      setShowCamera(false);
    }
  };  

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.cancelled) {
      setImages([...images, result.uri]);
    }
  };

  const deleteImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    if (index < images.length) {
      setDeletedImages([...deletedImages, images[index]]);
    }
  };



  const renderDeleteButton = (index) => {
    return (
      <TouchableOpacity
        style={styles.deleteImageButton}
        onPress={() => deleteImage(index)}
      >
        <Ionicons name="trash" size={16} color="white" />
      </TouchableOpacity>
    );
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setCameraPermission(status === 'granted');
  };

  const openCamera = async () => {
    if (!cameraPermission) {
      await requestCameraPermission();
    }
    if (cameraPermission) {
      setShowCamera(true);
    }
  };

  return (
    <View style={{ ...styles.container, backgroundColor: selectedColor }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={saveNote}>
          <Text style={styles.headerButton}>Save</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Note</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.headerButton}>Cancel</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.noteContent}>
        <TextInput
          style={[styles.noteTitle, { color:'black'}]}
          placeholder="Title"
          placeholderTextColor="black"
          onChangeText={(text) => setTitle(text)}
          value={title}
        />
        <TextInput
          style={[styles.noteText, {color: 'black' }]}
          placeholder="Write your note here"
          placeholderTextColor="black"
          multiline={true}
          onChangeText={(text) => setContent(text)}
          value={content}
        />
        {images.length > 0 && (
          <View style={styles.imageContainer}>
            {images.map((image, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: image }} style={styles.image} />
                {renderDeleteButton(index)}
              </View>
            ))}
          </View>
        )}
        <View style={styles.button}>
        <TouchableOpacity style={styles.addButton} onPress={pickImage}>
          <AntDesign name="picture" size={24} color={selectedColor} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
        <Ionicons name="camera-outline" size={24} color="white" />
         </TouchableOpacity>
      </View>
      {showCamera && (
        <View style={styles.cameraContainer}>
          <Camera
            style={styles.cameraPreview}
            type={Camera.Constants.Type.back}
            ref={(ref) => setCamera(ref)}
          />
          <TouchableOpacity style={styles.takePictureButton} onPress={takePicture}>
            <Ionicons name="camera-outline" size={32} color="white" />
          </TouchableOpacity>
        </View>
      )}
      </View>
      <View style={styles.colorContainer}>
        {colors.map((color) => renderColorButton(color))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerButton: {
    fontSize: 18,
    color: '#007AFF',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  noteContent: {
    flex: 1,
  },
  noteTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noteText: {
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  imageWrapper: {
    width: '30%',
    aspectRatio: 1,
    marginHorizontal: '1.5%',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  deleteImageButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'red',
    borderRadius: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  checkmark: {
    position: 'absolute',
    top: 5,
    left: 5,
  },
  button:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'flex-end',
  },
  cameraButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginBottom: 20,
    display:'flex',
    alignItems:'center',
    justifyContent:'center',
    },
    cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    },
    cameraPreview: {
    flex: 1,
    width: '100%',
    },
});

export default EditNoteScreen;