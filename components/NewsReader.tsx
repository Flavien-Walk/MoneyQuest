import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  Linking,
  Alert
} from 'react-native';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Eye,
  Share2
} from 'lucide-react-native';
import { newsReaderStyles } from '../styles/NewsReaderStyle';

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

interface NewsReaderProps {
  article: NewsArticle | null;
  visible: boolean;
  onClose: () => void;
}

const NewsReader: React.FC<NewsReaderProps> = ({ article, visible, onClose }) => {
  if (!article) return null;

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
      return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    }
  };

  // Ouvrir l'article original
  const openOriginalArticle = async () => {
    try {
      const supported = await Linking.canOpenURL(article.url);
      if (supported) {
        await Linking.openURL(article.url);
      } else {
        Alert.alert('Erreur', 'Impossible d\'ouvrir le lien');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ouvrir le lien');
    }
  };

  // Partager l'article
  const shareArticle = () => {
    Alert.alert('Partager', `Partager: ${article.title}`);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="fullScreen">
      <View style={newsReaderStyles.container}>
        {/* Header */}
        <View style={newsReaderStyles.header}>
          <TouchableOpacity style={newsReaderStyles.backButton} onPress={onClose}>
            <ArrowLeft size={24} color="#1e293b" strokeWidth={2} />
          </TouchableOpacity>
          
          <View style={newsReaderStyles.headerActions}>
            <TouchableOpacity style={newsReaderStyles.actionButton} onPress={shareArticle}>
              <Share2 size={20} color="#64748b" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={newsReaderStyles.actionButton} onPress={openOriginalArticle}>
              <ExternalLink size={20} color="#64748b" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={newsReaderStyles.content} showsVerticalScrollIndicator={false}>
          {/* Image principale */}
          {article.urlToImage && (
            <View style={newsReaderStyles.imageContainer}>
              <Image 
                source={{ uri: article.urlToImage }}
                style={newsReaderStyles.mainImage}
                resizeMode="cover"
              />
              <View style={newsReaderStyles.imageOverlay}>
                <View style={newsReaderStyles.sourceBadge}>
                  <Text style={newsReaderStyles.sourceText}>{article.source.name}</Text>
                </View>
              </View>
            </View>
          )}

          {/* Contenu de l'article */}
          <View style={newsReaderStyles.articleContent}>
            {/* Titre */}
            <Text style={newsReaderStyles.title}>{article.title}</Text>
            
            {/* Métadonnées */}
            <View style={newsReaderStyles.metadata}>
              <View style={newsReaderStyles.metadataItem}>
                <Clock size={14} color="#64748b" strokeWidth={2} />
                <Text style={newsReaderStyles.metadataText}>
                  {formatDate(article.publishedAt)}
                </Text>
              </View>
              <View style={newsReaderStyles.metadataItem}>
                <Eye size={14} color="#64748b" strokeWidth={2} />
                <Text style={newsReaderStyles.metadataText}>Lecture: 2 min</Text>
              </View>
            </View>

            {/* Description */}
            <Text style={newsReaderStyles.description}>{article.description}</Text>
            
            {/* Contenu principal */}
            <View style={newsReaderStyles.contentSection}>
              <Text style={newsReaderStyles.contentText}>
                {article.content.replace('[+... chars]', '').replace('[Removed]', '')}
              </Text>
              
              {/* Bouton pour lire l'article complet */}
              <TouchableOpacity 
                style={newsReaderStyles.readMoreButton}
                onPress={openOriginalArticle}
              >
                <Text style={newsReaderStyles.readMoreText}>
                  Lire l'article complet
                </Text>
                <ExternalLink size={16} color="#3b82f6" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Source et attribution */}
            <View style={newsReaderStyles.attribution}>
              <Text style={newsReaderStyles.attributionText}>
                Source: {article.source.name}
              </Text>
              <Text style={newsReaderStyles.attributionSubtext}>
                Article publié le {new Date(article.publishedAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>

          <View style={newsReaderStyles.bottomSpacer} />
        </ScrollView>
      </View>
    </Modal>
  );
};

export default NewsReader;