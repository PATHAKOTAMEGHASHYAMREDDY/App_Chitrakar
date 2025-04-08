import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './naviagtion/AppNavigator';
import Constants from 'expo-constants';
process.env.API_URL = Constants.expoConfig.extra.apiUrl;
export default function App() {
  return (
    <>
      <AppNavigator />
      <StatusBar style="auto" />
    </>
  );
}