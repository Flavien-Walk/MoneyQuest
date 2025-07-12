import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  ActivityIndicator,
  Alert,
  Image
} from 'react-native';
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
  Zap,
  Search,
  X,
  Bitcoin,
  Building2,
  TrendingDown
} from 'lucide-react-native';
import { homeStyles } from '../styles/HomeStyle';
import AssetDetails from '../components/AssetsDetails';
import NewsReader from '../components/Newsreader';
import NewsList from '../components/NewsList';

// Configuration API
const API_CONFIG = {
  TWELVE_DATA: {
    key: 'ebb585b9a5514b6ea5311bb35a28de5d',
    baseUrl: 'https://api.twelvedata.com'
  },
  COINGECKO: {
    baseUrl: 'https://api.coingecko.com/api/v3'
  },
  NEWS_API: {
    key: '5cfe073c673a4d358b41ccd638ba6177',
    baseUrl: 'https://newsapi.org/v2'
  }
};

// Interfaces
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  urlToImage: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface SearchResult {
  id: string;
  name: string;
  symbol: string;
  type: 'crypto' | 'stocks' | 'forex';
  current_price?: number;
  price_change_percentage_24h?: number;
  market_cap?: number;
  volume_24h?: number;
}

interface AssetForDetails {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  volume_24h?: number;
  type: 'crypto' | 'stocks' | 'forex';
}

const Home: React.FC = () => {
  const router = useRouter();
  
  // États pour la recherche
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // États pour AssetDetails
  const [selectedAsset, setSelectedAsset] = useState<AssetForDetails | null>(null);
  const [showAssetDetails, setShowAssetDetails] = useState(false);

  // États pour les actualités
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);
  const [showNewsReader, setShowNewsReader] = useState(false);
  const [showNewsList, setShowNewsList] = useState(false);

  // Assets populaires
  const popularAssets = [
    { symbol: 'BTC', name: 'Bitcoin', type: 'crypto' as const, id: 'bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', type: 'crypto' as const, id: 'ethereum' },
    { symbol: 'BNB', name: 'BNB', type: 'crypto' as const, id: 'binancecoin' },
    { symbol: 'ADA', name: 'Cardano', type: 'crypto' as const, id: 'cardano' },
    { symbol: 'SOL', name: 'Solana', type: 'crypto' as const, id: 'solana' },
    { symbol: 'AAPL', name: 'Apple Inc.', type: 'stocks' as const, id: 'AAPL' },
    { symbol: 'TSLA', name: 'Tesla Inc.', type: 'stocks' as const, id: 'TSLA' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', type: 'stocks' as const, id: 'GOOGL' },
    { symbol: 'MSFT', name: 'Microsoft Corp.', type: 'stocks' as const, id: 'MSFT' },
    { symbol: 'EURUSD', name: 'Euro / US Dollar', type: 'forex' as const, id: 'EURUSD' },
    { symbol: 'GBPUSD', name: 'British Pound / US Dollar', type: 'forex' as const, id: 'GBPUSD' },
  ];

  // Chargement des actualités
  const loadFinancialNews = async () => {
    setIsLoadingNews(true);
    try {
      const response = await fetch(
        `${API_CONFIG.NEWS_API.baseUrl}/everything?` +
        `q=(finance OR économie OR bourse OR crypto OR bitcoin OR "marché financier" OR "actions" OR "investissement")&` +
        `language=fr&` +
        `sortBy=publishedAt&` +
        `pageSize=15&` +
        `apiKey=${API_CONFIG.NEWS_API.key}`
      );

      if (!response.ok) {
        throw new Error(`Erreur API NewsAPI: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Erreur NewsAPI');
      }
      
      const formattedArticles: NewsArticle[] = (data.articles || [])
        .filter((article: any) => 
          article.title && 
          article.description && 
          article.urlToImage &&
          !article.title.includes('[Removed]') &&
          !article.description.includes('[Removed]') &&
          article.urlToImage !== null
        )
        .map((article: any, index: number) => ({
          id: `${article.publishedAt}-${index}`,
          title: article.title,
          description: article.description,
          content: article.content || article.description,
          url: article.url,
          urlToImage: article.urlToImage,
          publishedAt: article.publishedAt,
          source: {
            name: article.source.name || 'Actualités'
          }
        }))
        .slice(0, 10);

      console.log(`✅ ${formattedArticles.length} actualités financières chargées`);
      setNewsArticles(formattedArticles);
      
    } catch (error) {
      console.error('Erreur actualités NewsAPI:', error);
      
      const demoArticles: NewsArticle[] = [
        {
          id: 'demo-1',
          title: 'Bitcoin franchit un nouveau cap historique à 100 000€',
          description: 'La cryptomonnaie continue sa progression fulgurante sur les marchés internationaux avec une hausse de 15% cette semaine.',
          content: 'Bitcoin a atteint de nouveaux sommets cette semaine, porté par l\'adoption institutionnelle croissante...',
          url: 'https://example.com/bitcoin-news',
          urlToImage: 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=400&h=300&fit=crop&q=80',
          publishedAt: new Date().toISOString(),
          source: { name: 'Crypto News France' }
        },
        {
          id: 'demo-2',
          title: 'CAC 40 : Les marchés européens terminent en hausse',
          description: 'Une semaine positive pour les indices boursiers européens avec des gains significatifs sur le CAC 40 (+2.1%).',
          content: 'Les investisseurs européens ont montré un optimisme renouvelé cette semaine...',
          url: 'https://example.com/cac40-news',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=300&fit=crop&q=80',
          publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          source: { name: 'Les Échos' }
        },
        {
          id: 'demo-3',
          title: 'Tesla : Résultats exceptionnels au T4',
          description: 'Les ventes de véhicules électriques de Tesla au quatrième trimestre ont largement dépassé les prévisions.',
          content: 'Tesla a annoncé des résultats exceptionnels pour le quatrième trimestre...',
          url: 'https://example.com/tesla-news',
          urlToImage: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=400&h=300&fit=crop&q=80',
          publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          source: { name: 'BFM Business' }
        }
      ];
      
      console.log('📰 Utilisation des actualités de démonstration');
      setNewsArticles(demoArticles);
    } finally {
      setIsLoadingNews(false);
    }
  };

  // Recherche d'assets
  const performSearch = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const results: SearchResult[] = [];

    try {
      const popularMatches = popularAssets.filter(asset =>
        asset.symbol.toLowerCase().includes(query.toLowerCase()) ||
        asset.name.toLowerCase().includes(query.toLowerCase())
      );

      for (const asset of popularMatches) {
        try {
          let assetData: SearchResult = {
            id: asset.id,
            name: asset.name,
            symbol: asset.symbol,
            type: asset.type
          };

          if (asset.type === 'crypto') {
            const cryptoData = await fetchCryptoSearchData(asset.symbol);
            assetData = { ...assetData, ...cryptoData };
          } else if (asset.type === 'stocks') {
            const stockData = await fetchStockSearchData(asset.symbol);
            assetData = { ...assetData, ...stockData };
          } else if (asset.type === 'forex') {
            const forexData = await fetchForexSearchData(asset.symbol);
            assetData = { ...assetData, ...forexData };
          }

          results.push(assetData);
        } catch (error) {
          results.push({
            id: asset.id,
            name: asset.name,
            symbol: asset.symbol,
            type: asset.type
          });
        }
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // Fonctions de recherche API
  const fetchCryptoSearchData = async (symbol: string) => {
    const symbolMapping: { [key: string]: string } = {
      'BTC': 'bitcoin', 'ETH': 'ethereum', 'BNB': 'binancecoin',
      'ADA': 'cardano', 'SOL': 'solana', 'DOT': 'polkadot',
      'LINK': 'chainlink', 'LTC': 'litecoin', 'XRP': 'ripple',
      'MATIC': 'matic-network', 'AVAX': 'avalanche-2', 'UNI': 'uniswap',
      'ATOM': 'cosmos'
    };
    
    const coinId = symbolMapping[symbol] || symbol.toLowerCase();
    
    const response = await fetch(
      `${API_CONFIG.COINGECKO.baseUrl}/simple/price?ids=${coinId}&vs_currencies=eur&include_24hr_change=true&include_market_cap=true&include_24hr_vol=true`
    );
    
    if (!response.ok) throw new Error('Crypto search failed');
    
    const data = await response.json();
    const coinData = data[coinId];
    
    if (!coinData) throw new Error('Crypto not found');
    
    return {
      current_price: coinData.eur,
      price_change_percentage_24h: coinData.eur_24h_change,
      market_cap: coinData.eur_market_cap,
      volume_24h: coinData.eur_24h_vol
    };
  };

  const fetchStockSearchData = async (symbol: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.TWELVE_DATA.baseUrl}/quote?symbol=${symbol}&apikey=${API_CONFIG.TWELVE_DATA.key}`
      );
      
      if (!response.ok) throw new Error('Stock search failed');
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Stock API error');
      }

      const currentPrice = parseFloat(data.close);
      const previousClose = parseFloat(data.previous_close);
      const change24h = currentPrice - previousClose;
      const changePercent24h = (change24h / previousClose) * 100;

      return {
        current_price: currentPrice,
        price_change_percentage_24h: changePercent24h,
        volume_24h: parseFloat(data.volume) || undefined
      };
    } catch (error) {
      console.warn(`Rate limit pour ${symbol}, utilisation de données par défaut`);
      return {};
    }
  };

  const fetchForexSearchData = async (symbol: string) => {
    try {
      const response = await fetch(
        `${API_CONFIG.TWELVE_DATA.baseUrl}/quote?symbol=${symbol}&apikey=${API_CONFIG.TWELVE_DATA.key}`
      );
      
      if (!response.ok) throw new Error('Forex search failed');
      
      const data = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || 'Forex API error');
      }

      const currentPrice = parseFloat(data.close);
      const previousClose = parseFloat(data.previous_close);
      const change24h = currentPrice - previousClose;
      const changePercent24h = (change24h / previousClose) * 100;

      return {
        current_price: currentPrice,
        price_change_percentage_24h: changePercent24h
      };
    } catch (error) {
      console.warn(`Rate limit pour ${symbol}, utilisation de données par défaut`);
      return {};
    }
  };

  // Debounce pour la recherche
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
        setShowSearchResults(true);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Charger les actualités au démarrage
  useEffect(() => {
    loadFinancialNews();
  }, []);

  // Gestionnaires d'événements
  const handleSelectAsset = (asset: SearchResult) => {
    setSearchQuery('');
    setShowSearchResults(false);
    setSearchResults([]);
    
    const formattedAsset: AssetForDetails = {
      id: asset.id,
      name: asset.name,
      symbol: asset.symbol,
      current_price: asset.current_price ?? 0,
      price_change_percentage_24h: asset.price_change_percentage_24h ?? 0,
      market_cap: asset.market_cap,
      volume_24h: asset.volume_24h,
      type: asset.type
    };
    
    setSelectedAsset(formattedAsset);
    setShowAssetDetails(true);
    
    console.log('🎯 Asset sélectionné depuis la recherche:', asset.name, formattedAsset.current_price);
  };

  const handleCloseAssetDetails = () => {
    setShowAssetDetails(false);
    setSelectedAsset(null);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'À l\'instant';
    } else if (diffHours < 24) {
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}j`;
    }
  };

  const openNewsReader = (article: NewsArticle) => {
    setSelectedArticle(article);
    setShowNewsReader(true);
  };

  const handleViewAllNews = () => {
    setShowNewsList(true);
  };

  const handleNewsListArticlePress = (article: NewsArticle) => {
    setShowNewsList(false);
    setSelectedArticle(article);
    setShowNewsReader(true);
  };

  // Fonctions utilitaires
  const formatPrice = (price?: number) => {
    if (!price) return '—';
    return `€${price.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatPercent = (percent?: number) => {
    if (!percent && percent !== 0) return '';
    const sign = percent >= 0 ? '+' : '';
    return `${sign}${percent.toFixed(2)}%`;
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'crypto':
        return <Bitcoin size={20} color="#f59e0b" strokeWidth={2} />;
      case 'stocks':
        return <Building2 size={20} color="#3b82f6" strokeWidth={2} />;
      case 'forex':
        return <BarChart3 size={20} color="#8b5cf6" strokeWidth={2} />;
      default:
        return <Search size={20} color="#64748b" strokeWidth={2} />;
    }
  };

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
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={homeStyles.header}>
          <View style={homeStyles.greetingContainer}>
            <Text style={homeStyles.greetingText}>Bonjour</Text>
            <Text style={homeStyles.motivationText}>Prêt à investir aujourd'hui ?</Text>
          </View>
          <TouchableOpacity style={homeStyles.profileButton} onPress={handleViewProfile}>
            <User size={20} color="#64748b" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Barre de recherche */}
        <View style={homeStyles.searchContainer}>
          <View style={homeStyles.searchInputContainer}>
            <Search size={20} color="#64748b" strokeWidth={2} />
            <TextInput
              style={homeStyles.searchInput}
              placeholder="Rechercher crypto, actions, forex..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                style={homeStyles.clearButton}
                onPress={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
              >
                <X size={16} color="#64748b" strokeWidth={2} />
              </TouchableOpacity>
            )}
            {isSearching && (
              <ActivityIndicator size="small" color="#3b82f6" />
            )}
          </View>
          
          {/* Résultats de recherche */}
          {showSearchResults && (
            <View style={homeStyles.searchResults}>
              {searchResults.length > 0 ? (
                searchResults.map((asset, index) => (
                  <TouchableOpacity
                    key={`${asset.symbol}-${index}`}
                    style={homeStyles.searchResultItem}
                    onPress={() => handleSelectAsset(asset)}
                  >
                    <View style={homeStyles.searchResultLeft}>
                      <View style={homeStyles.searchResultIcon}>
                        {getAssetIcon(asset.type)}
                      </View>
                      <View style={homeStyles.searchResultInfo}>
                        <Text style={homeStyles.searchResultSymbol}>{asset.symbol}</Text>
                        <Text style={homeStyles.searchResultName}>{asset.name}</Text>
                      </View>
                    </View>
                    <View style={homeStyles.searchResultRight}>
                      {asset.current_price && (
                        <Text style={homeStyles.searchResultPrice}>
                          {formatPrice(asset.current_price)}
                        </Text>
                      )}
                      {asset.price_change_percentage_24h !== undefined && (
                        <View style={homeStyles.searchResultChangeContainer}>
                          {asset.price_change_percentage_24h >= 0 ? (
                            <TrendingUp size={12} color="#10b981" strokeWidth={2} />
                          ) : (
                            <TrendingDown size={12} color="#ef4444" strokeWidth={2} />
                          )}
                          <Text style={[
                            homeStyles.searchResultChange,
                            { color: asset.price_change_percentage_24h >= 0 ? '#10b981' : '#ef4444' }
                          ]}>
                            {formatPercent(asset.price_change_percentage_24h)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                ))
              ) : searchQuery.length > 1 && !isSearching ? (
                <View style={homeStyles.searchNoResults}>
                  <Text style={homeStyles.searchNoResultsText}>
                    Aucun résultat pour "{searchQuery}"
                  </Text>
                </View>
              ) : null}
            </View>
          )}
        </View>

        {/* Carte portefeuille */}
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

        {/* Actions rapides */}
        <View style={homeStyles.quickActionsContainer}>
          <Text style={homeStyles.sectionTitle}>Actions rapides</Text>
          <View style={homeStyles.actionsGrid}>
            <TouchableOpacity 
              style={homeStyles.actionCard}
              onPress={handleViewMarket}
              activeOpacity={0.8}
            >
              <View style={homeStyles.actionIconContainer}>
                <BarChart3 size={24} color="#3b82f6" strokeWidth={2} />
              </View>
              <Text style={homeStyles.actionTitle}>Explorer</Text>
              <Text style={homeStyles.actionSubtitle}>les marchés</Text>
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

        {/* Section actualités */}
        <View style={homeStyles.newsSection}>
          <View style={homeStyles.newsSectionHeader}>
            <View style={homeStyles.newsTitleContainer}>
              <Newspaper size={20} color="#1e293b" strokeWidth={2} />
              <Text style={homeStyles.sectionTitle}>Actualités</Text>
            </View>
            <TouchableOpacity style={homeStyles.seeAllButton} onPress={handleViewAllNews}>
              <Text style={homeStyles.seeAllText}>Voir tout</Text>
              <ChevronRight size={16} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          
          {isLoadingNews ? (
            <View style={homeStyles.newsLoadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={homeStyles.newsLoadingText}>Chargement des actualités...</Text>
            </View>
          ) : newsArticles.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={homeStyles.newsCarousel}>
              {newsArticles.slice(0, 5).map((article) => (
                <TouchableOpacity
                  key={article.id}
                  style={homeStyles.newsCard}
                  onPress={() => openNewsReader(article)}
                  activeOpacity={0.8}
                >
                  {article.urlToImage && (
                    <Image
                      source={{ uri: article.urlToImage }}
                      style={homeStyles.newsImage}
                      resizeMode="cover"
                    />
                  )}
                  <View style={homeStyles.newsCardContent}>
                    <View style={homeStyles.newsCardHeader}>
                      <Text style={homeStyles.newsSource}>{article.source.name}</Text>
                      <Text style={homeStyles.newsTime}>{getTimeAgo(article.publishedAt)}</Text>
                    </View>
                    <Text style={homeStyles.newsTitle} numberOfLines={3}>
                      {article.title}
                    </Text>
                    <Text style={homeStyles.newsDescription} numberOfLines={2}>
                      {article.description}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
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
          )}
        </View>

        <View style={homeStyles.bottomSpacer} />
      </ScrollView>

      {/* Modals */}
      {selectedAsset && (
        <AssetDetails
          asset={selectedAsset}
          visible={showAssetDetails}
          onClose={handleCloseAssetDetails}
        />
      )}

      <NewsReader
        article={selectedArticle}
        visible={showNewsReader}
        onClose={() => {
          setShowNewsReader(false);
          setSelectedArticle(null);
        }}
      />

      <NewsList
        articles={newsArticles}
        visible={showNewsList}
        onClose={() => setShowNewsList(false)}
        onArticlePress={handleNewsListArticlePress}
        onRefresh={loadFinancialNews}
        isRefreshing={isLoadingNews}
      />
    </View>
  );
};

export default Home;