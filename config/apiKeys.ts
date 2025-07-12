// config/apiKeys.ts
// 🔑 Configuration des clés API

export const API_KEYS = {
  // 📈 Twelve Data - Pour actions et forex
  // Ta clé API personnelle avec 800 requêtes/jour
  TWELVE_DATA: 'ebb585b9a5514b6ea5311bb35a28de5d',
  
  // 🪙 CoinGecko - Pour crypto (pas de clé nécessaire)
  COINGECKO: '', // Gratuit et illimité
};

// 🌐 URLs des APIs
export const API_ENDPOINTS = {
  TWELVE_DATA: 'https://api.twelvedata.com',
  COINGECKO: 'https://api.coingecko.com/api/v3',
};

// 📊 Configuration des limites
export const API_LIMITS = {
  TWELVE_DATA: {
    requestsPerDay: 800,
    requestsPerMinute: 8,
  },
  COINGECKO: {
    requestsPerMinute: 50, // Limite recommandée
  },
};

// 🔄 Mapping des symboles optimisé
export const SYMBOL_MAPPINGS = {
  // Crypto : Symbol → CoinGecko ID
  crypto: {
    'BTC': 'bitcoin',
    'ETH': 'ethereum', 
    'BNB': 'binancecoin',
    'ADA': 'cardano',
    'SOL': 'solana',
    'DOT': 'polkadot',
    'LINK': 'chainlink',
    'LTC': 'litecoin',
    'XRP': 'ripple',
    'MATIC': 'matic-network',
    'AVAX': 'avalanche-2',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
  },
  
  // Actions : Symbol → Twelve Data Symbol
  stocks: {
    'AAPL': 'AAPL',
    'GOOGL': 'GOOGL',
    'MSFT': 'MSFT',
    'TSLA': 'TSLA',
    'AMZN': 'AMZN',
    'META': 'META',
    'NVDA': 'NVDA',
    'NFLX': 'NFLX',
    'BABA': 'BABA',
    'V': 'V',
  },
  
  // Forex : Symbol → Twelve Data Symbol
  forex: {
    'EURUSD': 'EUR/USD',
    'GBPUSD': 'GBP/USD', 
    'USDJPY': 'USD/JPY',
    'USDCHF': 'USD/CHF',
    'AUDUSD': 'AUD/USD',
    'USDCAD': 'USD/CAD',
    'NZDUSD': 'NZD/USD',
    'EURGBP': 'EUR/GBP',
  }
};

// 🎯 Helper pour obtenir le bon symbole
export const getApiSymbol = (originalSymbol: string, assetType: 'crypto' | 'stocks' | 'forex'): string => {
  const mapping = SYMBOL_MAPPINGS[assetType] as { [key: string]: string };
  return mapping[originalSymbol] || originalSymbol;
};

// ⚡ Helper pour vérifier les limites (simple)
export const checkRateLimit = (apiName: keyof typeof API_LIMITS): boolean => {
  // Pour une version simple, on retourne toujours true
  // Tu peux implémenter un rate limiter plus sophistiqué plus tard
  return true;
};

// 📝 Instructions d'utilisation
/*
✅ TA CLÉ API EST DÉJÀ CONFIGURÉE !

🔧 Comment utiliser :

1. 📁 Structure des fichiers :
   ton-projet/
   ├── config/
   │   └── apiKeys.ts          # Ce fichier (clé déjà intégrée)
   ├── components/
   │   └── AssetDetails.tsx    # Composant principal (clé auto-importée)
   └── styles/
       └── AssetsDetailsStyle.ts # Styles épurés

2. 🚀 Fonctionnalités disponibles :
   - Actions : Apple, Google, Tesla, etc. (temps réel)
   - Forex : EUR/USD, GBP/USD, etc. (temps réel)
   - Crypto : Bitcoin, Ethereum, etc. (temps réel)

3. 📊 Limites de ta clé :
   - 800 requêtes par jour
   - 8 requêtes par minute
   - Parfait pour une app de démo/test

4. 🎨 Design épuré :
   - Interface minimaliste et moderne
   - Pas d'emojis, design professionnel
   - Animations subtiles
   - Couleurs adaptatives selon le sentiment

5. 🔒 Sécurité :
   - Clé intégrée directement (OK pour dev/test)
   - Pour la production : utilise des variables d'environnement
   - Ajoute ce fichier à .gitignore si tu veux le sécuriser

6. 🎯 APIs utilisées :
   - Twelve Data : Actions + Forex (avec ta clé)
   - CoinGecko : Crypto (gratuit, sans clé)
   - Fallback automatique en cas d'erreur

7. 🧪 Exemple d'utilisation :
   import { API_KEYS } from '../config/apiKeys';
   
   // Dans ton composant
   const response = await fetch(
     `https://api.twelvedata.com/quote?symbol=AAPL&apikey=${API_KEYS.TWELVE_DATA}`
   );
*/