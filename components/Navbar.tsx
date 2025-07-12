import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, BarChart3, Users, User } from 'lucide-react-native';

/**
 * Composant de navigation moderne
 * Barre de navigation avec icônes vectorielles clean
 */
const Navbar: React.FC = () => {
  const router = useRouter();

  const handleHomePress = () => {
    router.push('/home');
  };

  const handleMarketPress = () => {
    router.push('/market');
  };

  const handleGroupsPress = () => {
    console.log('Navigation vers les groupes');
  };

  const handleProfilePress = () => {
    console.log('Navigation vers le profil');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={handleHomePress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Home size={22} color="#64748b" strokeWidth={2} />
        </View>
        <Text style={styles.navLabel}>Accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={handleMarketPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <BarChart3 size={22} color="#64748b" strokeWidth={2} />
        </View>
        <Text style={styles.navLabel}>Marché</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={handleGroupsPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Users size={22} color="#64748b" strokeWidth={2} />
        </View>
        <Text style={styles.navLabel}>Groupes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <User size={22} color="#64748b" strokeWidth={2} />
        </View>
        <Text style={styles.navLabel}>Profil</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  iconContainer: {
    marginBottom: 6,
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default Navbar;