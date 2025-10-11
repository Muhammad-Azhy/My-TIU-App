import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';

const Footer = ({ setCurrentPage,  }) => {
  return (
    <View style={styles.footer}>
      <Pressable
        onPress={() => setCurrentPage('chat')}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>Admin</Text>
      </Pressable>

      <Pressable
        onPress={() => setCurrentPage('chat')}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>Admin</Text>
      </Pressable>

      <Pressable
        onPress={() => setCurrentPage('news')}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>News</Text>
      </Pressable>

      <Pressable
        onPress={() => setCurrentPage('chat')}
        style={({ pressed }) => [
          styles.button,
          pressed && styles.buttonPressed
        ]}
      >
        <Text style={styles.buttonText}>Settings</Text>
      </Pressable>
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-start',
    paddingVertical: 25,
    backgroundColor: '#7e1646',
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: 'rgb(232, 207, 163)',
  },
  buttonPressed: {
    backgroundColor: 'rgb(215, 185, 130)', // slightly darker shade on press
  },
  buttonText: {
    color: 'rgb(57, 52, 43)',
    fontWeight: 'bold',
  },
});
