import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const App = () => {
  const showAlert = () => {
    Alert.alert('Button Pressed!', 'You have pressed the button.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome to My App</Text>
      <Button title="Press Me" onPress={showAlert} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default App;