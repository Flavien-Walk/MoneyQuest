import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

export const assetDetailsStyles = StyleSheet.create({
  // === CONTENEUR PRINCIPAL ===
  container: {
    flex: 1,
    backgroundColor: '#fafbfc',
  },

  // === HEADER ÉPURÉ ===
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: '#1a202c',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerContent: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 20,
  },

  headerSymbol: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },

  headerName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    fontWeight: '500',
  },

  rankBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },

  rankText: {
    fontSize: 11,
    color: '#f59e0b',
    fontWeight: '600',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // === CONTENU PRINCIPAL ===
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // === SECTION PRIX ===
  priceSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  currentPrice: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1a202c',
    marginBottom: 16,
    letterSpacing: -0.5,
  },

  variationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    gap: 8,
    marginBottom: 12,
  },

  variationPercent: {
    fontSize: 16,
    fontWeight: '700',
  },

  variationValue: {
    fontSize: 14,
    fontWeight: '600',
    opacity: 0.8,
  },

  // === INDICATEUR DE SENTIMENT ===
  sentimentIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    gap: 6,
  },

  sentimentText: {
    fontSize: 13,
    fontWeight: '600',
  },

  sentimentScore: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },

  // === MÉTRIQUES GRID ===
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 24,
  },

  metricCard: {
    flex: 1,
    minWidth: (screenWidth - 52) / 2,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  metricCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  metricIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trendBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  metricLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },

  metricSubValue: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },

  // === SÉLECTEUR DE PÉRIODE ===
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 4,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },

  periodButtonActive: {
    backgroundColor: '#3b82f6',
  },

  periodText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
  },

  periodTextActive: {
    color: '#ffffff',
  },

  // === GRAPHIQUE ===
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginTop: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  // === SECTION TRADING ===
  tradingSection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },

  tradingButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },

  buyButton: {
    backgroundColor: '#10b981',
  },

  sellButton: {
    backgroundColor: '#ef4444',
  },

  tradingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // === SECTION DÉTAILS ===
  detailsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 16,
  },

  detailsGrid: {
    gap: 1,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f8fafc',
    marginBottom: 1,
    borderRadius: 8,
  },

  detailRowHighlight: {
    backgroundColor: '#f0f9ff',
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },

  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },

  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a202c',
  },

  detailValueHighlight: {
    color: '#3b82f6',
    fontWeight: '700',
  },

  // === SECTION INFORMATIONS ===
  infoSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  descriptionCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },

  description: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    fontWeight: '500',
  },

  infoGrid: {
    gap: 12,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    gap: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  infoValue: {
    fontSize: 14,
    color: '#1a202c',
    fontWeight: '600',
  },

  // === SECTION ANALYSE ===
  analysisSection: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },

  analysisGrid: {
    gap: 12,
  },

  analysisCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  analysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },

  analysisTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    flex: 1,
  },

  analysisValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },

  analysisDescription: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },

  // === ÉTATS DE CHARGEMENT ===
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },

  loadingTitle: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    textAlign: 'center',
  },

  loadingSubtitle: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
    textAlign: 'center',
  },

  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    paddingHorizontal: 40,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ef4444',
    textAlign: 'center',
  },

  errorText: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '500',
  },

  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },

  retryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },

  // === MODALS ÉPURÉS ===
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },

  modalIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a202c',
    flex: 1,
  },

  modalPriceSection: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  modalPriceLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  modalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: 4,
  },

  modalPriceChange: {
    fontSize: 14,
    fontWeight: '600',
  },

  modalInputSection: {
    marginBottom: 24,
  },

  modalInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },

  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
  },

  modalInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
    paddingVertical: 16,
  },

  modalInputSymbol: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginLeft: 8,
  },

  modalTotalSection: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },

  modalTotalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  modalTotalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },

  modalTotalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#15803d',
  },

  modalDisclaimer: {
    fontSize: 11,
    color: '#65a30d',
    fontStyle: 'italic',
    fontWeight: '500',
  },

  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },

  modalCancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  modalCancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748b',
  },

  modalConfirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },

  sellConfirmButton: {
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
  },

  modalConfirmText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },

  // === ESPACEMENT ===
  bottomSpacer: {
    height: 40,
  },
});