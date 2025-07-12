import React from 'react';
import { View } from 'react-native';
import Market from '../components/Market';
import Navbar from '../components/Navbar';

/**
 * Page d'exploration des marchés financiers
 * Interface gamifiée pour découvrir les actifs en temps réel
 */
const MarketPage: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <Market />
      <Navbar />
    </View>
  );
};

export default MarketPage;