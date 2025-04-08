import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Chitrakar</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.subtitle}>Welcome to Chitrakar</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, { backgroundColor: '#e67e22' }]}>
            <Text style={styles.buttonText}>Artist Login</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.button, { backgroundColor: '#3498db' }]}>
            <Text style={styles.buttonText}>Customer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e67e22',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d3436',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    maxWidth: 300,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});