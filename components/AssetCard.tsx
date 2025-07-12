import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface AssetCardProps {
  name: string;
  symbol: string;
  price: number;
  variation24h: number;
  type: 'stocks' | 'crypto' | 'etf' | 'forex';
  onPress?: () => void;
}

/**
 * Composant AssetCard - Affiche les informations d'un actif financier
 * Design moderne avec indicateurs visuels de performance
 */
const AssetCard: React.FC<AssetCardProps> = ({
  name,
  symbol,
  price,
  variation24h,
  type,
  onPress
}) => {
  const isPositive = variation24h >= 0;
  const variationColor = isPositive ? '#10b981' : '#ef4444';
  const variationBgColor = isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)';
  
  const formatPrice = (price: number) => {
    if (price < 1) {
      return `€${price.toFixed(6)}`;
    } else if (price < 100) {
      return `€${price.toFixed(2)}`;
    } else {
      return `€${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;
    }
  };

  const formatVariation = (variation: number) => {
    const sign = variation >= 0 ? '+' : '';
    return `${sign}${variation.toFixed(2)}%`;
  };

  const getTypeColor = () => {
    switch (type) {
      case 'stocks': return '#3b82f6';
      case 'crypto': return '#fbbf24';
      case 'etf': return '#10b981';
      case 'forex': return '#8b5cf6';
      default: return '#64748b';
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {/* En-tête avec logo et symbole */}
      <View style={styles.header}>
        <View style={[styles.logoContainer, { backgroundColor: `${getTypeColor()}15` }]}>
          <Text style={[styles.logoText, { color: getTypeColor() }]}>
            {symbol.substring(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={[styles.typeIndicator, { backgroundColor: variationBgColor }]}>
          {isPositive ? (
            <TrendingUp size={12} color={variationColor} strokeWidth={2.5} />
          ) : (
            <TrendingDown size={12} color={variationColor} strokeWidth={2.5} />
          )}
        </View>
      </View>

      {/* Informations principales */}
      <View style={styles.content}>
        <Text style={styles.symbol} numberOfLines={1}>
          {symbol.toUpperCase()}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {name}
        </Text>
      </View>

      {/* Prix et variation */}
      <View style={styles.priceSection}>
        <Text style={styles.price} numberOfLines={1}>
          {formatPrice(price)}
        </Text>
        <View style={[styles.variationContainer, { backgroundColor: variationBgColor }]}>
          <Text style={[styles.variation, { color: variationColor }]}>
            {formatVariation(variation24h)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginRight: 16,
    width: 160,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  typeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginBottom: 16,
    minHeight: 48,
  },
  symbol: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  name: {
    fontSize: 12,
    color: '#64748b',
    lineHeight: 16,
    fontWeight: '500',
  },
  priceSection: {
    gap: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  variationContainer: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  variation: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});

export default AssetCard;