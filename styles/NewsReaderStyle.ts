import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const newsReaderStyles = StyleSheet.create({
  // === CONTENEUR PRINCIPAL ===
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  // === HEADER ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
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

  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // === CONTENU ===
  content: {
    flex: 1,
  },

  // === IMAGE PRINCIPALE ===
  imageContainer: {
    position: 'relative',
    height: 240,
    backgroundColor: '#f8fafc',
  },

  mainImage: {
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
    justifyContent: 'flex-end',
    padding: 20,
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
  },

  // === CONTENU ARTICLE ===
  articleContent: {
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1e293b',
    lineHeight: 32,
    marginBottom: 16,
  },

  // === MÉTADONNÉES ===
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },

  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  metadataText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },

  // === DESCRIPTION ET CONTENU ===
  description: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 24,
  },

  contentSection: {
    marginBottom: 32,
  },

  contentText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    fontWeight: '400',
    marginBottom: 20,
  },

  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f9ff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    gap: 8,
  },

  readMoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },

  // === ATTRIBUTION ===
  attribution: {
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },

  attributionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },

  attributionSubtext: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  // === ESPACEMENT ===
  bottomSpacer: {
    height: 40,
  },
});