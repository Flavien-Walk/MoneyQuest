import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const homeStyles = StyleSheet.create({
  // === CONTENEUR PRINCIPAL ===
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },

  greetingContainer: {
    flex: 1,
  },

  greetingText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },

  motivationText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  // === BARRE DE RECHERCHE ===
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
    position: 'relative',
    zIndex: 1000,
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
    marginLeft: 12,
    fontWeight: '500',
  },

  clearButton: {
    padding: 4,
    marginLeft: 8,
  },

  // === RÉSULTATS DE RECHERCHE ===
  searchResults: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    maxHeight: 300,
    overflow: 'hidden',
  },

  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  searchResultLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  searchResultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  searchResultInfo: {
    flex: 1,
  },

  searchResultSymbol: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },

  searchResultName: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },

  searchResultRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },

  searchResultPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },

  searchResultChangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  searchResultChange: {
    fontSize: 12,
    fontWeight: '600',
  },

  searchNoResults: {
    padding: 20,
    alignItems: 'center',
  },

  searchNoResultsText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // === CARTE PORTEFEUILLE ===
  portfolioCard: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  portfolioHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  portfolioTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  portfolioTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },

  trendIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  balanceContainer: {
    marginBottom: 20,
  },

  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  balanceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },

  balanceValue: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: -0.5,
  },

  balanceCurrency: {
    fontSize: 20,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
  },

  portfolioStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },

  statItem: {
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },

  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 4,
  },

  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
  },

  // === ACTIONS RAPIDES ===
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  actionCard: {
    flex: 1,
    minWidth: (screenWidth - 52) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
    textAlign: 'center',
  },

  actionSubtitle: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    textAlign: 'center',
  },

  // === SECTION ACTUALITÉS ===
  newsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },

  newsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  newsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // === ACTIONS HEADER ACTUALITÉS ===
  newsHeaderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  seeAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },

  // === INDICATEUR DE MISE À JOUR ===
  lastUpdateText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 12,
    textAlign: 'center',
  },

  // === CARROUSEL D'ACTUALITÉS ===
  newsCarousel: {
    flexDirection: 'row',
  },

  newsCard: {
    width: 280,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },

  newsImage: {
    width: '100%',
    height: 140,
    backgroundColor: '#f8fafc',
  },

  newsCardContent: {
    padding: 16,
  },

  newsCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  newsSource: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  newsTime: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  newsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 20,
    marginBottom: 8,
  },

  newsDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    fontWeight: '500',
  },

  // === ÉTATS DE CHARGEMENT ACTUALITÉS ===
  newsLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  newsLoadingText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  // === GESTION D'ERREURS ACTUALITÉS ===
  newsErrorContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#fecaca',
  },

  newsErrorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  newsErrorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 4,
    textAlign: 'center',
  },

  newsErrorMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },

  // === BOUTON DE RÉESSAI ===
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },

  retryButtonText: {
    fontSize: 14,
    color: '#ffffff',
    fontWeight: '600',
  },

  // === PLACEHOLDER ACTUALITÉS ===
  newsPlaceholder: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },

  newsPlaceholderIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  newsPlaceholderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },

  newsPlaceholderSubtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 16,
  },

  // === ESPACEMENT ===
  bottomSpacer: {
    height: 100,
  },
});