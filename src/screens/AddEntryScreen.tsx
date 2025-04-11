import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';
import Toast from 'react-native-toast-message';
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
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
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
      setIsLoadingAddress(true);
      try {
        const { address } = await getDetailedLocation();
        setAddress(address);
      } catch (err) {
        setError('Failed to get location');
        console.error(err);
      } finally {
        setIsLoadingAddress(false);
      }
    }
  };

  const sendNotification = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'DailyLife 🩷',
          body: 'Your memory has been saved successfully!',
          sound: 'default',
        },
        trigger: null,
      });
    } catch (err) {
      console.error('Notification error:', err);
    }
  };

  const showToast = () => {
    Toast.show({
      type: 'success',
      text1: 'Success!',
      text2: 'Memory saved successfully',
      position: 'bottom',
      visibilityTime: 2000,
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
        date: new Date().toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        note,
      };

      await saveEntry(entry);
      
      // Show both notification and toast (you can choose one)
      await sendNotification();
      showToast();
      
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
        <Text style={[styles.title, { color: colors.text }]}>Add Memory</Text>
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

      {isLoadingAddress ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.text }]}>Getting address...</Text>
        </View>
      ) : (
        <Text style={[styles.address, { color: colors.text }]}>
          {address || 'Address will appear here after taking photo'}
        </Text>
      )}

      <TextInput
        style={[styles.input, { 
          backgroundColor: colors.card, 
          color: colors.text,
          borderColor: colors.border
        }]}
        placeholder="Add a note..."
        placeholderTextColor={colors.text}
        value={note}
        onChangeText={setNote}
        multiline
        maxLength={200}
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#ccc' }]}
          onPress={() => navigation.goBack()}
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
          {isSaving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Save Memory</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <Toast />
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 16,
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
    justifyContent: 'center',
    minHeight: 50,
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