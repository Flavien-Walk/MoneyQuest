import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const newsListStyles = StyleSheet.create({
  // === CONTENEUR PRINCIPAL ===
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },

  headerSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },

  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },

  refreshing: {
    transform: [{ rotate: '360deg' }],
  },

  // === CONTENU ===
  content: {
    flex: 1,
  },

  articlesList: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  // === CARTE ARTICLE ===
  articleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },

  lastArticleCard: {
    marginBottom: 40,
  },

  // === IMAGE DE L'ARTICLE ===
  articleImageContainer: {
    position: 'relative',
    height: 200,
    backgroundColor: '#f8fafc',
  },

  articleImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 16,
  },

  sourceBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },

  sourceText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e293b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  // === CONTENU DE L'ARTICLE ===
  articleContent: {
    padding: 20,
  },

  articleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sourceOnly: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  timeText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  articleTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    lineHeight: 24,
    marginBottom: 12,
  },

  articleDescription: {
    fontSize: 15,
    color: '#64748b',
    lineHeight: 22,
    fontWeight: '500',
    marginBottom: 16,
  },

  // === FOOTER DE L'ARTICLE ===
  articleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },

  fullDate: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
    flex: 1,
  },

  readMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  readMoreText: {
    fontSize: 13,
    color: '#3b82f6',
    fontWeight: '600',
  },

  // === ÉTAT VIDE ===
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 8,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    fontWeight: '500',
  },

  // === ESPACEMENT ===
  bottomSpacer: {
    height: 40,
  },
});