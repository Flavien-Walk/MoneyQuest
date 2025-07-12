import { StyleSheet } from 'react-native';

/**
 * Styles pour le composant InteractiveChart
 * Graphique interactif avec bougies japonaises et zoom
 */
export const interactiveChartStyles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },

  // Header avec contrôles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  currentPrice: {
    flex: 1,
  },
  currentPriceLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  currentPriceValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.3,
  },
  controls: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  controlButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },

  // Zone de graphique
  chartWrapper: {
    backgroundColor: '#fafbfc',
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  chartArea: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },

  // Grille
  gridLine: {
    position: 'absolute',
    backgroundColor: '#f1f5f9',
  },

  // Graphique linéaire
  priceLine: {
    position: 'relative',
  },
  priceSegment: {
    borderRadius: 1,
  },
  dataPoint: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#3b82f6',
  },

  // Bougies japonaises
  candleBody: {
    position: 'absolute',
    borderRadius: 1,
  },
  candleWick: {
    position: 'absolute',
    backgroundColor: '#64748b',
  },

  // Labels de prix
  priceLabels: {
    position: 'absolute',
    right: 4,
    top: 8,
    bottom: 8,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  priceLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '600',
    backgroundColor: '#ffffff',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  // Labels de temps
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 8,
  },
  timeLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },

  // Crosshair et tooltip
  crosshair: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  crosshairLine: {
    position: 'absolute',
    backgroundColor: '#3b82f6',
    opacity: 0.6,
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: '#0f172a',
    borderRadius: 8,
    padding: 8,
    minWidth: 120,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  tooltipTime: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  tooltipPrice: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 2,
  },

  // Informations en temps réel
  liveInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    marginTop: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  liveText: {
    fontSize: 10,
    color: '#10b981',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  periodText: {
    fontSize: 11,
    color: '#64748b',
    fontWeight: '500',
  },
});