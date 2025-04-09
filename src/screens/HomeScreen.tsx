import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useTheme } from '../utils/theme';
import { getEntries, removeEntry } from '../utils/storage';
import TravelEntryItem from '../components/TravelEntryItem';
import { useIsFocused } from '@react-navigation/native';
import { TravelEntry } from '../types';

const HomeScreen = ({ navigation }: { navigation: any }) => {
  const { colors, isDark, toggleTheme } = useTheme();
  const [entries, setEntries] = useState<TravelEntry[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadEntries = async () => {
      const loadedEntries = await getEntries();
      setEntries(loadedEntries);
    };
    
    if (isFocused) {
      loadEntries();
    }
  }, [isFocused]);

  const handleRemove = async (id: string) => {
    await removeEntry(id);
    setEntries(await getEntries());
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>My Travel Diary</Text>
        <TouchableOpacity onPress={toggleTheme} style={styles.themeButton}>
          <Text style={{ color: colors.primary }}>{isDark ? '☀️' : '🌙'}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.addButton, { backgroundColor: colors.primary }]}
        onPress={() => navigation.navigate('AddEntry')}
      >
        <Text style={styles.addButtonText}>+ Add New Entry</Text>
      </TouchableOpacity>

      {entries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.text }]}>No entries yet</Text>
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TravelEntryItem item={item} onRemove={handleRemove} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
  },
  listContent: {
    paddingBottom: 20,
  },
});

export default HomeScreen;