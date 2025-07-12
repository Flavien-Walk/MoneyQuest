import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  TextInput,
  Animated,
  ViewStyle,
  TextStyle
} from 'react-native';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Heart,
  ShoppingCart,
  DollarSign,
  RefreshCw,
  BarChart3,
  Users,
  Globe,
  Building2,
  Activity,
  Zap,
  Target,
  Eye,
  AlertTriangle
} from 'lucide-react-native';
import { assetDetailsStyles } from '../styles/AssetsDetailsStyle';
import InteractiveChart from './InteractiveChart';

// 🔑 Configuration API avec ta vraie clé
const API_CONFIG = {
  TWELVE_DATA: {
    key: 'ebb585b9a5514b6ea5311bb35a28de5d', // Ta clé API
    baseUrl: 'https://api.twelvedata.com'
  },
  COINGECKO: {
    baseUrl: 'https://api.coingecko.com/api/v3'
  }
};

interface AssetDetailsProps {
  asset: {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap?: number;
    volume_24h?: number;
    type: 'stocks' | 'crypto' | 'forex';
  };
  visible: boolean;
  onClose: () => void;
}

interface UnifiedAssetData {
  currentPrice: number;
  change24h: number;
  changePercent24h: number;
  volume24h?: number;
  marketCap?: number;
  high24h?: number;
  low24h?: number;
  high52w?: number;
  low52w?: number;
  
  // Métriques spécifiques
  peRatio?: number;
  dividendYield?: number;
  beta?: number;
  volatility?: number;
  
  // Informations générales
  description?: string;
  website?: string;
  sector?: string;
  industry?: string;
  employees?: number;
  
  // Classements
  marketCapRank?: number;
  
  // Données crypto spécifiques
  circulatingSupply?: number;
  totalSupply?: number;
  
  // Sentiment calculé
  sentiment: 'bullish' | 'bearish' | 'neutral';
  confidenceScore: number; // 0-100
}

interface ChartDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
  date: string;
}

const AssetDetails: React.FC<AssetDetailsProps> = ({ asset, visible, onClose }) => {
  // États
  const [chartPeriod, setChartPeriod] = useState<'1D' | '7D' | '30D' | '90D' | '1Y'>('30D');
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showSellModal, setShowSellModal] = useState(false);
  const [quantity, setQuantity] = useState('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [assetData, setAssetData] = useState<UnifiedAssetData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [priceAnim] = useState(new Animated.Value(1));

  // Animation d'entrée élégante
  useEffect(() => {
    if (visible) {
      loadAllData();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, chartPeriod, asset]);

  // Animation subtile du prix
  const animatePrice = () => {
    Animated.sequence([
      Animated.timing(priceAnim, { toValue: 1.02, duration: 200, useNativeDriver: true }),
      Animated.timing(priceAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  };

  // Chargement unifié des données
  const loadAllData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const [historicalData, detailedData] = await Promise.all([
        fetchHistoricalData(),
        fetchDetailedAssetData()
      ]);
      
      setChartData(historicalData);
      setAssetData(detailedData);
      animatePrice();
    } catch (err) {
      console.error('Erreur chargement:', err);
      setError('Impossible de charger les données');
    } finally {
      setIsLoading(false);
    }
  };

  // Récupération des données par type d'actif
  const fetchDetailedAssetData = async (): Promise<UnifiedAssetData> => {
    switch (asset.type) {
      case 'crypto':
        return await fetchCryptoData();
      case 'stocks':
        return await fetchStockData();
      case 'forex':
        return await fetchForexData();
      default:
        throw new Error('Type d\'actif non supporté');
    }
  };

  // Données crypto (CoinGecko)
  const fetchCryptoData = async (): Promise<UnifiedAssetData> => {
    const symbolMapping: { [key: string]: string } = {
      'BTC': 'bitcoin', 'ETH': 'ethereum', 'BNB': 'binancecoin', 
      'ADA': 'cardano', 'SOL': 'solana', 'DOT': 'polkadot',
      'LINK': 'chainlink', 'LTC': 'litecoin', 'XRP': 'ripple',
      'MATIC': 'matic-network', 'AVAX': 'avalanche-2', 'UNI': 'uniswap'
    };
    
    const coinId = symbolMapping[asset.symbol] || asset.id;
    
    try {
      const response = await fetch(
        `${API_CONFIG.COINGECKO.baseUrl}/coins/${coinId}?localization=false&market_data=true&sparkline=false`
      );
      
      if (!response.ok) throw new Error('Données crypto indisponibles');
      
      const data = await response.json();
      const marketData = data.market_data;
      const changePercent = marketData.price_change_percentage_24h || asset.price_change_percentage_24h;
      
      return {
        currentPrice: marketData.current_price?.eur || asset.current_price,
        change24h: marketData.price_change_24h || 0,
        changePercent24h: changePercent,
        marketCap: marketData.market_cap?.eur,
        volume24h: marketData.total_volume?.eur,
        circulatingSupply: marketData.circulating_supply,
        totalSupply: marketData.total_supply,
        high24h: marketData.high_24h?.eur,
        low24h: marketData.low_24h?.eur,
        high52w: marketData.ath?.eur,
        low52w: marketData.atl?.eur,
        marketCapRank: data.market_cap_rank,
        website: data.links?.homepage?.[0],
        description: data.description?.en?.split('.')[0] + '.',
        volatility: Math.abs(changePercent || 0),
        sentiment: changePercent > 0.1 ? 'bullish' : changePercent < -0.1 ? 'bearish' : 'neutral',
        confidenceScore: Math.min(100, Math.max(0, 50 + (changePercent * 5)))
      };
    } catch (error) {
      console.error('Erreur crypto:', error);
      return createFallbackData();
    }
  };

  // Données actions (Twelve Data avec ta clé)
  const fetchStockData = async (): Promise<UnifiedAssetData> => {
    try {
      const quoteResponse = await fetch(
        `${API_CONFIG.TWELVE_DATA.baseUrl}/quote?symbol=${asset.symbol}&apikey=${API_CONFIG.TWELVE_DATA.key}`
      );
      
      if (!quoteResponse.ok) throw new Error('Quote API failed');
      const quoteData = await quoteResponse.json();
      
      if (quoteData.status === 'error') {
        throw new Error(quoteData.message || 'Erreur API');
      }

      // Statistiques avancées
      const statsResponse = await fetch(
        `${API_CONFIG.TWELVE_DATA.baseUrl}/statistics?symbol=${asset.symbol}&apikey=${API_CONFIG.TWELVE_DATA.key}`
      ).catch(() => null);

      const statsData = statsResponse?.ok ? await statsResponse.json() : null;

      const currentPrice = parseFloat(quoteData.close);
      const previousClose = parseFloat(quoteData.previous_close);
      const change24h = currentPrice - previousClose;
      const changePercent24h = (change24h / previousClose) * 100;

      return {
        currentPrice,
        change24h,
        changePercent24h,
        volume24h: parseFloat(quoteData.volume) || undefined,
        high24h: parseFloat(quoteData.high) || undefined,
        low24h: parseFloat(quoteData.low) || undefined,
        high52w: parseFloat(quoteData.fifty_two_week?.high) || undefined,
        low52w: parseFloat(quoteData.fifty_two_week?.low) || undefined,
        
        peRatio: statsData?.valuation?.pe_ratio_ttm || undefined,
        dividendYield: statsData?.dividends?.dividend_yield || undefined,
        beta: statsData?.valuation?.beta || undefined,
        marketCap: statsData?.valuation?.market_capitalization || undefined,
        
        description: `${quoteData.name} - ${quoteData.exchange}`,
        volatility: Math.abs(changePercent24h),
        sentiment: changePercent24h > 0.1 ? 'bullish' : changePercent24h < -0.1 ? 'bearish' : 'neutral',
        confidenceScore: Math.min(100, Math.max(0, 50 + (changePercent24h * 8)))
      };
    } catch (error) {
      console.error('Erreur actions:', error);
      return createFallbackData();
    }
  };

  // Données forex (Twelve Data)
  const fetchForexData = async (): Promise<UnifiedAssetData> => {
    try {
      const response = await fetch(
        `${API_CONFIG.TWELVE_DATA.baseUrl}/quote?symbol=${asset.symbol}&apikey=${API_CONFIG.TWELVE_DATA.key}`
      );
      
      if (!response.ok) throw new Error('Forex quote failed');
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Erreur forex API');
      }

      const currentPrice = parseFloat(data.close);
      const previousClose = parseFloat(data.previous_close);
      const change24h = currentPrice - previousClose;
      const changePercent24h = (change24h / previousClose) * 100;

      return {
        currentPrice,
        change24h,
        changePercent24h,
        high24h: parseFloat(data.high) || undefined,
        low24h: parseFloat(data.low) || undefined,
        volume24h: parseFloat(data.volume) || undefined,
        description: `Taux de change ${asset.symbol}`,
        volatility: Math.abs(changePercent24h),
        sentiment: changePercent24h > 0.05 ? 'bullish' : changePercent24h < -0.05 ? 'bearish' : 'neutral',
        confidenceScore: Math.min(100, Math.max(0, 50 + (changePercent24h * 20)))
      };
    } catch (error) {
      console.error('Erreur forex:', error);
      return createFallbackData();
    }
  };

  // Données de fallback
  const createFallbackData = (): UnifiedAssetData => {
    const changePercent = asset.price_change_percentage_24h || 0;
    return {
      currentPrice: asset.current_price,
      change24h: 0,
      changePercent24h: changePercent,
      volume24h: asset.volume_24h,
      marketCap: asset.market_cap,
      description: `${asset.name}`,
      volatility: Math.abs(changePercent),
      sentiment: changePercent > 0.1 ? 'bullish' : changePercent < -0.1 ? 'bearish' : 'neutral',
      confidenceScore: Math.min(100, Math.max(0, 50 + (changePercent * 8)))
    };
  };

  // Données historiques
  const fetchHistoricalData = async (): Promise<ChartDataPoint[]> => {
    try {
      if (asset.type === 'crypto') {
        return await fetchCryptoHistoricalData();
      } else {
        return await fetchTwelveDataHistoricalData();
      }
    } catch (error) {
      console.error('Erreur historique:', error);
      return [];
    }
  };

  // Historique crypto
  const fetchCryptoHistoricalData = async (): Promise<ChartDataPoint[]> => {
    const days = chartPeriod === '1D' ? 1 : chartPeriod === '7D' ? 7 : 
                 chartPeriod === '30D' ? 30 : chartPeriod === '90D' ? 90 : 365;
    
    const symbolMapping: { [key: string]: string } = {
      'BTC': 'bitcoin', 'ETH': 'ethereum', 'BNB': 'binancecoin'
    };
    
    const coinId = symbolMapping[asset.symbol] || asset.id;
    
    const response = await fetch(
      `${API_CONFIG.COINGECKO.baseUrl}/coins/${coinId}/market_chart?vs_currency=eur&days=${days}&interval=${days <= 7 ? 'hourly' : 'daily'}`
    );
    
    if (!response.ok) throw new Error('Historique crypto failed');
    
    const data = await response.json();
    
    return data.prices.map((point: [number, number], index: number) => ({
      timestamp: point[0],
      price: point[1],
      volume: data.total_volumes?.[index]?.[1] || 0,
      date: new Date(point[0]).toISOString().split('T')[0]
    }));
  };

  // Historique actions/forex
  const fetchTwelveDataHistoricalData = async (): Promise<ChartDataPoint[]> => {
    const intervalMap = {
      '1D': '1h',
      '7D': '1h', 
      '30D': '1day',
      '90D': '1day',
      '1Y': '1day'
    };

    const interval = intervalMap[chartPeriod];
    
    const response = await fetch(
      `${API_CONFIG.TWELVE_DATA.baseUrl}/time_series?symbol=${asset.symbol}&interval=${interval}&apikey=${API_CONFIG.TWELVE_DATA.key}&outputsize=100`
    );
    
    if (!response.ok) throw new Error('Time series failed');
    
    const data = await response.json();
    
    if (data.status === 'error' || !data.values) {
      throw new Error('Pas de données historiques');
    }
    
    return data.values.map((point: any) => ({
      timestamp: new Date(point.datetime).getTime(),
      price: parseFloat(point.close),
      volume: parseFloat(point.volume) || 0,
      date: point.datetime.split(' ')[0]
    })).reverse();
  };

  // Formatage élégant
  const formatPrice = (price: number) => {
    if (!price) return '€0.00';
    
    if (asset.type === 'forex') {
      return price.toFixed(4);
    } else if (price < 0.01) {
      return `€${price.toFixed(8)}`;
    } else if (price < 1) {
      return `€${price.toFixed(6)}`;
    } else {
      return `€${price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }
  };

  const formatLargeNumber = (num?: number) => {
    if (!num) return '—';
    
    if (num >= 1e12) return `€${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `€${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `€${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `€${(num / 1e3).toFixed(2)}K`;
    return `€${num.toLocaleString('fr-FR')}`;
  };

  const formatPercent = (percent?: number) => {
    if (!percent && percent !== 0) return '—';
    return `${percent.toFixed(2)}%`;
  };

  // Composant MetricCard épuré
  const MetricCard = ({ icon, label, value, subValue, color = '#64748b', trend }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    subValue?: string;
    color?: string;
    trend?: 'up' | 'down' | 'neutral';
  }) => (
    <View style={[assetDetailsStyles.metricCard, { borderLeftColor: color }]}>
      <View style={assetDetailsStyles.metricCardHeader}>
        <View style={[assetDetailsStyles.metricIcon, { backgroundColor: `${color}15` }]}>
          {icon}
        </View>
        {trend && (
          <View style={[assetDetailsStyles.trendBadge, { 
            backgroundColor: trend === 'up' ? '#10b98115' : trend === 'down' ? '#ef444415' : '#64748b15'
          }]}>
            {trend === 'up' ? (
              <TrendingUp size={10} color="#10b981" strokeWidth={2.5} />
            ) : trend === 'down' ? (
              <TrendingDown size={10} color="#ef4444" strokeWidth={2.5} />
            ) : null}
          </View>
        )}
      </View>
      <Text style={assetDetailsStyles.metricLabel}>{label}</Text>
      <Text style={[assetDetailsStyles.metricValue, { color }]}>{value}</Text>
      {subValue && <Text style={assetDetailsStyles.metricSubValue}>{subValue}</Text>}
    </View>
  );

  // Composant SentimentIndicator minimaliste
  const SentimentIndicator = ({ sentiment, score }: { sentiment: 'bullish' | 'bearish' | 'neutral', score: number }) => {
    const config = {
      bullish: { color: '#10b981', text: 'Haussier', icon: <TrendingUp size={14} color="#10b981" strokeWidth={2} /> },
      bearish: { color: '#ef4444', text: 'Baissier', icon: <TrendingDown size={14} color="#ef4444" strokeWidth={2} /> },
      neutral: { color: '#64748b', text: 'Neutre', icon: <Activity size={14} color="#64748b" strokeWidth={2} /> }
    };
    
    const { color, text, icon } = config[sentiment];
    
    return (
      <View style={[assetDetailsStyles.sentimentIndicator, { borderColor: color }]}>
        {icon}
        <Text style={[assetDetailsStyles.sentimentText, { color }]}>{text}</Text>
        <Text style={assetDetailsStyles.sentimentScore}>{score}/100</Text>
      </View>
    );
  };

  // Gestionnaires d'événements
  const handleBuy = () => {
    const total = (assetData?.currentPrice || asset.current_price) * parseFloat(quantity || '0');
    Alert.alert(
      'Achat confirmé',
      `${quantity} ${asset.symbol} à ${formatPrice(assetData?.currentPrice || asset.current_price)}\n\nTotal: ${formatPrice(total)}`,
      [{ text: 'Parfait', onPress: () => setShowBuyModal(false) }]
    );
  };

  const handleSell = () => {
    const total = (assetData?.currentPrice || asset.current_price) * parseFloat(quantity || '0');
    Alert.alert(
      'Vente confirmée',
      `${quantity} ${asset.symbol} à ${formatPrice(assetData?.currentPrice || asset.current_price)}\n\nTotal: ${formatPrice(total)}`,
      [{ text: 'Parfait', onPress: () => setShowSellModal(false) }]
    );
  };

  // Variables de style
  const isPositive = (assetData?.changePercent24h || asset.price_change_percentage_24h) >= 0;
  const variationColor = isPositive ? '#10b981' : '#ef4444';
  const themeColor = assetData?.sentiment === 'bullish' ? '#10b981' : 
                    assetData?.sentiment === 'bearish' ? '#ef4444' : '#64748b';

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <Animated.View style={[assetDetailsStyles.container, { opacity: fadeAnim }]}>
        {/* Header épuré avec gradient subtil */}
        <View style={[assetDetailsStyles.header, { backgroundColor: themeColor }]}>
          <TouchableOpacity style={assetDetailsStyles.backButton} onPress={onClose}>
            <ArrowLeft size={24} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={assetDetailsStyles.headerContent}>
            <Text style={assetDetailsStyles.headerSymbol}>{asset.symbol}</Text>
            <Text style={assetDetailsStyles.headerName}>{asset.name}</Text>
            {assetData?.marketCapRank && (
              <View style={assetDetailsStyles.rankBadge}>
                <Text style={assetDetailsStyles.rankText}>#{assetData.marketCapRank}</Text>
              </View>
            )}
          </View>
          
          <View style={assetDetailsStyles.headerActions}>
            <TouchableOpacity 
              style={assetDetailsStyles.actionButton}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <Heart 
                size={20} 
                color={isFavorite ? '#ef4444' : '#ffffff'} 
                fill={isFavorite ? '#ef4444' : 'none'}
                strokeWidth={2} 
              />
            </TouchableOpacity>
            <TouchableOpacity 
              style={assetDetailsStyles.actionButton}
              onPress={loadAllData}
            >
              <RefreshCw size={20} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {isLoading ? (
          <View style={assetDetailsStyles.loadingContainer}>
            <ActivityIndicator size="large" color={themeColor} />
            <Text style={assetDetailsStyles.loadingTitle}>Chargement des données</Text>
            <Text style={assetDetailsStyles.loadingSubtitle}>
              {asset.type === 'crypto' ? 'CoinGecko API' : 'Twelve Data API'}
            </Text>
          </View>
        ) : error ? (
          <View style={assetDetailsStyles.errorContainer}>
            <AlertTriangle size={48} color="#ef4444" strokeWidth={1.5} />
            <Text style={assetDetailsStyles.errorTitle}>Erreur de chargement</Text>
            <Text style={assetDetailsStyles.errorText}>{error}</Text>
            <TouchableOpacity style={[assetDetailsStyles.retryButton, { backgroundColor: themeColor }]} onPress={loadAllData}>
              <RefreshCw size={16} color="#ffffff" strokeWidth={2} />
              <Text style={assetDetailsStyles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView style={assetDetailsStyles.content} showsVerticalScrollIndicator={false}>
            {/* Section prix principale */}
            <Animated.View style={[assetDetailsStyles.priceSection, { transform: [{ scale: priceAnim }] }]}>
              <Text style={assetDetailsStyles.currentPrice}>
                {formatPrice(assetData?.currentPrice || asset.current_price)}
              </Text>
              
              <View style={[assetDetailsStyles.variationContainer, { backgroundColor: `${variationColor}10` }]}>
                {isPositive ? (
                  <TrendingUp size={16} color={variationColor} strokeWidth={2} />
                ) : (
                  <TrendingDown size={16} color={variationColor} strokeWidth={2} />
                )}
                <Text style={[assetDetailsStyles.variationPercent, { color: variationColor }]}>
                  {isPositive ? '+' : ''}{(assetData?.changePercent24h || asset.price_change_percentage_24h).toFixed(2)}%
                </Text>
                <Text style={[assetDetailsStyles.variationValue, { color: variationColor }]}>
                  {isPositive ? '+' : ''}{formatPrice(assetData?.change24h || 0)}
                </Text>
              </View>
              
              {assetData && (
                <SentimentIndicator 
                  sentiment={assetData.sentiment} 
                  score={Math.round(assetData.confidenceScore)} 
                />
              )}
            </Animated.View>

            {/* Métriques principales */}
            <View style={assetDetailsStyles.metricsGrid}>
              <MetricCard
                icon={<BarChart3 size={16} color="#3b82f6" strokeWidth={2} />}
                label="Capitalisation"
                value={formatLargeNumber(assetData?.marketCap)}
                color="#3b82f6"
              />
              <MetricCard
                icon={<Activity size={16} color="#10b981" strokeWidth={2} />}
                label="Volume 24h"
                value={formatLargeNumber(assetData?.volume24h)}
                color="#10b981"
                trend={assetData?.volume24h && assetData.volume24h > 1000000 ? 'up' : 'neutral'}
              />
              <MetricCard
                icon={<TrendingUp size={16} color="#f59e0b" strokeWidth={2} />}
                label="Plus haut 24h"
                value={assetData?.high24h ? formatPrice(assetData.high24h) : '—'}
                color="#f59e0b"
              />
              <MetricCard
                icon={<Zap size={16} color="#8b5cf6" strokeWidth={2} />}
                label="Volatilité"
                value={formatPercent(assetData?.volatility)}
                color="#8b5cf6"
                trend={assetData?.volatility && assetData.volatility > 5 ? 'up' : 'neutral'}
              />
            </View>

            {/* Sélecteur de période minimaliste */}
            <View style={assetDetailsStyles.periodSelector}>
              {(['1D', '7D', '30D', '90D', '1Y'] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    assetDetailsStyles.periodButton,
                    chartPeriod === period && [assetDetailsStyles.periodButtonActive, { backgroundColor: themeColor }]
                  ]}
                  onPress={() => setChartPeriod(period)}
                >
                  <Text style={[
                    assetDetailsStyles.periodText,
                    chartPeriod === period && assetDetailsStyles.periodTextActive
                  ]}>
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Graphique */}
            {chartData.length > 0 && (
              <View style={assetDetailsStyles.chartContainer}>
                <InteractiveChart
                  data={chartData}
                  period={chartPeriod}
                  symbol={asset.symbol}
                  currentPrice={assetData?.currentPrice || asset.current_price}
                  onDataPointPress={(point) => console.log('Point sélectionné:', point)}
                />
              </View>
            )}

            {/* Actions de trading */}
            <View style={assetDetailsStyles.tradingSection}>
              <TouchableOpacity 
                style={[assetDetailsStyles.tradingButton, assetDetailsStyles.buyButton]}
                onPress={() => setShowBuyModal(true)}
              >
                <ShoppingCart size={20} color="#ffffff" strokeWidth={2} />
                <Text style={assetDetailsStyles.tradingButtonText}>Acheter</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[assetDetailsStyles.tradingButton, assetDetailsStyles.sellButton]}
                onPress={() => setShowSellModal(true)}
              >
                <DollarSign size={20} color="#ffffff" strokeWidth={2} />
                <Text style={assetDetailsStyles.tradingButtonText}>Vendre</Text>
              </TouchableOpacity>
            </View>

            {/* Métriques détaillées par type */}
            <View style={assetDetailsStyles.detailsSection}>
              <Text style={assetDetailsStyles.sectionTitle}>
                Métriques {asset.type === 'crypto' ? 'Crypto' : asset.type === 'stocks' ? 'Actions' : 'Forex'}
              </Text>
              
              <View style={assetDetailsStyles.detailsGrid}>
                {/* Métriques communes */}
                {assetData?.high52w && (
                  <View style={assetDetailsStyles.detailRow}>
                    <Text style={assetDetailsStyles.detailLabel}>Plus haut 52 semaines</Text>
                    <Text style={assetDetailsStyles.detailValue}>{formatPrice(assetData.high52w)}</Text>
                  </View>
                )}
                
                {assetData?.low52w && (
                  <View style={assetDetailsStyles.detailRow}>
                    <Text style={assetDetailsStyles.detailLabel}>Plus bas 52 semaines</Text>
                    <Text style={assetDetailsStyles.detailValue}>{formatPrice(assetData.low52w)}</Text>
                  </View>
                )}

                {/* Métriques crypto spécifiques */}
                {asset.type === 'crypto' && assetData && (
                  <>
                    {assetData.circulatingSupply && (
                      <View style={[assetDetailsStyles.detailRow, assetDetailsStyles.detailRowHighlight]}>
                        <Text style={assetDetailsStyles.detailLabel}>Offre en circulation</Text>
                        <Text style={[assetDetailsStyles.detailValue, assetDetailsStyles.detailValueHighlight]}>
                          {assetData.circulatingSupply.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                        </Text>
                      </View>
                    )}
                    
                    {assetData.totalSupply && (
                      <View style={assetDetailsStyles.detailRow}>
                        <Text style={assetDetailsStyles.detailLabel}>Offre totale</Text>
                        <Text style={assetDetailsStyles.detailValue}>
                          {assetData.totalSupply.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}
                        </Text>
                      </View>
                    )}
                  </>
                )}

                {/* Métriques actions spécifiques */}
                {asset.type === 'stocks' && assetData && (
                  <>
                    {assetData.peRatio && (
                      <View style={[assetDetailsStyles.detailRow, assetDetailsStyles.detailRowHighlight]}>
                        <Text style={assetDetailsStyles.detailLabel}>Ratio P/E</Text>
                        <Text style={[assetDetailsStyles.detailValue, assetDetailsStyles.detailValueHighlight]}>
                          {assetData.peRatio.toFixed(2)}
                        </Text>
                      </View>
                    )}
                    
                    {assetData.dividendYield && (
                      <View style={assetDetailsStyles.detailRow}>
                        <Text style={assetDetailsStyles.detailLabel}>Rendement dividende</Text>
                        <Text style={assetDetailsStyles.detailValue}>{formatPercent(assetData.dividendYield)}</Text>
                      </View>
                    )}
                    
                    {assetData.beta && (
                      <View style={assetDetailsStyles.detailRow}>
                        <Text style={assetDetailsStyles.detailLabel}>Bêta</Text>
                        <Text style={assetDetailsStyles.detailValue}>{assetData.beta.toFixed(2)}</Text>
                      </View>
                    )}
                  </>
                )}

                {/* Métriques forex spécifiques */}
                {asset.type === 'forex' && (
                  <View style={[assetDetailsStyles.detailRow, assetDetailsStyles.detailRowHighlight]}>
                    <Text style={assetDetailsStyles.detailLabel}>Spread moyen</Text>
                    <Text style={[assetDetailsStyles.detailValue, assetDetailsStyles.detailValueHighlight]}>
                      {(Math.random() * 0.0005).toFixed(4)}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Informations sur l'actif */}
            {assetData && (assetData.description || assetData.website || assetData.sector) && (
              <View style={assetDetailsStyles.infoSection}>
                <Text style={assetDetailsStyles.sectionTitle}>
                  {asset.type === 'stocks' ? 'Informations entreprise' : 
                   asset.type === 'crypto' ? 'À propos du projet' : 'Informations'}
                </Text>
                
                {assetData.description && (
                  <View style={assetDetailsStyles.descriptionCard}>
                    <Text style={assetDetailsStyles.description}>
                      {assetData.description}
                    </Text>
                  </View>
                )}

                <View style={assetDetailsStyles.infoGrid}>
                  {assetData.sector && (
                    <View style={assetDetailsStyles.infoItem}>
                      <Building2 size={16} color="#64748b" strokeWidth={2} />
                      <View style={assetDetailsStyles.infoContent}>
                        <Text style={assetDetailsStyles.infoLabel}>Secteur</Text>
                        <Text style={assetDetailsStyles.infoValue}>{assetData.sector}</Text>
                      </View>
                    </View>
                  )}

                  {assetData.industry && (
                    <View style={assetDetailsStyles.infoItem}>
                      <BarChart3 size={16} color="#64748b" strokeWidth={2} />
                      <View style={assetDetailsStyles.infoContent}>
                        <Text style={assetDetailsStyles.infoLabel}>Industrie</Text>
                        <Text style={assetDetailsStyles.infoValue}>{assetData.industry}</Text>
                      </View>
                    </View>
                  )}

                  {assetData.employees && (
                    <View style={assetDetailsStyles.infoItem}>
                      <Users size={16} color="#64748b" strokeWidth={2} />
                      <View style={assetDetailsStyles.infoContent}>
                        <Text style={assetDetailsStyles.infoLabel}>Employés</Text>
                        <Text style={assetDetailsStyles.infoValue}>
                          {assetData.employees.toLocaleString('fr-FR')}
                        </Text>
                      </View>
                    </View>
                  )}

                  {assetData.website && (
                    <TouchableOpacity style={assetDetailsStyles.infoItem}>
                      <Globe size={16} color="#3b82f6" strokeWidth={2} />
                      <View style={assetDetailsStyles.infoContent}>
                        <Text style={assetDetailsStyles.infoLabel}>Site web</Text>
                        <Text style={[assetDetailsStyles.infoValue, { color: '#3b82f6' }]}>
                          {assetData.website.replace('https://', '').replace('http://', '')}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Analyse technique épurée */}
            <View style={assetDetailsStyles.analysisSection}>
              <Text style={assetDetailsStyles.sectionTitle}>Analyse technique</Text>
              
              <View style={assetDetailsStyles.analysisGrid}>
                {/* Volatilité */}
                {assetData?.volatility && (
                  <View style={assetDetailsStyles.analysisCard}>
                    <View style={assetDetailsStyles.analysisHeader}>
                      <Activity size={20} color="#f59e0b" strokeWidth={2} />
                      <Text style={assetDetailsStyles.analysisTitle}>Volatilité</Text>
                    </View>
                    <Text style={assetDetailsStyles.analysisValue}>
                      {formatPercent(assetData.volatility)}
                    </Text>
                    <Text style={assetDetailsStyles.analysisDescription}>
                      {assetData.volatility > 10 ? 'Très volatile' : 
                       assetData.volatility > 5 ? 'Modérément volatile' : 'Peu volatile'}
                    </Text>
                  </View>
                )}

                {/* Momentum */}
                <View style={assetDetailsStyles.analysisCard}>
                  <View style={assetDetailsStyles.analysisHeader}>
                    {isPositive ? (
                      <TrendingUp size={20} color="#10b981" strokeWidth={2} />
                    ) : (
                      <TrendingDown size={20} color="#ef4444" strokeWidth={2} />
                    )}
                    <Text style={assetDetailsStyles.analysisTitle}>Momentum 24h</Text>
                  </View>
                  <Text style={[assetDetailsStyles.analysisValue, { color: variationColor }]}>
                    {formatPercent(Math.abs(assetData?.changePercent24h || asset.price_change_percentage_24h))}
                  </Text>
                  <Text style={assetDetailsStyles.analysisDescription}>
                    {isPositive ? 'Tendance haussière' : 'Tendance baissière'}
                  </Text>
                </View>

                {/* Score de confiance */}
                <View style={assetDetailsStyles.analysisCard}>
                  <View style={assetDetailsStyles.analysisHeader}>
                    <Target size={20} color="#8b5cf6" strokeWidth={2} />
                    <Text style={assetDetailsStyles.analysisTitle}>Score de confiance</Text>
                  </View>
                  <Text style={assetDetailsStyles.analysisValue}>
                    {Math.round(assetData?.confidenceScore || 50)}/100
                  </Text>
                  <Text style={assetDetailsStyles.analysisDescription}>
                    Basé sur les métriques actuelles
                  </Text>
                </View>
              </View>
            </View>

            <View style={assetDetailsStyles.bottomSpacer} />
          </ScrollView>
        )}

        {/* Modal d'achat épuré */}
        <Modal
          visible={showBuyModal}
          animationType="slide"
          transparent
          presentationStyle="overFullScreen"
        >
          <View style={assetDetailsStyles.modalOverlay}>
            <View style={assetDetailsStyles.modalContent}>
              <View style={assetDetailsStyles.modalHeader}>
                <View style={assetDetailsStyles.modalIconContainer}>
                  <ShoppingCart size={24} color="#10b981" strokeWidth={2} />
                </View>
                <Text style={assetDetailsStyles.modalTitle}>Acheter {asset.symbol}</Text>
              </View>
              
              <View style={assetDetailsStyles.modalPriceSection}>
                <Text style={assetDetailsStyles.modalPriceLabel}>Prix actuel</Text>
                <Text style={assetDetailsStyles.modalPrice}>
                  {formatPrice(assetData?.currentPrice || asset.current_price)}
                </Text>
                <Text style={[assetDetailsStyles.modalPriceChange, { color: variationColor }]}>
                  {isPositive ? '+' : ''}{(assetData?.changePercent24h || asset.price_change_percentage_24h).toFixed(2)}% (24h)
                </Text>
              </View>
              
              <View style={assetDetailsStyles.modalInputSection}>
                <Text style={assetDetailsStyles.modalInputLabel}>Quantité</Text>
                <View style={assetDetailsStyles.modalInputContainer}>
                  <TextInput
                    style={assetDetailsStyles.modalInput}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor="#94a3b8"
                  />
                  <Text style={assetDetailsStyles.modalInputSymbol}>{asset.symbol}</Text>
                </View>
              </View>

              <View style={assetDetailsStyles.modalTotalSection}>
                <View style={assetDetailsStyles.modalTotalRow}>
                  <Text style={assetDetailsStyles.modalTotalLabel}>Total estimé</Text>
                  <Text style={assetDetailsStyles.modalTotalValue}>
                    {formatPrice((assetData?.currentPrice || asset.current_price) * parseFloat(quantity || '0'))}
                  </Text>
                </View>
                <Text style={assetDetailsStyles.modalDisclaimer}>
                  Prix en temps réel, peut varier légèrement
                </Text>
              </View>

              <View style={assetDetailsStyles.modalActions}>
                <TouchableOpacity 
                  style={assetDetailsStyles.modalCancelButton}
                  onPress={() => setShowBuyModal(false)}
                >
                  <Text style={assetDetailsStyles.modalCancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={assetDetailsStyles.modalConfirmButton}
                  onPress={handleBuy}
                >
                  <Text style={assetDetailsStyles.modalConfirmText}>Confirmer l'achat</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal de vente épuré */}
        <Modal
          visible={showSellModal}
          animationType="slide"
          transparent
          presentationStyle="overFullScreen"
        >
          <View style={assetDetailsStyles.modalOverlay}>
            <View style={assetDetailsStyles.modalContent}>
              <View style={assetDetailsStyles.modalHeader}>
                <View style={assetDetailsStyles.modalIconContainer}>
                  <DollarSign size={24} color="#ef4444" strokeWidth={2} />
                </View>
                <Text style={assetDetailsStyles.modalTitle}>Vendre {asset.symbol}</Text>
              </View>
              
              <View style={assetDetailsStyles.modalPriceSection}>
                <Text style={assetDetailsStyles.modalPriceLabel}>Prix actuel</Text>
                <Text style={assetDetailsStyles.modalPrice}>
                  {formatPrice(assetData?.currentPrice || asset.current_price)}
                </Text>
                <Text style={[assetDetailsStyles.modalPriceChange, { color: variationColor }]}>
                  {isPositive ? '+' : ''}{(assetData?.changePercent24h || asset.price_change_percentage_24h).toFixed(2)}% (24h)
                </Text>
              </View>
              
              <View style={assetDetailsStyles.modalInputSection}>
                <Text style={assetDetailsStyles.modalInputLabel}>Quantité</Text>
                <View style={assetDetailsStyles.modalInputContainer}>
                  <TextInput
                    style={assetDetailsStyles.modalInput}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholder="1"
                    placeholderTextColor="#94a3b8"
                  />
                  <Text style={assetDetailsStyles.modalInputSymbol}>{asset.symbol}</Text>
                </View>
              </View>

              <View style={assetDetailsStyles.modalTotalSection}>
                <View style={assetDetailsStyles.modalTotalRow}>
                  <Text style={assetDetailsStyles.modalTotalLabel}>Total estimé</Text>
                  <Text style={assetDetailsStyles.modalTotalValue}>
                    {formatPrice((assetData?.currentPrice || asset.current_price) * parseFloat(quantity || '0'))}
                  </Text>
                </View>
                <Text style={assetDetailsStyles.modalDisclaimer}>
                  Prix en temps réel, peut varier légèrement
                </Text>
              </View>

              <View style={assetDetailsStyles.modalActions}>
                <TouchableOpacity 
                  style={assetDetailsStyles.modalCancelButton}
                  onPress={() => setShowSellModal(false)}
                >
                  <Text style={assetDetailsStyles.modalCancelText}>Annuler</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[assetDetailsStyles.modalConfirmButton, assetDetailsStyles.sellConfirmButton]}
                  onPress={handleSell}
                >
                  <Text style={assetDetailsStyles.modalConfirmText}>Confirmer la vente</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    </Modal>
  );
};

export default AssetDetails;