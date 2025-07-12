import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  TrendingUp, 
  User, 
  BarChart3, 
  Users, 
  ShoppingBag, 
  Trophy,
  ChevronRight,
  Newspaper,
  Wallet,
  Target,
  Zap
} from 'lucide-react-native';
import { homeStyles } from '../styles/HomeStyle';

/**
 * Composant principal du dashboard
 * Interface moderne avec icônes vectorielles et design clean
 */
const Home: React.FC = () => {
  const router = useRouter();

  const handleViewMarket = () => {
    router.push('/market');
  };

  const handleViewGroups = () => {
    console.log('Navigation vers les groupes');
  };

  const handleViewProfile = () => {
    console.log('Navigation vers le profil');
  };

  const handleViewShop = () => {
    console.log('Navigation vers la boutique');
  };

  return (
    <View style={homeStyles.container}>
      <ScrollView 
        style={homeStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={homeStyles.scrollContent}
      >
        {/* Header moderne avec profil */}
        <View style={homeStyles.header}>
          <View style={homeStyles.greetingContainer}>
            <Text style={homeStyles.greetingText}>Bonjour</Text>
            <Text style={homeStyles.motivationText}>Prêt à investir aujourd'hui ?</Text>
          </View>
          <TouchableOpacity style={homeStyles.profileButton} onPress={handleViewProfile}>
            <User size={20} color="#64748b" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Carte portefeuille premium */}
        <View style={homeStyles.portfolioCard}>
          <View style={homeStyles.portfolioHeader}>
            <View style={homeStyles.portfolioTitleContainer}>
              <Wallet size={20} color="#ffffff" strokeWidth={2} />
              <Text style={homeStyles.portfolioTitle}>Portefeuille</Text>
            </View>
            <View style={homeStyles.trendIndicator}>
              <TrendingUp size={16} color="#10b981" strokeWidth={2.5} />
            </View>
          </View>
          
          <View style={homeStyles.balanceContainer}>
            <Text style={homeStyles.balanceLabel}>Valeur totale</Text>
            <View style={homeStyles.balanceRow}>
              <Text style={homeStyles.balanceValue}>---,--</Text>
              <Text style={homeStyles.balanceCurrency}>€</Text>
            </View>
          </View>

          <View style={homeStyles.portfolioStats}>
            <View style={homeStyles.statItem}>
              <Target size={14} color="#94a3b8" strokeWidth={2} />
              <Text style={homeStyles.statValue}>--</Text>
              <Text style={homeStyles.statLabel}>Positions</Text>
            </View>
            <View style={homeStyles.statDivider} />
            <View style={homeStyles.statItem}>
              <TrendingUp size={14} color="#94a3b8" strokeWidth={2} />
              <Text style={homeStyles.statValue}>--%</Text>
              <Text style={homeStyles.statLabel}>Performance</Text>
            </View>
            <View style={homeStyles.statDivider} />
            <View style={homeStyles.statItem}>
              <Zap size={14} color="#94a3b8" strokeWidth={2} />
              <Text style={homeStyles.statValue}>-- XP</Text>
              <Text style={homeStyles.statLabel}>Expérience</Text>
            </View>
          </View>
        </View>

        {/* Actions rapides modernisées */}
        <View style={homeStyles.quickActionsContainer}>
          <Text style={homeStyles.sectionTitle}>Actions rapides</Text>
          <View style={homeStyles.actionsGrid}>
            <TouchableOpacity 
              style={[homeStyles.actionCard, homeStyles.primaryAction]}
              onPress={handleViewMarket}
              activeOpacity={0.8}
            >
              <View style={homeStyles.actionIconContainer}>
                <BarChart3 size={24} color="#3b82f6" strokeWidth={2} />
              </View>
              <Text style={[homeStyles.actionTitle, homeStyles.primaryActionText]}>Explorer</Text>
              <Text style={[homeStyles.actionSubtitle, homeStyles.primaryActionSubtext]}>les marchés</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={homeStyles.actionCard}
              onPress={handleViewGroups}
              activeOpacity={0.8}
            >
              <View style={homeStyles.actionIconContainer}>
                <Users size={24} color="#64748b" strokeWidth={2} />
              </View>
              <Text style={homeStyles.actionTitle}>Groupes</Text>
              <Text style={homeStyles.actionSubtitle}>et défis</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={homeStyles.actionCard}
              onPress={handleViewShop}
              activeOpacity={0.8}
            >
              <View style={homeStyles.actionIconContainer}>
                <ShoppingBag size={24} color="#64748b" strokeWidth={2} />
              </View>
              <Text style={homeStyles.actionTitle}>Boutique</Text>
              <Text style={homeStyles.actionSubtitle}>boosts & outils</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={homeStyles.actionCard}
              onPress={handleViewProfile}
              activeOpacity={0.8}
            >
              <View style={homeStyles.actionIconContainer}>
                <Trophy size={24} color="#64748b" strokeWidth={2} />
              </View>
              <Text style={homeStyles.actionTitle}>Succès</Text>
              <Text style={homeStyles.actionSubtitle}>et classements</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section actualités épurée */}
        <View style={homeStyles.newsSection}>
          <View style={homeStyles.newsSectionHeader}>
            <View style={homeStyles.newsTitleContainer}>
              <Newspaper size={20} color="#1e293b" strokeWidth={2} />
              <Text style={homeStyles.sectionTitle}>Actualités</Text>
            </View>
            <TouchableOpacity style={homeStyles.seeAllButton}>
              <Text style={homeStyles.seeAllText}>Voir tout</Text>
              <ChevronRight size={16} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          
          <View style={homeStyles.newsPlaceholder}>
            <View style={homeStyles.newsPlaceholderIconContainer}>
              <Newspaper size={32} color="#94a3b8" strokeWidth={1.5} />
            </View>
            <Text style={homeStyles.newsPlaceholderTitle}>
              Les dernières actualités financières
            </Text>
            <Text style={homeStyles.newsPlaceholderSubtitle}>
              Restez informé des mouvements du marché en temps réel
            </Text>
          </View>
        </View>

        {/* Espace pour la navbar */}
        <View style={homeStyles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default Home;