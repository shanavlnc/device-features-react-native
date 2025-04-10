import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Platform, StatusBar } from 'react-native';
import { useTheme } from '../utils/theme';
import { getEntries, removeEntry } from '../utils/storage';
import { useIsFocused } from '@react-navigation/native';
import { TravelEntry } from '../types';

const TravelEntryItem = ({ item, onRemove }: { item: TravelEntry; onRemove: (id: string) => void }) => {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  
  return (
    <TouchableOpacity 
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.8}
      style={[styles.itemContainer, { 
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: expanded ? colors.primary : 'transparent'
      }]}
    >
      <Image source={{ uri: item.imageUri }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={[styles.itemAddress, { color: colors.text }]}>
          {item.address}
        </Text>
        {item.note && (
          <Text 
            style={[styles.itemNote, { color: colors.text }]} 
            numberOfLines={expanded ? undefined : 2}
          >
            {item.note}
          </Text>
        )}
        <Text style={[styles.itemDate, { color: colors.text }]}>{item.date}</Text>
      </View>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        style={[styles.removeButton, { right: 10, top: 10 }]}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

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
        <Text style={[styles.title, { color: colors.text }]}>Travel Diary</Text>
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
          showsVerticalScrollIndicator={false}
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
  itemContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    alignItems: 'flex-start',
    padding: 10,
    position: 'relative',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    padding: 10,
    marginRight: 10,
  },
  itemAddress: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    paddingRight: 40,
  },
  itemNote: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
    flexShrink: 1,
  },
  itemDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  removeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#e08298',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  removeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    lineHeight: 21.5,
    textAlign: 'center',
    width: '100%',
  },
});

export default HomeScreen;