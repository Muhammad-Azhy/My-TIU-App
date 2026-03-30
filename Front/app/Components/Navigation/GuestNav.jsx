import React from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import useTheme from '../../Hooks/useTheme';

const Footer = ({ setCurrentPage }) => {
  const theme = useTheme();

  return (
    <View style={[styles.footer, { backgroundColor: theme.secondary, borderColor: theme.border }]}>
      <Pressable
        onPress={() => setCurrentPage('chat')}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.card },
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>News</Text>
      </Pressable>

      <Pressable
        onPress={() => setCurrentPage('chat')}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.card },
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Promo</Text>
      </Pressable>

      <Pressable
        onPress={() => setCurrentPage('news')}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.card },
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>News</Text>
      </Pressable>

      <Pressable
        onPress={() => setCurrentPage('chat')}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: theme.card },
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={[styles.buttonText, { color: theme.text }]}>Settings</Text>
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
    backgroundColor: 'rgb(215, 185, 130)',
  },
  buttonText: {
    color: 'rgb(57, 52, 43)',
    fontWeight: 'bold',
  },
});