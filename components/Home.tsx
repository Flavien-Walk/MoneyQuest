import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  TrendingDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { homeStyles } from '../styles/HomeStyle';
import AssetDetails from '../components/AssetsDetails';
import NewsReader from '../components/NewsReader';
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
  },
  BACKEND: {
    baseUrl: 'http://192.168.1.73:5000'
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

interface UserData {
  id: string;
  firstName: string;
  email: string;
}

const Home: React.FC = () => {
  const router = useRouter();
  const newsLoadingRef = useRef(false);
  
  // États pour l'utilisateur
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  
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
  const [newsError, setNewsError] = useState<string | null>(null);
  const [lastNewsUpdate, setLastNewsUpdate] = useState<Date | null>(null);

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

  // Fonction pour charger les données utilisateur
  const loadUserData = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      console.log('🔍 Tentative de chargement utilisateur - Token:', !!token, 'UserId:', userId);

      if (!token || !userId) {
        console.log('❌ Token ou userId manquant');
        setIsAuthenticated(false);
        return;
      }

      // Essayer d'abord l'endpoint profile s'il existe
      let response;
      try {
        response = await fetch(`${API_CONFIG.BACKEND.baseUrl}/user/${userId}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (profileError) {
        console.log('⚠️ Endpoint /profile non disponible, tentative avec endpoint alternatif');
        // Si l'endpoint profile n'existe pas, essayer un endpoint alternatif
        response = await fetch(`${API_CONFIG.BACKEND.baseUrl}/user/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      console.log('📡 Réponse API status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Données reçues du backend:', data);
        
        // Gestion flexible de la structure des données
        const userData = {
          id: (data.id || data.user_id || userId).toString(),
          firstName: data.pseudo || data.firstName || data.firstname || data.first_name || data.name || '',
          email: data.email || ''
        };
        
        console.log('✅ Données utilisateur formatées:', userData);
        setUserData(userData);
        setIsAuthenticated(true);
      } else if (response.status === 404) {
        console.log('⚠️ Endpoint utilisateur non trouvé, utilisation des données minimales');
        // Si l'endpoint n'existe pas, utiliser les données minimales
        setUserData({
          id: userId,
          firstName: '', // Sera rempli plus tard quand l'endpoint sera implémenté
          email: ''
        });
        setIsAuthenticated(true);
      } else if (response.status === 401) {
        console.log('🚫 Token invalide ou expiré');
        // Token invalide ou expiré
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
        setIsAuthenticated(false);
      } else {
        console.log('❌ Erreur API:', response.status, response.statusText);
        // Autres erreurs - garder l'utilisateur connecté mais sans données
        setUserData({
          id: userId,
          firstName: '',
          email: ''
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('❌ Erreur lors du chargement des données utilisateur:', error);
      // En cas d'erreur réseau, garder l'utilisateur connecté
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        setUserData({
          id: userId,
          firstName: '',
          email: ''
        });
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  // Interface pour les articles bruts de l'API
  interface RawNewsArticle {
    title?: string;
    description?: string;
    content?: string;
    url?: string;
    urlToImage?: string;
    publishedAt?: string;
    source?: {
      name?: string;
    };
  }

  // Fonction pour nettoyer et valider les articles
  const validateAndCleanArticle = (article: RawNewsArticle, index: number): NewsArticle | null => {
    if (!article.title || !article.description || !article.source?.name) {
      console.log(`❌ Article ${index} invalide: manque title/description/source`);
      return null;
    }

    // Filtrer les articles supprimés ou invalides de manière plus souple
    const removedPatterns = ['[removed]', 'removed', '[deleted]', 'deleted'];
    const hasRemovedContent = removedPatterns.some(pattern => 
      (article.title?.toLowerCase().includes(pattern)) || 
      (article.description?.toLowerCase().includes(pattern))
    );
    
    if (hasRemovedContent) {
      console.log(`❌ Article ${index} supprimé: contenu removed/deleted`);
      return null;
    }

    // Accepter les articles même sans image
    const articleId = `${article.publishedAt || Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`;

    return {
      id: articleId,
      title: article.title.trim(),
      description: article.description.trim(),
      content: article.content?.trim() || article.description.trim(),
      url: article.url || '',
      urlToImage: article.urlToImage || '', // Garder même si vide
      publishedAt: article.publishedAt || new Date().toISOString(),
      source: {
        name: article.source.name.trim()
      }
    };
  };

  // Interface pour les données de l'API NewsAPI
  interface NewsAPIResponse {
    status: string;
    code?: string;
    message?: string;
    articles?: RawNewsArticle[];
  }

  // Chargement des actualités financières réelles - VERSION SIMPLIFIÉE
  const loadFinancialNews = useCallback(async (forceRefresh = false) => {
    // Éviter les doubles appels
    if (newsLoadingRef.current) {
      console.log('🚫 Chargement déjà en cours, annulé');
      return;
    }

    // Éviter les requêtes trop fréquentes (max 1 par minute)
    if (!forceRefresh && lastNewsUpdate && Date.now() - lastNewsUpdate.getTime() < 60000) {
      console.log('⏳ Actualités récentes, pas de rechargement nécessaire');
      return;
    }

    newsLoadingRef.current = true;
    setIsLoadingNews(true);
    setNewsError(null);

    try {
      console.log('🔄 Chargement des actualités financières...');
      
      // Requête simplifiée et plus large
      const response = await fetch(
        `${API_CONFIG.NEWS_API.baseUrl}/everything?` +
        `q=finance OR crypto OR bitcoin OR bourse&` +
        `language=fr&` +
        `sortBy=publishedAt&` +
        `pageSize=30&` +
        `from=${new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()}&` + // Dernières 48h
        `apiKey=${API_CONFIG.NEWS_API.key}`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status} - ${response.statusText}`);
      }

      const data: NewsAPIResponse = await response.json();
      
      if (data.status === 'error') {
        throw new Error(data.message || `Erreur API NewsAPI: ${data.code || 'Inconnue'}`);
      }

      console.log(`📰 API Response: ${data.articles?.length || 0} articles bruts reçus`);

      if (!data.articles || !Array.isArray(data.articles) || data.articles.length === 0) {
        throw new Error('Aucun article retourné par l\'API');
      }

      // Validation plus permissive
      const validArticles = data.articles
        .map((article: RawNewsArticle, index: number) => validateAndCleanArticle(article, index))
        .filter((article): article is NewsArticle => article !== null);

      console.log(`✅ ${validArticles.length} articles validés sur ${data.articles.length}`);

      if (validArticles.length === 0) {
        throw new Error('Aucun article valide après filtrage');
      }

      // Trier par date de publication (plus récent en premier)
      const sortedArticles = validArticles.sort((a: NewsArticle, b: NewsArticle) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );

      // Limiter à 15 articles
      const finalArticles = sortedArticles.slice(0, 15);

      console.log(`✅ ${finalArticles.length} actualités financières chargées`);
      setNewsArticles(finalArticles);
      setLastNewsUpdate(new Date());
      setNewsError(null);

    } catch (error) {
      console.error('❌ Erreur lors du chargement des actualités:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setNewsError(errorMessage);
      
      // Si on a déjà des articles, on les garde
      if (newsArticles.length === 0) {
        setNewsArticles([]);
      }
    } finally {
      setIsLoadingNews(false);
      newsLoadingRef.current = false;
    }
  }, [lastNewsUpdate, newsArticles.length]);

  // Recherche d'assets avec debounce optimisé
  const performSearch = useCallback(async (query: string) => {
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

      for (const asset of popularMatches.slice(0, 8)) { // Limiter à 8 résultats
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
          // Ajouter même sans prix pour garder la recherche fonctionnelle
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
  }, []);

  // Fonctions de recherche API (inchangées)
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
      console.warn(`Rate limit pour ${symbol}`);
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
      console.warn(`Rate limit pour ${symbol}`);
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
  }, [searchQuery, performSearch]);

  // Charger les données utilisateur au démarrage
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  // Charger les actualités au démarrage - UNE SEULE FOIS
  useEffect(() => {
    let mounted = true;
    
    const initializeNews = async () => {
      if (mounted) {
        await loadFinancialNews();
      }
    };
    
    initializeNews();
    
    // Actualiser les actualités toutes les 10 minutes (plus raisonnable)
    const interval = setInterval(() => {
      if (mounted) {
        loadFinancialNews();
      }
    }, 10 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
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
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    
    if (diffMinutes < 1) {
      return 'À l\'instant';
    } else if (diffMinutes < 60) {
      return `${diffMinutes}min`;
    } else if (diffMinutes < 1440) {
      const diffHours = Math.floor(diffMinutes / 60);
      return `${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffMinutes / 1440);
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

  const handleRefreshNews = () => {
    loadFinancialNews(true);
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
    router.push('/profile');
  };

  const handleViewShop = () => {
    console.log('Navigation vers la boutique');
  };

  // Fonction pour obtenir le message de salutation personnalisé
  const getGreetingMessage = () => {
    if (isAuthenticated === null) {
      return 'Chargement...';
    }
    
    if (isAuthenticated && userData?.firstName) {
      return `Bonjour ${userData.firstName}`;
    }
    
    return 'Bonjour';
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
            <Text style={homeStyles.greetingText}>{getGreetingMessage()}</Text>
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
            <View style={homeStyles.newsHeaderActions}>
              <TouchableOpacity 
                style={homeStyles.refreshButton} 
                onPress={handleRefreshNews}
                disabled={isLoadingNews}
              >
                <RefreshCw 
                  size={16} 
                  color={isLoadingNews ? "#94a3b8" : "#3b82f6"} 
                  strokeWidth={2}
                  style={isLoadingNews ? { opacity: 0.5 } : {}}
                />
              </TouchableOpacity>
              <TouchableOpacity style={homeStyles.seeAllButton} onPress={handleViewAllNews}>
                <Text style={homeStyles.seeAllText}>Voir tout</Text>
                <ChevronRight size={16} color="#3b82f6" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Indicateur de dernière mise à jour */}
          {lastNewsUpdate && !isLoadingNews && (
            <Text style={homeStyles.lastUpdateText}>
              Dernière mise à jour: {getTimeAgo(lastNewsUpdate.toISOString())}
            </Text>
          )}
          
          {isLoadingNews ? (
            <View style={homeStyles.newsLoadingContainer}>
              <ActivityIndicator size="small" color="#3b82f6" />
              <Text style={homeStyles.newsLoadingText}>Chargement des actualités...</Text>
            </View>
          ) : newsError ? (
            <View style={homeStyles.newsErrorContainer}>
              <View style={homeStyles.newsErrorIconContainer}>
                <AlertCircle size={24} color="#ef4444" strokeWidth={2} />
              </View>
              <Text style={homeStyles.newsErrorTitle}>Problème de connexion</Text>
              <Text style={homeStyles.newsErrorMessage}>
                {newsError.includes('Network') ? 
                  'Vérifiez votre connexion internet' : 
                  'Service temporairement indisponible'
                }
              </Text>
              <TouchableOpacity 
                style={homeStyles.retryButton} 
                onPress={() => loadFinancialNews(true)}
              >
                <RefreshCw size={16} color="#ffffff" strokeWidth={2} />
                <Text style={homeStyles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
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
                  {article.urlToImage ? (
                    <Image
                      source={{ uri: article.urlToImage }}
                      style={homeStyles.newsImage}
                      resizeMode="cover"
                      onError={(error) => {
                        console.warn('Erreur de chargement image:', error.nativeEvent.error);
                      }}
                    />
                  ) : (
                    <View style={[homeStyles.newsImage, { backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' }]}>
                      <Newspaper size={32} color="#94a3b8" strokeWidth={1.5} />
                    </View>
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
                Actualités temporairement indisponibles
              </Text>
              <Text style={homeStyles.newsPlaceholderSubtitle}>
                Les dernières actualités financières seront bientôt disponibles
              </Text>
              <TouchableOpacity 
                style={homeStyles.retryButton} 
                onPress={() => loadFinancialNews(true)}
              >
                <RefreshCw size={16} color="#ffffff" strokeWidth={2} />
                <Text style={homeStyles.retryButtonText}>Recharger</Text>
              </TouchableOpacity>
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
        onRefresh={handleRefreshNews}
        isRefreshing={isLoadingNews}
      />
    </View>
  );
};

export default Home;