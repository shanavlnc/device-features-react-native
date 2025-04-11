import React, { useState } from 'react';
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
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => item.note && setExpanded(!expanded)}
      activeOpacity={item.note ? 0.8 : 1}
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderWidth: item.note && expanded ? 1 : 0,
          borderColor: colors.primary
        }
      ]}
    >
      <Image source={{ uri: item.imageUri }} style={styles.image} />
      <View style={styles.details}>
        <Text style={[styles.address, { color: colors.text }]}>
          {item.address}
        </Text>
        {item.note && (
          <Text 
            style={[styles.note, { color: colors.text }]} 
            numberOfLines={expanded ? undefined : 2}
          >
            {item.note}
          </Text>
        )}
        <Text style={[styles.date, { color: colors.text }]}>{item.date}</Text>
      </View>
      <TouchableOpacity
        onPress={(e) => {
          e.stopPropagation();
          onRemove(item.id);
        }}
        style={[styles.removeButton, { backgroundColor: colors.primary }]}
      >
        <Text style={styles.removeButtonText}>×</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 15,
    alignItems: 'center',
    padding: 10,
    position: 'relative',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    padding: 10,
    marginRight: 10,
  },
  address: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  note: {
    fontSize: 14,
    opacity: 0.8,
    marginBottom: 5,
    flexShrink: 1,
  },
  date: {
    fontSize: 12,
    opacity: 0.6,
  },
  removeButton: {
    position: 'absolute',
    right: 10,
    top: 10,
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
    lineHeight: 20,
    textAlign: 'center',
  },
});

export default TravelEntryItem;