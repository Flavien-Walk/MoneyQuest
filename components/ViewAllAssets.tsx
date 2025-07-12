import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ActivityIndicator,
  TextInput,
  Modal
} from 'react-native';
import {
  ArrowLeft,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Star,
  Eye,
  SortAsc,
  SortDesc,
  Grid3X3,
  List
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AssetCard from './AssetCard';
import AssetDetails from './AssetsDetails';
import { viewAllAssetsStyles } from '../styles/ViewAllAssetsStyle';

interface Asset {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap?: number;
  volume_24h?: number;
  type: 'stocks' | 'crypto' | 'forex';
}

interface ViewAllAssetsProps {
  category: {
    title: string;
    type: 'stocks' | 'crypto' | 'forex';
    data: Asset[];
  };
  visible: boolean;
  onClose: () => void;
}

type SortOption = 'name' | 'price' | 'change' | 'volume' | 'marketCap';
type ViewMode = 'grid' | 'list';

const ViewAllAssets: React.FC<ViewAllAssetsProps> = ({ category, visible, onClose }) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('marketCap');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showAssetDetails, setShowAssetDetails] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredData, setFilteredData] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      filterAndSortData();
    }
  }, [visible, searchQuery, sortBy, sortDirection, category.data]);

  const filterAndSortData = () => {
    setIsLoading(true);
    
    let filtered = [...category.data];

    // Filtrage par recherche
    if (searchQuery.trim()) {
      filtered = filtered.filter(asset =>
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Tri
    filtered.sort((a, b) => {
      let aValue: number | string;
      let bValue: number | string;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.current_price;
          bValue = b.current_price;
          break;
        case 'change':
          aValue = a.price_change_percentage_24h;
          bValue = b.price_change_percentage_24h;
          break;
        case 'volume':
          aValue = a.volume_24h || 0;
          bValue = b.volume_24h || 0;
          break;
        case 'marketCap':
          aValue = a.market_cap || 0;
          bValue = b.market_cap || 0;
          break;
        default:
          aValue = a.current_price;
          bValue = b.current_price;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else {
        return sortDirection === 'asc' 
          ? (aValue as number) - (bValue as number)
          : (bValue as number) - (aValue as number);
      }
    });

    setFilteredData(filtered);
    setTimeout(() => setIsLoading(false), 300);
  };

  const handleAssetPress = (asset: Asset) => {
    setSelectedAsset(asset);
    setShowAssetDetails(true);
  };

  const toggleFavorite = (assetId: string) => {
    setFavorites(prev => 
      prev.includes(assetId) 
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId]
    );
  };

  const handleSort = (option: SortOption) => {
    if (sortBy === option) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(option);
      setSortDirection('desc');
    }
    setShowFilters(false);
  };

  const formatPrice = (price: number, type: string) => {
    if (type === 'forex') {
      return price.toFixed(4);
    } else if (price < 1) {
      return `€${price.toFixed(6)}`;
    } else {
      return `€${price.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`;
    }
  };

  const formatMarketCap = (cap?: number) => {
    if (!cap) return 'N/A';
    if (cap > 1e12) return `€${(cap / 1e12).toFixed(1)}T`;
    if (cap > 1e9) return `€${(cap / 1e9).toFixed(1)}B`;
    if (cap > 1e6) return `€${(cap / 1e6).toFixed(1)}M`;
    return `€${cap.toLocaleString('fr-FR')}`;
  };

  const AssetListItem: React.FC<{ asset: Asset }> = ({ asset }) => {
    const isPositive = asset.price_change_percentage_24h >= 0;
    const variationColor = isPositive ? '#10b981' : '#ef4444';
    const isFavorite = favorites.includes(asset.id);

    return (
      <TouchableOpacity
        style={viewAllAssetsStyles.listItem}
        onPress={() => handleAssetPress(asset)}
        activeOpacity={0.8}
      >
        <View style={viewAllAssetsStyles.listItemLeft}>
          <View style={[viewAllAssetsStyles.assetIcon, { backgroundColor: `${variationColor}15` }]}>
            <Text style={[viewAllAssetsStyles.assetIconText, { color: variationColor }]}>
              {asset.symbol.substring(0, 2).toUpperCase()}
            </Text>
          </View>
          <View style={viewAllAssetsStyles.assetInfo}>
            <Text style={viewAllAssetsStyles.assetSymbol}>{asset.symbol}</Text>
            <Text style={viewAllAssetsStyles.assetName} numberOfLines={1}>{asset.name}</Text>
          </View>
        </View>

        <View style={viewAllAssetsStyles.listItemRight}>
          <View style={viewAllAssetsStyles.priceInfo}>
            <Text style={viewAllAssetsStyles.assetPrice}>{formatPrice(asset.current_price, asset.type)}</Text>
            <View style={[viewAllAssetsStyles.variationBadge, { backgroundColor: `${variationColor}15` }]}>
              {isPositive ? (
                <TrendingUp size={12} color={variationColor} strokeWidth={2} />
              ) : (
                <TrendingDown size={12} color={variationColor} strokeWidth={2} />
              )}
              <Text style={[viewAllAssetsStyles.variationText, { color: variationColor }]}>
                {isPositive ? '+' : ''}{asset.price_change_percentage_24h.toFixed(2)}%
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={viewAllAssetsStyles.favoriteButton}
            onPress={() => toggleFavorite(asset.id)}
          >
            <Star 
              size={16} 
              color={isFavorite ? '#f59e0b' : '#94a3b8'} 
              fill={isFavorite ? '#f59e0b' : 'none'}
              strokeWidth={2} 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={viewAllAssetsStyles.container}>
        {/* Header */}
        <View style={viewAllAssetsStyles.header}>
          <TouchableOpacity style={viewAllAssetsStyles.backButton} onPress={onClose}>
            <ArrowLeft size={24} color="#0f172a" strokeWidth={2} />
          </TouchableOpacity>
          <View style={viewAllAssetsStyles.headerTitle}>
            <Text style={viewAllAssetsStyles.title}>{category.title}</Text>
            <Text style={viewAllAssetsStyles.subtitle}>{filteredData.length} actifs</Text>
          </View>
          <View style={viewAllAssetsStyles.headerActions}>
            <TouchableOpacity
              style={viewAllAssetsStyles.headerActionButton}
              onPress={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? (
                <List size={20} color="#64748b" strokeWidth={2} />
              ) : (
                <Grid3X3 size={20} color="#64748b" strokeWidth={2} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={viewAllAssetsStyles.headerActionButton}
              onPress={() => setShowFilters(true)}
            >
              <Filter size={20} color="#64748b" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Barre de recherche */}
        <View style={viewAllAssetsStyles.searchContainer}>
          <View style={viewAllAssetsStyles.searchInputContainer}>
            <Search size={20} color="#94a3b8" strokeWidth={2} />
            <TextInput
              style={viewAllAssetsStyles.searchInput}
              placeholder={`Rechercher dans ${category.title.toLowerCase()}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94a3b8"
            />
          </View>
        </View>

        {/* Indicateurs de tri */}
        <View style={viewAllAssetsStyles.sortIndicator}>
          <Text style={viewAllAssetsStyles.sortText}>
            Trié par {sortBy === 'marketCap' ? 'capitalisation' : 
                     sortBy === 'change' ? 'variation' :
                     sortBy === 'volume' ? 'volume' :
                     sortBy === 'price' ? 'prix' : 'nom'}
          </Text>
          {sortDirection === 'asc' ? (
            <SortAsc size={16} color="#64748b" strokeWidth={2} />
          ) : (
            <SortDesc size={16} color="#64748b" strokeWidth={2} />
          )}
        </View>

        {/* Liste des actifs */}
        <View style={viewAllAssetsStyles.content}>
          {isLoading ? (
            <View style={viewAllAssetsStyles.loadingContainer}>
              <ActivityIndicator size="large" color="#3b82f6" />
              <Text style={viewAllAssetsStyles.loadingText}>Mise à jour des données...</Text>
            </View>
          ) : filteredData.length === 0 ? (
            <View style={viewAllAssetsStyles.emptyContainer}>
              <Eye size={48} color="#94a3b8" strokeWidth={1} />
              <Text style={viewAllAssetsStyles.emptyTitle}>Aucun résultat</Text>
              <Text style={viewAllAssetsStyles.emptySubtitle}>
                {searchQuery ? 'Essayez un autre terme de recherche' : 'Aucun actif disponible'}
              </Text>
            </View>
          ) : viewMode === 'grid' ? (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => (
                <AssetCard
                  name={item.name}
                  symbol={item.symbol}
                  price={item.current_price}
                  variation24h={item.price_change_percentage_24h}
                  type={item.type}
                  onPress={() => handleAssetPress(item)}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={viewAllAssetsStyles.gridRow}
              contentContainerStyle={viewAllAssetsStyles.gridContainer}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <FlatList
              data={filteredData}
              renderItem={({ item }) => <AssetListItem asset={item} />}
              keyExtractor={(item) => item.id}
              contentContainerStyle={viewAllAssetsStyles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Modal de filtres */}
        <Modal
          visible={showFilters}
          animationType="slide"
          transparent
          presentationStyle="overFullScreen"
        >
          <View style={viewAllAssetsStyles.filtersOverlay}>
            <View style={viewAllAssetsStyles.filtersModal}>
              <View style={viewAllAssetsStyles.filtersHeader}>
                <Text style={viewAllAssetsStyles.filtersTitle}>Trier par</Text>
                <TouchableOpacity onPress={() => setShowFilters(false)}>
                  <Text style={viewAllAssetsStyles.filtersClose}>Fermer</Text>
                </TouchableOpacity>
              </View>
              
              <View style={viewAllAssetsStyles.filterOptions}>
                {[
                  { key: 'marketCap', label: 'Capitalisation boursière' },
                  { key: 'price', label: 'Prix' },
                  { key: 'change', label: 'Variation 24h' },
                  { key: 'volume', label: 'Volume' },
                  { key: 'name', label: 'Nom' }
                ].map((option) => (
                  <TouchableOpacity
                    key={option.key}
                    style={[
                      viewAllAssetsStyles.filterOption,
                      sortBy === option.key && viewAllAssetsStyles.filterOptionActive
                    ]}
                    onPress={() => handleSort(option.key as SortOption)}
                  >
                    <Text style={[
                      viewAllAssetsStyles.filterOptionText,
                      sortBy === option.key && viewAllAssetsStyles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                    {sortBy === option.key && (
                      sortDirection === 'asc' ? (
                        <SortAsc size={16} color="#3b82f6" strokeWidth={2} />
                      ) : (
                        <SortDesc size={16} color="#3b82f6" strokeWidth={2} />
                      )
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
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
      </View>
    </Modal>
  );
};

export default ViewAllAssets;