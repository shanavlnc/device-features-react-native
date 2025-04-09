import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StatusBar, StyleSheet } from 'react-native';
import { useTheme } from '../utils/theme';
import { getEntries, removeEntry } from '../utils/storage';
import { useIsFocused } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';

type TravelEntry = {
  id: string;
  imageUri: string;
  address: string;
  date: string;
  note?: string;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { colors } = useTheme();
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadEntries = async () => {
      const loadedEntries = await getEntries();
      setEntries(loadedEntries);
    };
    if (isFocused) loadEntries();
  }, [isFocused]);

  const handleRemove = async (id: string) => {
    await removeEntry(id);
    setEntries(await getEntries());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingTop: StatusBar.currentHeight, paddingHorizontal: 16 }}>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={() => navigation.navigate('AddEntry')}
        >
          <Text style={styles.addButtonText}>+ Add New Entry</Text>
        </TouchableOpacity>

        {entries.length === 0 ? (
          <Text style={[styles.emptyText, { color: colors.text }]}>No entries yet</Text>
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={[styles.entryContainer, { backgroundColor: colors.card }]}>
                <Image source={{ uri: item.imageUri }} style={styles.entryImage} />
                <View style={styles.entryDetails}>
                  <Text style={[styles.entryAddress, { color: colors.text }]}>{item.address}</Text>
                  <Text style={[styles.entryDate, { color: colors.text }]}>{item.date}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.removeButton, { backgroundColor: colors.primary }]}
                  onPress={() => handleRemove(item.id)}
                >
                  <Text style={styles.removeButtonText}>×</Text>
                </TouchableOpacity>
              </View>
            )}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
  },
  entryContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    alignItems: 'center',
  },
  entryImage: {
    width: 80,
    height: 80,
  },
  entryDetails: {
    flex: 1,
    padding: 10,
  },
  entryAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  entryDate: {
    fontSize: 14,
    opacity: 0.7,
  },
  removeButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;