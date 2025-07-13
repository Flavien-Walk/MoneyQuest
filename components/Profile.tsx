import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  Alert,
  Modal,
  Switch,
  Image,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  LogOut, 
  Trash2,
  Edit3,
  Camera,
  Award,
  TrendingUp,
  Target,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  ChevronRight,
  Save,
  X,
  AlertTriangle,
  Lock,
  Moon,
  Palette,
  CreditCard,
  Volume2,
  Eye,
  Languages
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { profileStyles } from '../styles/ProfileStyle';

const API_URL = 'http://192.168.1.73:5000';

interface UserProfile {
  id: string;
  firstName: string;
  pseudo: string;
  email: string;
  avatar: string;
  bio: string;
  memberSince: string;
  level: number;
  experience: number;
  badges: string[];
  stats: {
    totalTrades: number;
    successRate: number;
    totalValue: number;
    performance: number;
  };
  preferences: {
    notifications: boolean;
    darkMode: boolean;
    language: string;
    currency: string;
  };
}

interface BadgeConfig {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
  unlockCondition: string;
  isUnlocked: boolean;
}

const Profile: React.FC = () => {
  const router = useRouter();
  
  // États pour les données utilisateur
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // États pour les modales
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // États pour l'édition
  const [editForm, setEditForm] = useState({
    firstName: '',
    pseudo: '',
    email: '',
    avatar: '',
    bio: ''
  });

  // États pour les préférences
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    language: 'fr',
    currency: 'EUR'
  });

  // Configuration des badges avec conditions de déverrouillage
  const badgeConfigs: BadgeConfig[] = [
    {
      id: 'account_created',
      name: 'Bienvenue',
      emoji: '🎉',
      color: '#10b981',
      description: 'Compte créé avec succès',
      unlockCondition: 'Créer un compte',
      isUnlocked: true // Débloqué par défaut car on a un compte
    },
    {
      id: 'first_trade',
      name: 'Premier Trade',
      emoji: '🎯',
      color: '#3b82f6',
      description: 'Effectuer votre premier trade',
      unlockCondition: 'Effectuer 1 trade',
      isUnlocked: false
    },
    {
      id: 'profit_master',
      name: 'Maître du Profit',
      emoji: '💰',
      color: '#f59e0b',
      description: 'Réaliser un profit de 1000€',
      unlockCondition: 'Profit total > 1000€',
      isUnlocked: false
    },
    {
      id: 'early_bird',
      name: 'Lève-tôt',
      emoji: '🌅',
      color: '#f59e0b',
      description: 'Effectuer un trade avant 7h du matin',
      unlockCondition: 'Trade avant 7h',
      isUnlocked: false
    },
    {
      id: 'diamond_hands',
      name: 'Mains de Diamant',
      emoji: '💎',
      color: '#8b5cf6',
      description: 'Garder une position plus de 30 jours',
      unlockCondition: 'Position > 30 jours',
      isUnlocked: false
    },
    {
      id: 'streak_master',
      name: 'Série Gagnante',
      emoji: '🔥',
      color: '#ef4444',
      description: 'Réaliser 5 trades gagnants consécutifs',
      unlockCondition: '5 trades gagnants d\'affilée',
      isUnlocked: false
    },
    {
      id: 'risk_taker',
      name: 'Preneur de Risque',
      emoji: '⚡',
      color: '#f97316',
      description: 'Effectuer un trade à haut risque',
      unlockCondition: 'Trade haut risque',
      isUnlocked: false
    },
    {
      id: 'veteran',
      name: 'Vétéran',
      emoji: '🏆',
      color: '#d97706',
      description: 'Membre actif depuis plus d\'un an',
      unlockCondition: 'Membre depuis > 1 an',
      isUnlocked: false
    }
  ];

  // Charger les données utilisateur
  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      console.log('🔍 Chargement profil - Token:', !!token, 'UserId:', userId);

      if (!token || !userId) {
        console.log('❌ Token ou userId manquant');
        setIsAuthenticated(false);
        router.push('/login');
        return;
      }

      // Essayer d'abord l'endpoint profile s'il existe
      let response;
      try {
        response = await fetch(`${API_URL}/user/${userId}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      } catch (profileError) {
        console.log('⚠️ Endpoint /profile non disponible, tentative avec endpoint alternatif');
        // Si l'endpoint profile n'existe pas, essayer un endpoint alternatif
        try {
          response = await fetch(`${API_URL}/user/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
        } catch (altError) {
          throw new Error('Endpoints utilisateur non disponibles');
        }
      }

      console.log('📡 Réponse API status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Données profil reçues:', data);
        
        // Adapter les données du backend au format attendu
        const profile: UserProfile = {
          id: (data.id || data.user_id || userId).toString(),
          firstName: data.firstName || data.firstname || data.first_name || '',
          pseudo: data.pseudo || '',
          email: data.email || '',
          avatar: data.avatar || '',
          bio: data.bio || '',
          memberSince: data.createdAt || data.created_at || data.memberSince || new Date().toISOString(),
          level: data.level || 1,
          experience: data.experience || 0,
          badges: data.badges || ['account_created'], // Badge par défaut
          stats: {
            totalTrades: data.stats?.totalTrades || 0,
            successRate: data.stats?.successRate || 0,
            totalValue: data.stats?.totalValue || 0,
            performance: data.stats?.performance || 0
          },
          preferences: {
            notifications: data.preferences?.notifications !== false,
            darkMode: data.preferences?.darkMode || false,
            language: data.preferences?.language || 'fr',
            currency: data.preferences?.currency || 'EUR'
          }
        };
        
        console.log('✅ Profil formaté:', profile);
        setUserProfile(profile);
        setPreferences(profile.preferences);
        setIsAuthenticated(true);
        
      } else if (response.status === 404) {
        console.log('⚠️ Endpoint profil non trouvé, création d\'un profil par défaut');
        // Si l'endpoint n'existe pas, créer un profil par défaut
        const defaultProfile: UserProfile = {
          id: userId,
          firstName: '',
          pseudo: '',
          email: '',
          avatar: '',
          bio: '',
          memberSince: new Date().toISOString(),
          level: 1,
          experience: 0,
          badges: ['account_created'],
          stats: {
            totalTrades: 0,
            successRate: 0,
            totalValue: 0,
            performance: 0
          },
          preferences: {
            notifications: true,
            darkMode: false,
            language: 'fr',
            currency: 'EUR'
          }
        };
        
        setUserProfile(defaultProfile);
        setPreferences(defaultProfile.preferences);
        setIsAuthenticated(true);
        
      } else if (response.status === 401) {
        console.log('🚫 Token invalide ou expiré');
        // Token invalide ou expiré
        await AsyncStorage.removeItem('authToken');
        await AsyncStorage.removeItem('userId');
        setIsAuthenticated(false);
        router.push('/login');
        return;
      } else {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
    } catch (err) {
      console.error('❌ Erreur lors du chargement du profil:', err);
      
      // En cas d'erreur, essayer de créer un profil minimal
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        const minimalProfile: UserProfile = {
          id: userId,
          firstName: '',
          pseudo: '',
          email: '',
          avatar: '',
          bio: '',
          memberSince: new Date().toISOString(),
          level: 1,
          experience: 0,
          badges: ['account_created'],
          stats: {
            totalTrades: 0,
            successRate: 0,
            totalValue: 0,
            performance: 0
          },
          preferences: {
            notifications: true,
            darkMode: false,
            language: 'fr',
            currency: 'EUR'
          }
        };
        
        setUserProfile(minimalProfile);
        setPreferences(minimalProfile.preferences);
        setIsAuthenticated(true);
      } else {
        setError(err instanceof Error ? err.message : 'Erreur inconnue');
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  };

  // Initialiser le formulaire d'édition
  useEffect(() => {
    if (userProfile) {
      setEditForm({
        firstName: userProfile.firstName,
        pseudo: userProfile.pseudo,
        email: userProfile.email,
        avatar: userProfile.avatar,
        bio: userProfile.bio
      });
    }
  }, [userProfile]);

  // Charger les données au montage
  useEffect(() => {
    loadUserProfile();
  }, []);

  // Calculer le prochain niveau
  const getNextLevelProgress = () => {
    if (!userProfile) return 0;
    const baseXP = 200;
    const currentLevelXP = baseXP * userProfile.level;
    const nextLevelXP = baseXP * (userProfile.level + 1);
    const progress = ((userProfile.experience - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
    return Math.max(0, Math.min(100, progress));
  };

  // Fonction pour choisir une image
  const pickImage = async () => {
    try {
      // Demander les permissions
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission requise', 'Veuillez autoriser l\'accès à vos photos pour changer votre photo de profil.');
        return;
      }

      // Ouvrir la galerie
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1], // Format carré
        quality: 0.8,
        base64: true, // Pour pouvoir envoyer au serveur
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        const base64 = result.assets[0].base64;
        
        // Mettre à jour localement d'abord
        setEditForm(prev => ({ ...prev, avatar: imageUri }));
        
        // Optionnel: sauvegarder immédiatement
        if (base64) {
          await saveAvatar(base64);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la sélection d\'image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  // Fonction pour sauvegarder l'avatar
  const saveAvatar = async (base64Image: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
        return;
      }

      const response = await fetch(`${API_URL}/user/${userId}/avatar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          avatar: `data:image/jpeg;base64,${base64Image}`
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Mettre à jour le profil avec la nouvelle URL
        if (userProfile) {
          setUserProfile(prev => prev ? ({
            ...prev,
            avatar: data.avatarUrl || editForm.avatar
          }) : null);
        }
      }
    } catch (error) {
      console.error('Erreur sauvegarde avatar:', error);
    }
  };
  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Sauvegarder les modifications du profil
  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/user/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: editForm.firstName,
          pseudo: editForm.pseudo,
          email: editForm.email,
          avatar: editForm.avatar,
          bio: editForm.bio
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const updatedData = await response.json();
      
      // Mettre à jour le profil local
      if (userProfile) {
        setUserProfile(prev => prev ? ({
          ...prev,
          firstName: editForm.firstName,
          pseudo: editForm.pseudo,
          email: editForm.email,
          avatar: editForm.avatar,
          bio: editForm.bio
        }) : null);
      }
      
      setShowEditModal(false);
      Alert.alert('Succès', 'Profil mis à jour avec succès !');
    } catch (err) {
      console.error('Erreur sauvegarde profil:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de sauvegarder le profil');
    }
  };

  // Sauvegarder les préférences
  const handleSavePreferences = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/user/${userId}/preferences`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }
      
      // Mettre à jour les préférences locales
      if (userProfile) {
        setUserProfile(prev => prev ? ({
          ...prev,
          preferences: preferences
        }) : null);
      }
      
      setShowSettingsModal(false);
      Alert.alert('Succès', 'Préférences mises à jour !');
    } catch (err) {
      console.error('Erreur sauvegarde préférences:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de sauvegarder les préférences');
    }
  };

  // Déconnexion
  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Se déconnecter', 
          style: 'destructive',
          onPress: async () => {
            try {
              // Effacer les tokens stockés
              await AsyncStorage.removeItem('authToken');
              await AsyncStorage.removeItem('userId');
              
              router.push('/login');
            } catch (err) {
              console.error('Erreur déconnexion:', err);
              Alert.alert('Erreur', 'Impossible de se déconnecter');
            }
          }
        }
      ]
    );
  };

  // Suppression du compte
  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Toutes vos données seront définitivement supprimées.',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Supprimer', 
          style: 'destructive',
          onPress: () => {
            setShowDeleteModal(true);
          }
        }
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userId = await AsyncStorage.getItem('userId');

      if (!token || !userId) {
        Alert.alert('Erreur', 'Session expirée. Veuillez vous reconnecter.');
        router.push('/login');
        return;
      }

      const response = await fetch(`${API_URL}/user/${userId}/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la suppression');
      }

      // Supprimer les données locales
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('userId');

      Alert.alert('Compte supprimé', 'Votre compte a été supprimé avec succès.');
      setShowDeleteModal(false);
      router.push('/login');

    } catch (err) {
      console.error('Erreur suppression compte:', err);
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de supprimer le compte');
    }
  };

  // Redirection si non authentifié
  useEffect(() => {
    if (isAuthenticated === false) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  // Affichage du chargement
  if (loading || isAuthenticated === null) {
    return (
      <View style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#64748b' }}>Chargement...</Text>
      </View>
    );
  }

  // Affichage des erreurs
  if (error || !userProfile) {
    return (
      <View style={[profileStyles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <AlertTriangle size={48} color="#ef4444" />
        <Text style={{ marginTop: 16, fontSize: 16, color: '#ef4444', textAlign: 'center' }}>
          {error || 'Impossible de charger le profil'}
        </Text>
        <TouchableOpacity 
          style={{ marginTop: 16, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#3b82f6', borderRadius: 8 }}
          onPress={loadUserProfile}
        >
          <Text style={{ color: '#ffffff', fontWeight: '600' }}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={profileStyles.container}>
      <ScrollView 
        style={profileStyles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={profileStyles.scrollContent}
      >
        {/* Header avec avatar */}
        <View style={profileStyles.header}>
          <View style={profileStyles.avatarContainer}>
            {userProfile.avatar ? (
              <Image source={{ uri: userProfile.avatar }} style={profileStyles.avatar} />
            ) : (
              <View style={profileStyles.avatarPlaceholder}>
                <User size={48} color="#64748b" strokeWidth={1.5} />
              </View>
            )}
            <TouchableOpacity style={profileStyles.cameraButton} onPress={pickImage}>
              <Camera size={16} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>
          
          <View style={profileStyles.userInfo}>
            <Text style={profileStyles.userName}>
              {userProfile.pseudo || userProfile.firstName || 'Utilisateur'}
            </Text>
            <Text style={profileStyles.userEmail}>{userProfile.email}</Text>
            
            {/* Niveau et expérience */}
            <View style={profileStyles.levelContainer}>
              <View style={profileStyles.levelBadge}>
                <Star size={14} color="#f59e0b" strokeWidth={2} />
                <Text style={profileStyles.levelText}>Niveau {userProfile.level}</Text>
              </View>
              <Text style={profileStyles.experienceText}>{userProfile.experience} XP</Text>
            </View>
            
            {/* Barre de progression */}
            <View style={profileStyles.progressContainer}>
              <View style={profileStyles.progressBar}>
                <View 
                  style={[
                    profileStyles.progressFill, 
                    { width: `${getNextLevelProgress()}%` }
                  ]} 
                />
              </View>
              <Text style={profileStyles.progressText}>
                {Math.round(getNextLevelProgress())}% vers niveau {userProfile.level + 1}
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            style={profileStyles.editButton}
            onPress={() => setShowEditModal(true)}
          >
            <Edit3 size={18} color="#3b82f6" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Bio */}
        {userProfile.bio && (
          <View style={profileStyles.bioSection}>
            <Text style={profileStyles.bioText}>{userProfile.bio}</Text>
          </View>
        )}

        {/* Statistiques */}
        <View style={profileStyles.statsSection}>
          <Text style={profileStyles.sectionTitle}>Statistiques</Text>
          <View style={profileStyles.statsGrid}>
            <View style={profileStyles.statCard}>
              <TrendingUp size={20} color="#10b981" strokeWidth={2} />
              <Text style={profileStyles.statValue}>€{userProfile.stats.totalValue.toLocaleString('fr-FR')}</Text>
              <Text style={profileStyles.statLabel}>Valeur totale</Text>
            </View>
            <View style={profileStyles.statCard}>
              <Target size={20} color="#3b82f6" strokeWidth={2} />
              <Text style={profileStyles.statValue}>{userProfile.stats.totalTrades}</Text>
              <Text style={profileStyles.statLabel}>Trades</Text>
            </View>
            <View style={profileStyles.statCard}>
              <Award size={20} color="#f59e0b" strokeWidth={2} />
              <Text style={profileStyles.statValue}>
                {userProfile.stats.totalTrades > 0 ? `${userProfile.stats.successRate}%` : '0%'}
              </Text>
              <Text style={profileStyles.statLabel}>Taux de succès</Text>
            </View>
            <View style={profileStyles.statCard}>
              <Star size={20} color="#8b5cf6" strokeWidth={2} />
              <Text style={profileStyles.statValue}>
                {userProfile.stats.performance > 0 ? `+${userProfile.stats.performance}%` : '0%'}
              </Text>
              <Text style={profileStyles.statLabel}>Performance</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <View style={profileStyles.badgesSection}>
          <Text style={profileStyles.sectionTitle}>Badges & Récompenses</Text>
          <View style={profileStyles.badgesGrid}>
            {badgeConfigs.map((badge, index) => {
              const isUnlocked = userProfile.badges.includes(badge.id);
              return (
                <View 
                  key={index} 
                  style={[
                    profileStyles.badge, 
                    { 
                      backgroundColor: isUnlocked ? badge.color : '#f1f5f9',
                      opacity: isUnlocked ? 1 : 0.6
                    }
                  ]}
                >
                  {!isUnlocked && (
                    <View style={profileStyles.badgeLock}>
                      <Lock size={12} color="#64748b" strokeWidth={2} />
                    </View>
                  )}
                  <Text style={[
                    profileStyles.badgeEmoji,
                    { opacity: isUnlocked ? 1 : 0.4 }
                  ]}>
                    {badge.emoji}
                  </Text>
                  <Text style={[
                    profileStyles.badgeName,
                    { color: isUnlocked ? '#ffffff' : '#64748b' }
                  ]}>
                    {badge.name}
                  </Text>
                  <Text style={[
                    profileStyles.badgeCondition,
                    { color: isUnlocked ? '#ffffff' : '#64748b' }
                  ]}>
                    {badge.unlockCondition}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={profileStyles.infoSection}>
          <Text style={profileStyles.sectionTitle}>Informations</Text>
          
          <View style={profileStyles.infoItem}>
            <Mail size={18} color="#64748b" strokeWidth={2} />
            <Text style={profileStyles.infoText}>{userProfile.email}</Text>
          </View>
          
          <View style={profileStyles.infoItem}>
            <Calendar size={18} color="#64748b" strokeWidth={2} />
            <Text style={profileStyles.infoText}>
              Membre depuis {formatDate(userProfile.memberSince)}
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={profileStyles.actionsSection}>
          <TouchableOpacity 
            style={profileStyles.actionItem}
            onPress={() => setShowSettingsModal(true)}
          >
            <View style={profileStyles.actionLeft}>
              <View style={[profileStyles.actionIcon, { backgroundColor: '#f0f9ff' }]}>
                <Settings size={20} color="#3b82f6" strokeWidth={2} />
              </View>
              <Text style={profileStyles.actionText}>Préférences</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={profileStyles.actionItem}
            onPress={handleLogout}
          >
            <View style={profileStyles.actionLeft}>
              <View style={[profileStyles.actionIcon, { backgroundColor: '#fef3c7' }]}>
                <LogOut size={20} color="#f59e0b" strokeWidth={2} />
              </View>
              <Text style={profileStyles.actionText}>Se déconnecter</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity 
            style={profileStyles.actionItem}
            onPress={handleDeleteAccount}
          >
            <View style={profileStyles.actionLeft}>
              <View style={[profileStyles.actionIcon, { backgroundColor: '#fef2f2' }]}>
                <Trash2 size={20} color="#ef4444" strokeWidth={2} />
              </View>
              <Text style={[profileStyles.actionText, { color: '#ef4444' }]}>Supprimer le compte</Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={profileStyles.bottomSpacer} />
      </ScrollView>

      {/* Modal d'édition du profil */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <X size={24} color="#64748b" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={profileStyles.modalTitle}>Modifier le profil</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Save size={24} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={profileStyles.modalContent}>
            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Photo de profil</Text>
              <TouchableOpacity style={profileStyles.avatarUpload} onPress={pickImage}>
                {editForm.avatar ? (
                  <Image source={{ uri: editForm.avatar }} style={profileStyles.avatarPreview} />
                ) : (
                  <View style={profileStyles.avatarUploadPlaceholder}>
                    <Camera size={32} color="#94a3b8" strokeWidth={1.5} />
                    <Text style={profileStyles.avatarUploadText}>Ajouter une photo</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Prénom</Text>
              <TextInput
                style={profileStyles.input}
                value={editForm.firstName}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, firstName: text }))}
                placeholder="Votre prénom"
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Pseudo</Text>
              <TextInput
                style={profileStyles.input}
                value={editForm.pseudo}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, pseudo: text }))}
                placeholder="Votre pseudo"
                autoCapitalize="none"
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Email</Text>
              <TextInput
                style={profileStyles.input}
                value={editForm.email}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, email: text }))}
                placeholder="Votre email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Bio</Text>
              <TextInput
                style={[profileStyles.input, profileStyles.textArea]}
                value={editForm.bio}
                onChangeText={(text) => setEditForm(prev => ({ ...prev, bio: text }))}
                placeholder="Parlez-nous de vous..."
                multiline
                numberOfLines={4}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal des préférences */}
      <Modal
        visible={showSettingsModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowSettingsModal(false)}>
              <X size={24} color="#64748b" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={profileStyles.modalTitle}>Préférences</Text>
            <TouchableOpacity onPress={handleSavePreferences}>
              <Save size={24} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={profileStyles.modalContent}>
            <View style={profileStyles.preferenceSection}>
              <Text style={profileStyles.preferenceSectionTitle}>🔔 Notifications</Text>
              
              <View style={profileStyles.preferenceItem}>
                <View style={profileStyles.preferenceLeft}>
                  <Bell size={20} color="#3b82f6" strokeWidth={2} />
                  <View style={profileStyles.preferenceTextContainer}>
                    <Text style={profileStyles.preferenceText}>Notifications push</Text>
                    <Text style={profileStyles.preferenceSubtext}>Recevez des alertes en temps réel</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.notifications}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, notifications: value }))}
                  trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                  thumbColor={preferences.notifications ? '#ffffff' : '#94a3b8'}
                />
              </View>
            </View>

            <View style={profileStyles.preferenceSection}>
              <Text style={profileStyles.preferenceSectionTitle}>🎨 Apparence</Text>
              
              <View style={profileStyles.preferenceItem}>
                <View style={profileStyles.preferenceLeft}>
                  <Moon size={20} color="#8b5cf6" strokeWidth={2} />
                  <View style={profileStyles.preferenceTextContainer}>
                    <Text style={profileStyles.preferenceText}>Mode sombre</Text>
                    <Text style={profileStyles.preferenceSubtext}>Interface sombre pour vos yeux</Text>
                  </View>
                </View>
                <Switch
                  value={preferences.darkMode}
                  onValueChange={(value) => setPreferences(prev => ({ ...prev, darkMode: value }))}
                  trackColor={{ false: '#e2e8f0', true: '#8b5cf6' }}
                  thumbColor={preferences.darkMode ? '#ffffff' : '#94a3b8'}
                />
              </View>
            </View>

            <View style={profileStyles.preferenceSection}>
              <Text style={profileStyles.preferenceSectionTitle}>🌍 Région & Langue</Text>
              
              <View style={profileStyles.inputGroup}>
                <View style={profileStyles.preferenceInputHeader}>
                  <Languages size={18} color="#10b981" strokeWidth={2} />
                  <Text style={profileStyles.inputLabel}>Langue</Text>
                </View>
                <View style={profileStyles.selectContainer}>
                  <TextInput
                    style={profileStyles.selectInput}
                    value={preferences.language}
                    onChangeText={(text) => setPreferences(prev => ({ ...prev, language: text }))}
                    placeholder="Français"
                    editable={false}
                  />
                  <ChevronRight size={16} color="#94a3b8" strokeWidth={2} />
                </View>
                <Text style={profileStyles.inputHint}>Actuellement: Français</Text>
              </View>

              <View style={profileStyles.inputGroup}>
                <View style={profileStyles.preferenceInputHeader}>
                  <CreditCard size={18} color="#f59e0b" strokeWidth={2} />
                  <Text style={profileStyles.inputLabel}>Devise</Text>
                </View>
                <View style={profileStyles.selectContainer}>
                  <TextInput
                    style={profileStyles.selectInput}
                    value={preferences.currency}
                    onChangeText={(text) => setPreferences(prev => ({ ...prev, currency: text }))}
                    placeholder="EUR"
                    editable={false}
                  />
                  <ChevronRight size={16} color="#94a3b8" strokeWidth={2} />
                </View>
                <Text style={profileStyles.inputHint}>Euro (€) - Zone Euro</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de confirmation de suppression */}
      <Modal
        visible={showDeleteModal}
        animationType="fade"
        transparent
      >
        <View style={profileStyles.deleteModalOverlay}>
          <View style={profileStyles.deleteModalContent}>
            <View style={profileStyles.deleteModalIcon}>
              <AlertTriangle size={48} color="#ef4444" strokeWidth={2} />
            </View>
            
            <Text style={profileStyles.deleteModalTitle}>
              Supprimer définitivement ?
            </Text>
            
            <Text style={profileStyles.deleteModalText}>
              Cette action ne peut pas être annulée. Toutes vos données seront perdues.
            </Text>

            <View style={profileStyles.deleteModalButtons}>
              <TouchableOpacity 
                style={profileStyles.cancelButton}
                onPress={() => setShowDeleteModal(false)}
              >
                <Text style={profileStyles.cancelButtonText}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={profileStyles.deleteButton}
                onPress={confirmDeleteAccount}
              >
                <Text style={profileStyles.deleteButtonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;