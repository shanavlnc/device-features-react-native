import AsyncStorage from '@react-native-async-storage/async-storage';

type TravelEntry = {
  id: string;
  imageUri: string;
  address: string;
  date: string;
};

const STORAGE_KEY = '@TravelDiary/entries';

export const saveEntry = async (entry: Omit<TravelEntry, 'id'>) => {
  try {
    const existingEntries = await getEntries();
    const newEntry = { ...entry, id: Date.now().toString() };
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...existingEntries, newEntry])
    );
    return newEntry;
  } catch (error) {
    console.error('Failed to save entry', error);
    throw error;
  }
};

export const getEntries = async (): Promise<TravelEntry[]> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEY);
    return value ? JSON.parse(value) : [];
  } catch (error) {
    console.error('Failed to load entries', error);
    return [];
  }
};

export const removeEntry = async (id: string) => {
  try {
    const entries = await getEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
    return filteredEntries;
  } catch (error) {
    console.error('Failed to remove entry', error);
    throw error;
  }
};

export const clearEntries = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear entries', error);
    throw error;
  }
};