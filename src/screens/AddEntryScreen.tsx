import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StatusBar, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { useTheme } from '../utils/theme';
import { saveEntry } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, TravelEntry } from '../types';

type AddEntryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddEntry'>;

const AddEntryScreen = () => {
  const { colors, toggleTheme, isDark } = useTheme();
  const navigation = useNavigation<AddEntryScreenNavigationProp>();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const takePicture = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') return;
    
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      await getAddressFromLocation();
    }
  };

  const getAddressFromLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    
    const location = await Location.getCurrentPositionAsync({});
    const addressResult = await Location.reverseGeocodeAsync({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });

    if (addressResult[0]) {
      const addr = addressResult[0];
      setAddress(`${addr.street}, ${addr.city}, ${addr.region} ${addr.postalCode}`);
    }
  };

  const handleSave = async () => {
    if (!imageUri || isSaving) return;
    
    setIsSaving(true);
    try {
      const entry: Omit<TravelEntry, 'id'> = {
        imageUri,
        address,
        date: new Date().toLocaleDateString(),
        note
      };

      await saveEntry(entry);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Entry Saved!',
          body: 'Your travel memory was saved successfully',
        },
        trigger: null,
      });

      navigation.goBack();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: StatusBar.currentHeight, paddingHorizontal: 16 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={{ color: colors.primary }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Add Entry</Text>
          <TouchableOpacity onPress={toggleTheme}>
            <Text style={{ color: colors.primary }}>{isDark ? '☀️' : '🌙'}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.imageButton, { backgroundColor: colors.primary }]}
          onPress={takePicture}
        >
          <Text style={styles.buttonText}>
            {imageUri ? 'Retake Picture' : 'Take Picture'}
          </Text>
        </TouchableOpacity>

        {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
        {address && <Text style={[styles.address, { color: colors.text }]}>{address}</Text>}

        <TextInput
          style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
          placeholder="Add a note..."
          placeholderTextColor={colors.text}
          value={note}
          onChangeText={setNote}
          multiline
        />

        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: colors.primary }]}
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
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
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AddEntryScreen;