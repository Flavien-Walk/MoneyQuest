import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  FlatList, 
  ActivityIndicator,
  Modal,
  Animated,
  RefreshControl
} from 'react-native';
import { 
  TrendingUp, 
  HelpCircle, 
  BarChart3, 
  Bitcoin, 
  DollarSign,
  ChevronRight,
  Rocket,
  ArrowRight,
  RefreshCw,
  AlertCircle
} from 'lucide-react-native';
import { marketStyles } from '../styles/MarketStyle';
import AssetCard from './AssetCard';
import AssetDetails from './AssetsDetails';
import ViewAllAssets from './ViewAllAssets';

// === CONFIGURATION API RÉELLES ===
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h';
const YAHOO_FINANCE_API = 'https://query1.finance.yahoo.com/v8/finance/chart';
const EXCHANGE_RATE_API_BASE = 'https://api.exchangerate-api.com/v4/latest';

// Actions populaires à récupérer
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' }
];

// Paires de devises
const FOREX_PAIRS = [
  { from: 'EUR', to: 'USD', name: 'Euro / US Dollar' },
  { from: 'GBP', to: 'USD', name: 'British Pound / US Dollar' },
  { from: 'USD', to: 'JPY', name: 'US Dollar / Japanese Yen' },
  { from: 'USD', to: 'CHF', name: 'US Dollar / Swiss Franc' },
  { from: 'AUD', to: 'USD', name: 'Australian Dollar / US Dollar' }
];

interface AssetData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  volume_24h?: number;
  type: 'stocks' | 'crypto' | 'forex';
}

interface MarketCategory {
  title: string;
  icon: React.ReactNode;
  iconStyle: string;
  data: AssetData[];
  type: 'stocks' | 'crypto' | 'forex';
  isLoading: boolean;
  error: string | null;
}

const Market: React.FC = () => {
  // États principaux
  const [showTutorial, setShowTutorial] = useState(false);
  const [cryptoData, setCryptoData] = useState<AssetData[]>([]);
  const [stocksData, setStocksData] = useState<AssetData[]>([]);
  const [forexData, setForexData] = useState<AssetData[]>([]);
  
  // États de chargement
  const [isLoadingCrypto, setIsLoadingCrypto] = useState(true);
  const [isLoadingStocks, setIsLoadingStocks] = useState(true);
  const [isLoadingForex, setIsLoadingForex] = useState(true);
  
  // États d'erreur
  const [cryptoError, setCryptoError] = useState<string | null>(null);
  const [stocksError, setStocksError] = useState<string | null>(null);
  const [forexError, setForexError] = useState<string | null>(null);
  
  // États UI
  const [tutorialOpacity] = useState(new Animated.Value(0));
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  // États pour les modals
  const [selectedAsset, setSelectedAsset] = useState<AssetData | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MarketCategory | null>(null);
  const [showAssetDetails, setShowAssetDetails] = useState(false);
  const [showViewAll, setShowViewAll] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  // === FONCTIONS DE CHARGEMENT DES DONNÉES RÉELLES ===

  const loadAllData = async () => {
    console.log('🔄 Chargement de toutes les données de marché...');
    await Promise.all([
      fetchCryptoData(),
      fetchStocksData(),
      fetchForexData()
    ]);
    setLastUpdate(new Date());
    console.log('✅ Toutes les données de marché chargées');
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAllData();
    setRefreshing(false);
  };

  // Récupération données crypto via CoinGecko
  const fetchCryptoData = async () => {
    try {
      setIsLoadingCrypto(true);
      setCryptoError(null);
      
      console.log('📈 Récupération des cryptos via CoinGecko...');
      
      const response = await fetch(COINGECKO_API_URL, {
        headers: { 'Accept': 'application/json' },
      });
      
      if (!response.ok) {
        throw new Error(`Erreur HTTP CoinGecko: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('CoinGecko n\'a retourné aucune donnée');
      }
      
      const formattedData: AssetData[] = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol.toUpperCase(),
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h || 0,
        market_cap: coin.market_cap,
        volume_24h: coin.total_volume,
        type: 'crypto' as const
      }));
      
      console.log(`✅ ${formattedData.length} cryptomonnaies récupérées`);
      setCryptoData(formattedData);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur cryptos';
      setCryptoError(errorMessage);
      console.error('❌ Erreur API Crypto:', err);
    } finally {
      setIsLoadingCrypto(false);
    }
  };

  // Récupération données actions via Yahoo Finance
  const fetchStocksData = async () => {
    try {
      setIsLoadingStocks(true);
      setStocksError(null);
      
      console.log('📊 Récupération des actions via Yahoo Finance...');
      
      const stocksDataArray: AssetData[] = [];
      
      for (let i = 0; i < Math.min(POPULAR_STOCKS.length, 6); i++) {
        const stock = POPULAR_STOCKS[i];
        
        try {
          console.log(`📈 Récupération de ${stock.symbol}...`);
          
          const url = `${YAHOO_FINANCE_API}/${stock.symbol}`;
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
          });
          
          if (!response.ok) {
            console.error(`❌ HTTP Error ${response.status} pour ${stock.symbol}`);
            continue;
          }
          
          const data = await response.json();
          const chart = data?.chart?.result?.[0];
          
          if (!chart) {
            console.error(`❌ Pas de données chart pour ${stock.symbol}`);
            continue;
          }
          
          const meta = chart.meta;
          const currentPrice = meta?.regularMarketPrice;
          const previousClose = meta?.previousClose;
          
          if (!currentPrice || !previousClose) {
            console.error(`❌ Prix manquants pour ${stock.symbol}`);
            continue;
          }
          
          const changePercent = ((currentPrice - previousClose) / previousClose) * 100;
          
          stocksDataArray.push({
            id: stock.symbol.toLowerCase(),
            name: stock.name,
            symbol: stock.symbol,
            current_price: currentPrice,
            price_change_percentage_24h: changePercent,
            type: 'stocks' as const
          });
          
          console.log(`✅ ${stock.symbol}: €${currentPrice.toFixed(2)} (${changePercent.toFixed(2)}%)`);
          
        } catch (error) {
          console.error(`❌ Erreur réseau pour ${stock.symbol}:`, error);
        }
        
        // Délai pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      if (stocksDataArray.length === 0) {
        throw new Error('Aucune donnée d\'action récupérée');
      }
      
      console.log(`✅ ${stocksDataArray.length} actions récupérées`);
      setStocksData(stocksDataArray);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur actions';
      setStocksError(errorMessage);
      console.error('❌ Erreur API Actions:', err);
    } finally {
      setIsLoadingStocks(false);
    }
  };

  // Récupération données Forex via Exchange Rates API
  const fetchForexData = async () => {
    try {
      setIsLoadingForex(true);
      setForexError(null);
      
      console.log('💱 Récupération des données Forex...');
      
      const forexDataArray: AssetData[] = [];
      
      for (const pair of FOREX_PAIRS.slice(0, 4)) {
        try {
          console.log(`💱 Récupération de ${pair.from}/${pair.to}...`);
          
          const url = `${EXCHANGE_RATE_API_BASE}/${pair.from}`;
          
          const response = await fetch(url, {
            headers: { 'Accept': 'application/json' },
          });
          
          if (!response.ok) {
            console.error(`❌ HTTP Error ${response.status} pour ${pair.from}/${pair.to}`);
            continue;
          }
          
          const data = await response.json();
          
          if (!data.rates || !data.rates[pair.to]) {
            console.error(`❌ Taux non disponible pour ${pair.from}/${pair.to}`);
            continue;
          }
          
          const rate = data.rates[pair.to];
          
          // Tentative de récupération de la variation 24h
          let variation = 0;
          try {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const dateStr = yesterday.toISOString().split('T')[0];
            
            const historyUrl = `https://api.exchangerate-api.com/v4/history/${pair.from}/${dateStr}`;
            const historyResponse = await fetch(historyUrl);
            
            if (historyResponse.ok) {
              const historyData = await historyResponse.json();
              if (historyData.rates && historyData.rates[pair.to]) {
                const previousRate = historyData.rates[pair.to];
                variation = ((rate - previousRate) / previousRate) * 100;
              }
            }
          } catch (historyError) {
            console.log(`⚠️ Impossible de récupérer l'historique pour ${pair.from}/${pair.to}`);
          }
          
          forexDataArray.push({
            id: `${pair.from}${pair.to}`.toLowerCase(),
            name: pair.name,
            symbol: `${pair.from}/${pair.to}`,
            current_price: rate,
            price_change_percentage_24h: variation,
            type: 'forex' as const
          });
          
          console.log(`✅ ${pair.from}/${pair.to}: ${rate.toFixed(4)} (${variation.toFixed(2)}%)`);
          
        } catch (error) {
          console.error(`❌ Erreur pour ${pair.from}/${pair.to}:`, error);
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (forexDataArray.length === 0) {
        throw new Error('Aucune donnée Forex récupérée');
      }
      
      console.log(`✅ ${forexDataArray.length} paires Forex récupérées`);
      setForexData(forexDataArray);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur Forex';
      setForexError(errorMessage);
      console.error('❌ Erreur API Forex:', err);
    } finally {
      setIsLoadingForex(false);
    }
  };

  // === GESTIONNAIRES D'ÉVÉNEMENTS ===

  const handleShowTutorial = () => {
    setShowTutorial(true);
    Animated.timing(tutorialOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseTutorial = () => {
    Animated.timing(tutorialOpacity, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowTutorial(false);
    });
  };

  const handleAssetPress = (asset: AssetData) => {
    console.log('🎯 Asset sélectionné:', asset.name, asset.current_price);
    setSelectedAsset(asset);
    setShowAssetDetails(true);
  };

  const handleViewAllPress = (category: MarketCategory) => {
    console.log('👀 Voir tous les actifs de:', category.title);
    setSelectedCategory(category);
    setShowViewAll(true);
  };

  // === CONFIGURATION DES CATÉGORIES ===

  const categories: MarketCategory[] = [
    {
      title: 'Actions',
      icon: <BarChart3 size={20} color="#3b82f6" strokeWidth={2} />,
      iconStyle: 'stocksIcon',
      data: stocksData,
      type: 'stocks',
      isLoading: isLoadingStocks,
      error: stocksError
    },
    {
      title: 'Cryptomonnaies',
      icon: <Bitcoin size={20} color="#fbbf24" strokeWidth={2} />,
      iconStyle: 'cryptoIcon',
      data: cryptoData,
      type: 'crypto',
      isLoading: isLoadingCrypto,
      error: cryptoError
    },
    {
      title: 'Forex',
      icon: <DollarSign size={20} color="#8b5cf6" strokeWidth={2} />,
      iconStyle: 'forexIcon',
      data: forexData,
      type: 'forex',
      isLoading: isLoadingForex,
      error: forexError
    }
  ];

  // === RENDU DU CONTENU DE CATÉGORIE ===

  const renderCategoryContent = (category: MarketCategory) => {
    if (category.isLoading) {
      return (
        <View style={marketStyles.loadingContainer}>
          <ActivityIndicator size="small" color="#64748b" />
          <Text style={marketStyles.loadingText}>
            Chargement des {category.title.toLowerCase()}...
          </Text>
        </View>
      );
    }

    if (category.error) {
      return (
        <View style={marketStyles.errorContainer}>
          <AlertCircle size={24} color="#dc2626" strokeWidth={2} />
          <Text style={marketStyles.errorText}>{category.error}</Text>
          <TouchableOpacity 
            style={marketStyles.retryButton} 
            onPress={() => {
              if (category.type === 'crypto') fetchCryptoData();
              else if (category.type === 'stocks') fetchStocksData();
              else if (category.type === 'forex') fetchForexData();
            }}
          >
            <RefreshCw size={16} color="#ffffff" strokeWidth={2} />
            <Text style={marketStyles.retryButtonText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (category.data.length === 0) {
      return (
        <View style={marketStyles.emptyContainer}>
          <Text style={marketStyles.emptyText}>Aucune donnée disponible</Text>
        </View>
      );
    }

    return (
      <FlatList
        horizontal
        data={category.data}
        renderItem={({ item }) => (
          <AssetCard
            name={item.name}
            symbol={item.symbol}
            price={item.current_price}
            variation24h={item.price_change_percentage_24h}
            type={category.type}
            onPress={() => handleAssetPress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={marketStyles.assetsList}
      />
    );
  };

  // === CALCULS POUR LES STATISTIQUES ===

  const isAnyDataLoading = isLoadingCrypto || isLoadingStocks || isLoadingForex;
  const totalAssets = cryptoData.length + stocksData.length + forexData.length;
  const activeCategoriesCount = categories.filter(c => c.data.length > 0).length;

  return (
    <View style={marketStyles.container}>
      <ScrollView 
        style={marketStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={marketStyles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10b981']}
            tintColor="#10b981"
          />
        }
      >
        {/* Header avec informations en temps réel */}
        <View style={marketStyles.header}>
          <View style={marketStyles.headerContent}>
            <Text style={marketStyles.title}>Marchés</Text>
            <View style={marketStyles.subtitleContainer}>
              <Text style={marketStyles.subtitle}>Données en temps réel</Text>
              {lastUpdate && (
                <Text style={marketStyles.lastUpdate}>
                  Mis à jour: {lastUpdate.toLocaleTimeString('fr-FR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </Text>
              )}
            </View>
          </View>
          <TouchableOpacity 
            style={marketStyles.tutorialButton}
            onPress={handleShowTutorial}
          >
            <HelpCircle size={20} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Statistiques globales en temps réel */}
        <View style={marketStyles.marketStats}>
          <View style={marketStyles.statsHeader}>
            <Text style={marketStyles.statsTitle}>Vue d'ensemble</Text>
            <View style={marketStyles.liveIndicator}>
              <View style={marketStyles.liveDot} />
              <Text style={marketStyles.liveText}>LIVE</Text>
            </View>
          </View>
          <View style={marketStyles.statsGrid}>
            <View style={marketStyles.statItem}>
              <Text style={marketStyles.statValue}>{totalAssets}</Text>
              <Text style={marketStyles.statLabel}>Actifs</Text>
            </View>
            <View style={marketStyles.statItem}>
              <Text style={marketStyles.statValue}>{activeCategoriesCount}</Text>
              <Text style={marketStyles.statLabel}>Catégories</Text>
            </View>
            <View style={marketStyles.statItem}>
              <Text style={marketStyles.statValue}>
                {isAnyDataLoading ? '...' : '✓'}
              </Text>
              <Text style={marketStyles.statLabel}>Statut</Text>
            </View>
          </View>
        </View>

        {/* Catégories d'actifs avec vraies données */}
        {categories.map((category, index) => (
          <View key={index} style={marketStyles.categorySection}>
            <View style={marketStyles.categoryHeader}>
              <View style={marketStyles.categoryTitleContainer}>
                <View style={[
                  marketStyles.categoryIconContainer,
                  category.iconStyle === 'stocksIcon' ? marketStyles.stocksIcon : 
                  category.iconStyle === 'cryptoIcon' ? marketStyles.cryptoIcon : 
                  marketStyles.forexIcon
                ]}>
                  {category.icon}
                </View>
                <View>
                  <Text style={marketStyles.categoryTitle}>{category.title}</Text>
                  <Text style={marketStyles.categorySubtitle}>
                    {category.data.length} {category.data.length <= 1 ? 'actif' : 'actifs'}
                  </Text>
                </View>
              </View>
              {category.data.length > 0 && (
                <TouchableOpacity 
                  style={marketStyles.viewAllButton}
                  onPress={() => handleViewAllPress(category)}
                >
                  <Text style={marketStyles.viewAllText}>Voir tout</Text>
                  <ChevronRight size={16} color="#3b82f6" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>

            {renderCategoryContent(category)}
          </View>
        ))}

        <View style={marketStyles.bottomSpacer} />
      </ScrollView>

      {/* Modal de tutoriel */}
      <Modal
        visible={showTutorial}
        transparent
        animationType="none"
        statusBarTranslucent
      >
        <Animated.View 
          style={[
            marketStyles.tutorialOverlay,
            { opacity: tutorialOpacity }
          ]}
        >
          <View style={marketStyles.tutorialModal}>
            <View style={marketStyles.tutorialIcon}>
              <Rocket size={40} color="#10b981" strokeWidth={2} />
            </View>
            <Text style={marketStyles.tutorialTitle}>
              Bienvenue dans les marchés
            </Text>
            <Text style={marketStyles.tutorialDescription}>
              Explorez les vrais cours des marchés financiers mondiaux en temps réel.
            </Text>
            <Text style={marketStyles.tutorialHighlight}>
              Tirez vers le bas pour actualiser. Touchez un actif pour voir ses détails complets.
            </Text>
            <TouchableOpacity 
              style={marketStyles.tutorialButton}
              onPress={handleCloseTutorial}
            >
              <Text style={marketStyles.tutorialButtonText}>Commencer l'exploration</Text>
              <ArrowRight size={20} color="#ffffff" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </Modal>

      {/* Modal des détails d'actif */}
      {selectedAsset && (
        <AssetDetails
          asset={selectedAsset}
          visible={showAssetDetails}
          onClose={() => {
            setShowAssetDetails(false);
            setSelectedAsset(null);
          }}
        />
      )}

      {/* Modal pour voir tous les actifs */}
      {selectedCategory && (
        <ViewAllAssets
          category={selectedCategory}
          visible={showViewAll}
          onClose={() => {
            setShowViewAll(false);
            setSelectedCategory(null);
          }}
        />
      )}
    </View>
  );
};

export default Market;