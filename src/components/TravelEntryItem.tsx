import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../utils/theme';
import { TravelEntry } from '../types';

const TravelEntryItem = ({
  item,
  onRemove,
}: {
  item: TravelEntry;
  onRemove: (id: string) => void;
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.details}>
        <Text style={[styles.address, { color: colors.text }]}>{item.address}</Text>
        <Text style={[styles.date, { color: colors.text }]}>{item.date}</Text>
      </View>
      <TouchableOpacity
        onPress={() => onRemove(item.id)}
        style={[styles.removeButton, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
  },
  details: {
    flex: 1,
    padding: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
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
});

export default TravelEntryItem;