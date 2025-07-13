import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Home, BarChart3, Users, User } from 'lucide-react-native';

// === DESIGN TOKENS ===
const tokens = {
  colors: {
    primary: '#3b82f6',
    primaryLight: '#dbeafe',
    secondary: '#6366f1',
    
    // Surfaces
    surface: '#ffffff',
    background: '#f8fafc',
    
    // Text
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    
    // Borders
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    
    // States
    active: '#3b82f6',
    inactive: '#64748b',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
  },
  
  radius: {
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
  },
  
  shadows: {
    navbar: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -8 },
      shadowOpacity: 0.1,
      shadowRadius: 16,
      elevation: 12,
    },
  },
};

/**
 * Composant de navigation moderne
 * Barre de navigation avec icônes vectorielles clean et design tokens
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
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.navItem}
        onPress={handleHomePress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Home size={22} color={tokens.colors.inactive} strokeWidth={2} />
        </View>
        <Text style={styles.navLabel}>Accueil</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={handleMarketPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <BarChart3 size={22} color={tokens.colors.inactive} strokeWidth={2} />
        </View>
        <Text style={styles.navLabel}>Marché</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={handleGroupsPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Users size={22} color={tokens.colors.inactive} strokeWidth={2} />
        </View>
        <Text style={styles.navLabel}>Groupes</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem}
        onPress={handleProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <User size={22} color={tokens.colors.inactive} strokeWidth={2} />
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
    backgroundColor: tokens.colors.surface,
    paddingVertical: tokens.spacing.lg,
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing['2xl'],
    borderTopWidth: 1,
    borderTopColor: tokens.colors.borderLight,
    borderTopLeftRadius: tokens.radius['2xl'],
    borderTopRightRadius: tokens.radius['2xl'],
    ...tokens.shadows.navbar,
  },
  
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: tokens.spacing.sm,
  },
  
  iconContainer: {
    marginBottom: tokens.spacing.xs + 2,
  },
  
  navLabel: {
    fontSize: 11,
    color: tokens.colors.inactive,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});

export default Navbar;