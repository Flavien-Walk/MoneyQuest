import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  RefreshControl
} from 'react-native';
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  RefreshCw
} from 'lucide-react-native';
import { newsListStyles } from '../styles/NewsListStyle';

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

interface NewsListProps {
  articles: NewsArticle[];
  visible: boolean;
  onClose: () => void;
  onArticlePress: (article: NewsArticle) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

const NewsList: React.FC<NewsListProps> = ({ 
  articles, 
  visible, 
  onClose, 
  onArticlePress,
  onRefresh,
  isRefreshing = false
}) => {
  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return 'À l\'instant';
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) {
        return 'Hier';
      } else if (diffDays < 7) {
        return `Il y a ${diffDays} jours`;
      } else {
        return date.toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short'
        });
      }
    }
  };

  // Formatage de la date complète
  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={newsListStyles.container}>
        {/* Header */}
        <View style={newsListStyles.header}>
          <TouchableOpacity style={newsListStyles.backButton} onPress={onClose}>
            <ArrowLeft size={24} color="#1e293b" strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={newsListStyles.headerContent}>
            <Text style={newsListStyles.headerTitle}>Actualités</Text>
            <Text style={newsListStyles.headerSubtitle}>
              {articles.length} article{articles.length > 1 ? 's' : ''}
            </Text>
          </View>
          
          {onRefresh && (
            <TouchableOpacity 
              style={newsListStyles.refreshButton} 
              onPress={onRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw 
                size={20} 
                color="#64748b" 
                strokeWidth={2}
                style={isRefreshing ? newsListStyles.refreshing : undefined}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Liste des actualités */}
        <ScrollView 
          style={newsListStyles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                tintColor="#3b82f6"
                colors={['#3b82f6']}
              />
            ) : undefined
          }
        >
          {articles.length > 0 ? (
            <View style={newsListStyles.articlesList}>
              {articles.map((article, index) => (
                <TouchableOpacity
                  key={article.id}
                  style={[
                    newsListStyles.articleCard,
                    index === articles.length - 1 && newsListStyles.lastArticleCard
                  ]}
                  onPress={() => onArticlePress(article)}
                  activeOpacity={0.8}
                >
                  {/* Image de l'article */}
                  {article.urlToImage && (
                    <View style={newsListStyles.articleImageContainer}>
                      <Image
                        source={{ uri: article.urlToImage }}
                        style={newsListStyles.articleImage}
                        resizeMode="cover"
                      />
                      <View style={newsListStyles.imageOverlay}>
                        <View style={newsListStyles.sourceBadge}>
                          <Text style={newsListStyles.sourceText}>{article.source.name}</Text>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Contenu de l'article */}
                  <View style={newsListStyles.articleContent}>
                    {/* Header avec source et temps */}
                    <View style={newsListStyles.articleHeader}>
                      {!article.urlToImage && (
                        <Text style={newsListStyles.sourceOnly}>{article.source.name}</Text>
                      )}
                      <View style={newsListStyles.timeContainer}>
                        <Clock size={12} color="#64748b" strokeWidth={2} />
                        <Text style={newsListStyles.timeText}>{formatDate(article.publishedAt)}</Text>
                      </View>
                    </View>

                    {/* Titre */}
                    <Text style={newsListStyles.articleTitle} numberOfLines={3}>
                      {article.title}
                    </Text>

                    {/* Description */}
                    <Text style={newsListStyles.articleDescription} numberOfLines={2}>
                      {article.description}
                    </Text>

                    {/* Footer avec date complète */}
                    <View style={newsListStyles.articleFooter}>
                      <Text style={newsListStyles.fullDate}>
                        {formatFullDate(article.publishedAt)}
                      </Text>
                      <View style={newsListStyles.readMoreContainer}>
                        <Text style={newsListStyles.readMoreText}>Lire l'article</Text>
                        <ExternalLink size={12} color="#3b82f6" strokeWidth={2} />
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={newsListStyles.emptyState}>
              <Text style={newsListStyles.emptyTitle}>Aucune actualité</Text>
              <Text style={newsListStyles.emptySubtitle}>
                Tirez vers le bas pour actualiser
              </Text>
            </View>
          )}

          <View style={newsListStyles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default NewsList;