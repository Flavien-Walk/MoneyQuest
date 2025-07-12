import React from 'react';
import { View } from 'react-native';
import Home from '../components/Home';
import Navbar from '../components/Navbar';

/**
 * Page d'accueil principale de l'application
 * Dashboard principal avec navigation
 */
const HomePage: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Home />
      <Navbar />
    </View>
  );
};

export default HomePage;