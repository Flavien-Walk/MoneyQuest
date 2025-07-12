import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  Switch
} from 'react-native';
import {
  User,
  Edit3,
  Settings,
  Shield,
  Award,
  TrendingUp,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Bell,
  Lock,
  LogOut,
  Camera,
  Save,
  X,
  Trash2
} from 'lucide-react-native';
import { profileStyles } from '../styles/ProfileStyle';

// Configuration de l'API
const API_BASE_URL = 'http://localhost:5000'; // Change selon ton serveur

interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string;
  dateOfBirth: string;
  location: string;
  currency: string;
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
  portfolio: {
    totalValue: number;
    totalInvested: number;
    performance: number;
    positions: number;
  };
  level: number;
  experience: number;
  badges: string[];
  achievements: any[];
  stats: {
    totalTrades: number;
    successfulTrades: number;
    successRate: number;
    favoriteAssets: string[];
    loginStreak: number;
    lastLoginDate: string;
  };
  memberSince: string;
  lastUpdated: string;
}

interface ProfileProps {
  userId: string; // ID de l'utilisateur connecté
}

const Profile: React.FC<ProfileProps> = ({ userId }) => {
  // États
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  
  // États pour l'édition
  const [editData, setEditData] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    phone: '',
    location: '',
  });

  // États pour les paramètres
  const [settingsData, setSettingsData] = useState({
    currency: 'EUR',
    language: 'fr',
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });

  // États pour le changement de mot de passe
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Chargement du profil
  const loadProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/profile`);
      const data = await response.json();
      
      if (response.ok) {
        setProfile(data.profile);
        setEditData({
          firstName: data.profile.firstName,
          lastName: data.profile.lastName,
          bio: data.profile.bio,
          phone: data.profile.phone,
          location: data.profile.location,
        });
        setSettingsData({
          currency: data.profile.currency,
          language: data.profile.language,
          notifications: data.profile.notifications
        });
        console.log('✅ Profil chargé:', data.profile.fullName);
      } else {
        Alert.alert('Erreur', data.error || 'Impossible de charger le profil');
      }
    } catch (error) {
      console.error('Erreur load profile:', error);
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Actualisation
  const handleRefresh = () => {
    setIsRefreshing(true);
    loadProfile();
  };

  // Sauvegarde du profil
  const saveProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setProfile(prev => prev ? { ...prev, ...data.profile } : null);
        setShowEditModal(false);
        Alert.alert('Succès', 'Profil mis à jour avec succès');
      } else {
        Alert.alert('Erreur', data.error || 'Impossible de sauvegarder');
      }
    } catch (error) {
      console.error('Erreur save profile:', error);
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    }
  };

  // Sauvegarde des paramètres
  const saveSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      const data = await response.json();
      
      if (response.ok) {
        setProfile(prev => prev ? { ...prev, ...data.profile } : null);
        setShowSettingsModal(false);
        Alert.alert('Succès', 'Paramètres mis à jour');
      } else {
        Alert.alert('Erreur', data.error || 'Impossible de sauvegarder');
      }
    } catch (error) {
      console.error('Erreur save settings:', error);
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    }
  };

  // Changement de mot de passe
  const changePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/user/${userId}/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        Alert.alert('Succès', 'Mot de passe modifié avec succès');
      } else {
        Alert.alert('Erreur', data.error || 'Impossible de changer le mot de passe');
      }
    } catch (error) {
      console.error('Erreur change password:', error);
      Alert.alert('Erreur', 'Problème de connexion au serveur');
    }
  };

  // Formatage des données
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: profile?.currency || 'EUR'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getBadgeEmoji = (badge: string) => {
    const badgeEmojis: { [key: string]: string } = {
      'first_trade': '🎯',
      'week_streak': '🔥',
      'profitable_month': '💰',
      'risk_master': '🛡️',
      'crypto_expert': '₿',
      'stock_wizard': '📈',
      'forex_trader': '💱'
    };
    return badgeEmojis[badge] || '🏆';
  };

  // Chargement initial
  useEffect(() => {
    loadProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <View style={profileStyles.loadingContainer}>
        <Text style={profileStyles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={profileStyles.errorContainer}>
        <Text style={profileStyles.errorText}>Impossible de charger le profil</Text>
        <TouchableOpacity style={profileStyles.retryButton} onPress={loadProfile}>
          <Text style={profileStyles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={profileStyles.container}>
      <ScrollView
        style={profileStyles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="#3b82f6"
            colors={['#3b82f6']}
          />
        }
      >
        {/* Header du profil */}
        <View style={profileStyles.profileHeader}>
          <View style={profileStyles.avatarContainer}>
            {profile.avatar ? (
              <Image source={{ uri: profile.avatar }} style={profileStyles.avatar} />
            ) : (
              <View style={profileStyles.avatarPlaceholder}>
                <User size={40} color="#64748b" strokeWidth={2} />
              </View>
            )}
            <TouchableOpacity style={profileStyles.avatarEditButton}>
              <Camera size={16} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={profileStyles.profileInfo}>
            <Text style={profileStyles.profileName}>{profile.fullName}</Text>
            <Text style={profileStyles.profileEmail}>{profile.email}</Text>
            {profile.bio && (
              <Text style={profileStyles.profileBio}>{profile.bio}</Text>
            )}
          </View>

          <View style={profileStyles.profileActions}>
            <TouchableOpacity
              style={profileStyles.actionButton}
              onPress={() => setShowEditModal(true)}
            >
              <Edit3 size={16} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity
              style={profileStyles.actionButton}
              onPress={() => setShowSettingsModal(true)}
            >
              <Settings size={16} color="#64748b" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats du niveau et XP */}
        <View style={profileStyles.levelCard}>
          <View style={profileStyles.levelHeader}>
            <Award size={20} color="#f59e0b" strokeWidth={2} />
            <Text style={profileStyles.levelTitle}>Niveau {profile.level}</Text>
            <Text style={profileStyles.experienceText}>{profile.experience} XP</Text>
          </View>
          <View style={profileStyles.progressBar}>
            <View 
              style={[
                profileStyles.progressFill, 
                { width: `${((profile.experience % 1000) / 1000) * 100}%` }
              ]} 
            />
          </View>
          <Text style={profileStyles.progressText}>
            {1000 - (profile.experience % 1000)} XP pour le niveau suivant
          </Text>
        </View>

        {/* Portefeuille */}
        <View style={profileStyles.portfolioCard}>
          <View style={profileStyles.cardHeader}>
            <TrendingUp size={20} color="#10b981" strokeWidth={2} />
            <Text style={profileStyles.cardTitle}>Portefeuille</Text>
          </View>
          <View style={profileStyles.portfolioStats}>
            <View style={profileStyles.statItem}>
              <Text style={profileStyles.statValue}>
                {formatCurrency(profile.portfolio.totalValue)}
              </Text>
              <Text style={profileStyles.statLabel}>Valeur totale</Text>
            </View>
            <View style={profileStyles.statItem}>
              <Text style={[
                profileStyles.statValue,
                { color: profile.portfolio.performance >= 0 ? '#10b981' : '#ef4444' }
              ]}>
                {profile.portfolio.performance >= 0 ? '+' : ''}{profile.portfolio.performance.toFixed(2)}%
              </Text>
              <Text style={profileStyles.statLabel}>Performance</Text>
            </View>
            <View style={profileStyles.statItem}>
              <Text style={profileStyles.statValue}>{profile.portfolio.positions}</Text>
              <Text style={profileStyles.statLabel}>Positions</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        {profile.badges.length > 0 && (
          <View style={profileStyles.badgesCard}>
            <View style={profileStyles.cardHeader}>
              <Award size={20} color="#8b5cf6" strokeWidth={2} />
              <Text style={profileStyles.cardTitle}>Badges</Text>
            </View>
            <View style={profileStyles.badgesGrid}>
              {profile.badges.map((badge, index) => (
                <View key={index} style={profileStyles.badge}>
                  <Text style={profileStyles.badgeEmoji}>{getBadgeEmoji(badge)}</Text>
                  <Text style={profileStyles.badgeText}>{badge.replace('_', ' ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Statistiques */}
        <View style={profileStyles.statsCard}>
          <View style={profileStyles.cardHeader}>
            <TrendingUp size={20} color="#3b82f6" strokeWidth={2} />
            <Text style={profileStyles.cardTitle}>Statistiques</Text>
          </View>
          <View style={profileStyles.statsGrid}>
            <View style={profileStyles.statRow}>
              <Text style={profileStyles.statRowLabel}>Total des trades</Text>
              <Text style={profileStyles.statRowValue}>{profile.stats.totalTrades}</Text>
            </View>
            <View style={profileStyles.statRow}>
              <Text style={profileStyles.statRowLabel}>Taux de réussite</Text>
              <Text style={profileStyles.statRowValue}>{profile.stats.successRate}%</Text>
            </View>
            <View style={profileStyles.statRow}>
              <Text style={profileStyles.statRowLabel}>Série de connexions</Text>
              <Text style={profileStyles.statRowValue}>{profile.stats.loginStreak} jours</Text>
            </View>
          </View>
        </View>

        {/* Informations personnelles */}
        <View style={profileStyles.infoCard}>
          <View style={profileStyles.cardHeader}>
            <User size={20} color="#64748b" strokeWidth={2} />
            <Text style={profileStyles.cardTitle}>Informations</Text>
          </View>
          <View style={profileStyles.infoList}>
            {profile.phone && (
              <View style={profileStyles.infoItem}>
                <Phone size={16} color="#64748b" strokeWidth={2} />
                <Text style={profileStyles.infoText}>{profile.phone}</Text>
              </View>
            )}
            {profile.location && (
              <View style={profileStyles.infoItem}>
                <MapPin size={16} color="#64748b" strokeWidth={2} />
                <Text style={profileStyles.infoText}>{profile.location}</Text>
              </View>
            )}
            <View style={profileStyles.infoItem}>
              <Calendar size={16} color="#64748b" strokeWidth={2} />
              <Text style={profileStyles.infoText}>
                Membre depuis {formatDate(profile.memberSince)}
              </Text>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={profileStyles.actionsCard}>
          <TouchableOpacity
            style={profileStyles.actionRow}
            onPress={() => setShowPasswordModal(true)}
          >
            <Lock size={20} color="#64748b" strokeWidth={2} />
            <Text style={profileStyles.actionText}>Changer le mot de passe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={profileStyles.actionRow}>
            <Shield size={20} color="#64748b" strokeWidth={2} />
            <Text style={profileStyles.actionText}>Sécurité du compte</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[profileStyles.actionRow, profileStyles.dangerAction]}>
            <LogOut size={20} color="#ef4444" strokeWidth={2} />
            <Text style={[profileStyles.actionText, profileStyles.dangerText]}>
              Se déconnecter
            </Text>
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
            <TouchableOpacity onPress={saveProfile}>
              <Save size={24} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={profileStyles.modalContent}>
            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Prénom</Text>
              <TextInput
                style={profileStyles.textInput}
                value={editData.firstName}
                onChangeText={(text) => setEditData(prev => ({ ...prev, firstName: text }))}
                placeholder="Votre prénom"
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Nom</Text>
              <TextInput
                style={profileStyles.textInput}
                value={editData.lastName}
                onChangeText={(text) => setEditData(prev => ({ ...prev, lastName: text }))}
                placeholder="Votre nom"
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Bio</Text>
              <TextInput
                style={[profileStyles.textInput, profileStyles.textArea]}
                value={editData.bio}
                onChangeText={(text) => setEditData(prev => ({ ...prev, bio: text }))}
                placeholder="Parlez-nous de vous..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Téléphone</Text>
              <TextInput
                style={profileStyles.textInput}
                value={editData.phone}
                onChangeText={(text) => setEditData(prev => ({ ...prev, phone: text }))}
                placeholder="+33 6 12 34 56 78"
                keyboardType="phone-pad"
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Localisation</Text>
              <TextInput
                style={profileStyles.textInput}
                value={editData.location}
                onChangeText={(text) => setEditData(prev => ({ ...prev, location: text }))}
                placeholder="Paris, France"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal des paramètres */}
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
            <Text style={profileStyles.modalTitle}>Paramètres</Text>
            <TouchableOpacity onPress={saveSettings}>
              <Save size={24} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={profileStyles.modalContent}>
            <Text style={profileStyles.sectionTitle}>Notifications</Text>
            
            <View style={profileStyles.switchRow}>
              <View style={profileStyles.switchInfo}>
                <Mail size={20} color="#64748b" strokeWidth={2} />
                <Text style={profileStyles.switchLabel}>Notifications email</Text>
              </View>
              <Switch
                value={settingsData.notifications.email}
                onValueChange={(value) => 
                  setSettingsData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, email: value }
                  }))
                }
                trackColor={{ false: '#f1f5f9', true: '#3b82f6' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={profileStyles.switchRow}>
              <View style={profileStyles.switchInfo}>
                <Bell size={20} color="#64748b" strokeWidth={2} />
                <Text style={profileStyles.switchLabel}>Notifications push</Text>
              </View>
              <Switch
                value={settingsData.notifications.push}
                onValueChange={(value) => 
                  setSettingsData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, push: value }
                  }))
                }
                trackColor={{ false: '#f1f5f9', true: '#3b82f6' }}
                thumbColor="#ffffff"
              />
            </View>

            <View style={profileStyles.switchRow}>
              <View style={profileStyles.switchInfo}>
                <Phone size={20} color="#64748b" strokeWidth={2} />
                <Text style={profileStyles.switchLabel}>Notifications SMS</Text>
              </View>
              <Switch
                value={settingsData.notifications.sms}
                onValueChange={(value) => 
                  setSettingsData(prev => ({
                    ...prev,
                    notifications: { ...prev.notifications, sms: value }
                  }))
                }
                trackColor={{ false: '#f1f5f9', true: '#3b82f6' }}
                thumbColor="#ffffff"
              />
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Modal de changement de mot de passe */}
      <Modal
        visible={showPasswordModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={profileStyles.modalContainer}>
          <View style={profileStyles.modalHeader}>
            <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
              <X size={24} color="#64748b" strokeWidth={2} />
            </TouchableOpacity>
            <Text style={profileStyles.modalTitle}>Changer le mot de passe</Text>
            <TouchableOpacity onPress={changePassword}>
              <Save size={24} color="#3b82f6" strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={profileStyles.modalContent}>
            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Mot de passe actuel</Text>
              <TextInput
                style={profileStyles.textInput}
                value={passwordData.currentPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, currentPassword: text }))}
                placeholder="Votre mot de passe actuel"
                secureTextEntry
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Nouveau mot de passe</Text>
              <TextInput
                style={profileStyles.textInput}
                value={passwordData.newPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, newPassword: text }))}
                placeholder="Nouveau mot de passe"
                secureTextEntry
              />
            </View>

            <View style={profileStyles.inputGroup}>
              <Text style={profileStyles.inputLabel}>Confirmer le mot de passe</Text>
              <TextInput
                style={profileStyles.textInput}
                value={passwordData.confirmPassword}
                onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirmPassword: text }))}
                placeholder="Confirmer le nouveau mot de passe"
                secureTextEntry
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;