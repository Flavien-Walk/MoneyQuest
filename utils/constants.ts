// === CONFIGURATION API ===

// ⚠️ IMPORTANT: Remplacez par votre vraie clé API Alpha Vantage
// Obtenez votre clé gratuite sur: https://www.alphavantage.co/support/#api-key
export const ALPHA_VANTAGE_API_KEY = 'VOTRE_CLE_API_ICI'; // Remplacez par votre clé

// === ENDPOINTS API ===

// 1. Cryptomonnaies - CoinGecko (gratuit, pas de clé requise)
export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h';

// 2. Actions - Alpha Vantage (clé requise)
export const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query';
export const ALPHA_VANTAGE_FUNCTION = 'GLOBAL_QUOTE';

// 3. Forex - Exchange Rates API (gratuit, pas de clé requise)
export const EXCHANGE_RATE_API_BASE = 'https://api.exchangerate-api.com/v4/latest';

// Alternative pour Forex avec plus de données historiques (nécessite une clé)
// export const FIXER_API_BASE = 'https://api.fixer.io/v1';
// export const FIXER_API_KEY = 'VOTRE_CLE_FIXER_ICI';

// === CONFIGURATION ===

// Limites de taux pour Alpha Vantage (version gratuite)
export const ALPHA_VANTAGE_RATE_LIMIT = 5; // 5 appels par minute
export const ALPHA_VANTAGE_RATE_LIMIT_WINDOW = 60000; // 1 minute en millisecondes
export const ALPHA_VANTAGE_DELAY_BETWEEN_CALLS = 12000; // 12 secondes entre chaque appel

// Timeout pour les requêtes API
export const API_TIMEOUT = 15000; // 15 secondes

// Configuration retry
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 2000; // 2 secondes

// Intervalle de mise à jour automatique (optionnel)
export const AUTO_REFRESH_INTERVAL = 300000; // 5 minutes

// === SYMBOLES ET PAIRES ===

// Actions populaires avec leurs noms complets
export const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'E-commerce' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Semiconductors' },
  { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Social Media' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertainment' }
] as const;

// Cryptomonnaies principales (utilisées comme fallback si CoinGecko ne répond pas)
export const POPULAR_CRYPTOCURRENCIES = [
  { id: 'bitcoin', name: 'Bitcoin', symbol: 'BTC' },
  { id: 'ethereum', name: 'Ethereum', symbol: 'ETH' },
  { id: 'binancecoin', name: 'BNB', symbol: 'BNB' },
  { id: 'cardano', name: 'Cardano', symbol: 'ADA' },
  { id: 'solana', name: 'Solana', symbol: 'SOL' },
  { id: 'polkadot', name: 'Polkadot', symbol: 'DOT' },
  { id: 'chainlink', name: 'Chainlink', symbol: 'LINK' },
  { id: 'litecoin', name: 'Litecoin', symbol: 'LTC' }
] as const;

// Paires de devises populaires
export const FOREX_PAIRS = [
  { from: 'EUR', to: 'USD', name: 'Euro / US Dollar', category: 'Major' },
  { from: 'GBP', to: 'USD', name: 'British Pound / US Dollar', category: 'Major' },
  { from: 'USD', to: 'JPY', name: 'US Dollar / Japanese Yen', category: 'Major' },
  { from: 'USD', to: 'CHF', name: 'US Dollar / Swiss Franc', category: 'Major' },
  { from: 'AUD', to: 'USD', name: 'Australian Dollar / US Dollar', category: 'Commodity' },
  { from: 'USD', to: 'CAD', name: 'US Dollar / Canadian Dollar', category: 'Commodity' }
] as const;

// === HELPERS ===

/**
 * Vérifie si la clé API Alpha Vantage est configurée
 */
export const isAlphaVantageConfigured = (): boolean => {
  return ALPHA_VANTAGE_API_KEY && ALPHA_VANTAGE_API_KEY !== 'VOTRE_CLE_API_ICI';
};

/**
 * Construit l'URL pour une requête Alpha Vantage
 */
export const buildAlphaVantageUrl = (symbol: string, func: string = ALPHA_VANTAGE_FUNCTION): string => {
  return `${ALPHA_VANTAGE_BASE_URL}?function=${func}&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
};

/**
 * Construit l'URL pour une requête de taux de change
 */
export const buildForexUrl = (baseCurrency: string): string => {
  return `${EXCHANGE_RATE_API_BASE}/${baseCurrency}`;
};

/**
 * Formate le prix selon le type d'actif
 */
export const formatPrice = (price: number, type: 'stocks' | 'crypto' | 'forex'): string => {
  switch (type) {
    case 'stocks':
      return `$${price.toFixed(2)}`;
    case 'crypto':
      return price < 1 ? `$${price.toFixed(6)}` : `$${price.toFixed(2)}`;
    case 'forex':
      return price.toFixed(4);
    default:
      return price.toString();
  }
};

/**
 * Formate la variation en pourcentage
 */
export const formatPercentage = (percentage: number): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(2)}%`;
};

/**
 * Détermine la couleur selon la variation
 */
export const getVariationColor = (percentage: number): string => {
  return percentage >= 0 ? '#10b981' : '#ef4444';
};

// === MESSAGES D'ERREUR PERSONNALISÉS ===

export const ERROR_MESSAGES = {
  NETWORK: 'Erreur de connexion. Vérifiez votre connexion internet.',
  API_KEY_MISSING: 'Clé API manquante. Configurez votre clé Alpha Vantage.',
  API_LIMIT: 'Limite de taux API atteinte. Réessayez dans quelques minutes.',
  DATA_INVALID: 'Données invalides reçues de l\'API.',
  TIMEOUT: 'Timeout de la requête. Le service peut être temporairement indisponible.',
  UNKNOWN: 'Une erreur inattendue s\'est produite.'
} as const;

/**
 * Catégorise les erreurs API pour un meilleur handling
 */
export const categorizeError = (error: any): keyof typeof ERROR_MESSAGES => {
  const message = error?.message?.toLowerCase() || '';
  
  if (message.includes('network') || message.includes('fetch')) {
    return 'NETWORK';
  }
  if (message.includes('api key') || message.includes('unauthorized')) {
    return 'API_KEY_MISSING';
  }
  if (message.includes('rate limit') || message.includes('too many requests')) {
    return 'API_LIMIT';
  }
  if (message.includes('timeout')) {
    return 'TIMEOUT';
  }
  if (message.includes('invalid') || message.includes('malformed')) {
    return 'DATA_INVALID';
  }
  
  return 'UNKNOWN';
};