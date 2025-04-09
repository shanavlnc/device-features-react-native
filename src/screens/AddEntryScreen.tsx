import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../utils/theme';
import { saveEntry } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { getDetailedLocation } from '../utils/location';

const AddEntryScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      setError('Camera permission is required');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      try {
        const { address } = await getDetailedLocation();
        setAddress(address);
      } catch (err) {
        setError('Failed to get location');
        console.error(err);
      }
    }
  };

  const sendNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Travel Saved!',
        body: 'Your travel memory has been saved',
        sound: 'default',
      },
      trigger: null,
    });
  };

  const handleSave = async () => {
    if (!imageUri) {
      setError('Please take a picture first');
      return;
    }

    setIsSaving(true);
    try {
      const entry = {
        imageUri,
        address: address || 'Location not available',
        date: new Date().toLocaleDateString(),
        note,
      };

      await saveEntry(entry);
      await sendNotification();
      
      // Clear form and navigate
      setImageUri(null);
      setAddress('');
      setNote('');
      navigation.goBack();
    } catch (err) {
      setError('Failed to save entry');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Add Travel Entry</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={{ color: colors.primary }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.imageButton, { backgroundColor: colors.primary }]}
        onPress={takePicture}
        disabled={isSaving}
      >
        <Text style={styles.buttonText}>
          {imageUri ? 'Retake Picture' : 'Take Picture'}
        </Text>
      </TouchableOpacity>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <Text style={[styles.address, { color: colors.text }]}>
        {address || 'Address will appear here after taking photo'}
      </Text>

      <TextInput
        style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
        placeholder="Add a note..."
        placeholderTextColor={colors.text}
        value={note}
        onChangeText={setNote}
        multiline
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ccc' }]}
          onPress={() => {
            setImageUri(null);
            setAddress('');
            setNote('');
            navigation.goBack();
          }}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { 
            backgroundColor: colors.primary,
            opacity: imageUri ? 1 : 0.5
          }]}
          onPress={handleSave}
          disabled={!imageUri || isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'Saving...' : 'Save Entry'}
          </Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  themeButton: {
    padding: 10,
  },
  imageButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginBottom: 20,
  },
  address: {
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default AddEntryScreen;