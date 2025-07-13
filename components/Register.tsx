import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, TrendingUp, Gift, Zap, Star } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerStyles } from '../styles/RegisterStyle';

const API_URL = 'http://192.168.1.73:5000';

const Register: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const firstNameRef = useRef<TextInput>(null);
  const pseudoRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const getProgressScore = () => {
    let score = 0;
    if (firstName.length > 0) score += 25;
    if (pseudo.length > 0) score += 25;
    if (email.includes('@') && email.includes('.')) score += 25;
    if (password.length >= 6) score += 25;
    return score;
  };

  const progressScore = getProgressScore();
  const isFormComplete = firstName.length > 0 && pseudo.length > 0 && email.includes('@') && email.includes('.') && password.length >= 6;

  const handleRegister = async () => {
    if (isLoading || !isFormComplete) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, pseudo, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Stocker le token + userId
        await AsyncStorage.setItem('authToken', data.token);
        await AsyncStorage.setItem('userId', data.user.id.toString());

        console.log('✅ Inscription réussie - Token et userId sauvegardés');
        Alert.alert('Succès', 'Compte créé avec succès 🎉');
        router.push('/home');
      } else {
        Alert.alert('Erreur', data.error || 'Erreur lors de l\'inscription.');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/login');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={registerStyles.container}>
      <KeyboardAvoidingView
        style={registerStyles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={registerStyles.scrollView}
          contentContainerStyle={registerStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
          bounces={true}
        >
          {/* Header */}
          <View style={registerStyles.header}>
            <View style={registerStyles.brandContainer}>
              <View style={registerStyles.logoIcon}>
                <TrendingUp size={28} color="#10b981" strokeWidth={2.5} />
              </View>
              <Text style={registerStyles.brandName}>MoneyQuest</Text>
            </View>

            <View style={registerStyles.valueProposition}>
              <Text style={registerStyles.title}>Rejoignez l'élite des investisseurs ! 🚀</Text>
              <Text style={registerStyles.subtitle}>
                Créez votre compte et recevez instantanément{'\n'}
                <Text style={registerStyles.highlight}>1000€ virtuels pour commencer</Text>
              </Text>
            </View>

            <View style={registerStyles.progressContainer}>
              <View style={registerStyles.progressHeader}>
                <Text style={registerStyles.progressLabel}>Progression de l'inscription</Text>
                <Text style={registerStyles.progressScore}>{progressScore}%</Text>
              </View>
              <View style={registerStyles.progressBar}>
                <View style={[registerStyles.progressFill, { width: `${progressScore}%` }]} />
              </View>
            </View>
          </View>

          {/* Formulaire */}
          <View style={registerStyles.form}>
            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.label}>Prénom <Text style={registerStyles.stepNumber}>1/4</Text></Text>
              <View style={registerStyles.inputContainer}>
                <User size={20} color="#94a3b8" strokeWidth={2} />
                <TextInput
                  ref={firstNameRef}
                  style={registerStyles.input}
                  placeholder="Votre prénom"
                  value={firstName}
                  onChangeText={setFirstName}
                  autoCapitalize="words"
                  autoCorrect={false}
                  placeholderTextColor="#94a3b8"
                  returnKeyType="next"
                  editable={!isLoading}
                  onSubmitEditing={() => pseudoRef.current?.focus()}
                />
                {firstName.length > 0 && <Text style={registerStyles.validationText}>✓</Text>}
              </View>
            </View>

            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.label}>Pseudo <Text style={registerStyles.stepNumber}>2/4</Text></Text>
              <View style={registerStyles.inputContainer}>
                <User size={20} color="#94a3b8" strokeWidth={2} />
                <TextInput
                  ref={pseudoRef}
                  style={registerStyles.input}
                  placeholder="Votre pseudo"
                  value={pseudo}
                  onChangeText={setPseudo}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#94a3b8"
                  returnKeyType="next"
                  editable={!isLoading}
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
                {pseudo.length > 0 && <Text style={registerStyles.validationText}>✓</Text>}
              </View>
            </View>

            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.label}>Email <Text style={registerStyles.stepNumber}>3/4</Text></Text>
              <View style={registerStyles.inputContainer}>
                <Mail size={20} color="#94a3b8" strokeWidth={2} />
                <TextInput
                  ref={emailRef}
                  style={registerStyles.input}
                  placeholder="votre@email.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#94a3b8"
                  returnKeyType="next"
                  editable={!isLoading}
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                {email.includes('@') && email.includes('.') && <Text style={registerStyles.validationText}>✓</Text>}
              </View>
            </View>

            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.label}>Mot de passe <Text style={registerStyles.stepNumber}>4/4</Text></Text>
              <View style={registerStyles.inputContainer}>
                <Lock size={20} color="#94a3b8" strokeWidth={2} />
                <TextInput
                  ref={passwordRef}
                  style={registerStyles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  placeholderTextColor="#94a3b8"
                  returnKeyType="done"
                  editable={!isLoading}
                  onSubmitEditing={isFormComplete ? handleRegister : undefined}
                />
                <TouchableOpacity onPress={togglePasswordVisibility} disabled={isLoading}>
                  {showPassword ? (
                    <EyeOff size={20} color="#94a3b8" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#94a3b8" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
              {password.length > 0 && password.length < 6 && (
                <Text style={registerStyles.passwordHint}>Minimum 6 caractères requis</Text>
              )}
            </View>

            {/* Récompenses */}
            <View style={registerStyles.rewardsPreview}>
              <Text style={registerStyles.rewardsTitle}>🎁 Vous allez recevoir :</Text>
              <View style={registerStyles.rewardsList}>
                <View style={registerStyles.rewardItem}>
                  <Gift size={16} color="#10b981" strokeWidth={2} />
                  <Text style={registerStyles.rewardText}>1000€ virtuels</Text>
                </View>
                <View style={registerStyles.rewardItem}>
                  <Zap size={16} color="#3b82f6" strokeWidth={2} />
                  <Text style={registerStyles.rewardText}>Accès premium gratuit</Text>
                </View>
                <View style={registerStyles.rewardItem}>
                  <Star size={16} color="#f59e0b" strokeWidth={2} />
                  <Text style={registerStyles.rewardText}>Badge "Pionnier"</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[registerStyles.registerButton, isFormComplete && registerStyles.registerButtonReady]}
              onPress={handleRegister}
              activeOpacity={0.9}
              disabled={!isFormComplete || isLoading}
            >
              <Text style={registerStyles.registerButtonText}>
                {isLoading ? 'Création du compte...' : 
                 isFormComplete ? 'Créer mon compte et recevoir 1000€ 🎉' : 'Complétez votre profil (4/4)'}
              </Text>
              {isFormComplete && !isLoading && <ArrowRight size={20} color="#ffffff" strokeWidth={2.5} />}
            </TouchableOpacity>
          </View>

          {/* Lien de connexion */}
          <View style={registerStyles.alternativeActions}>
            <View style={registerStyles.socialProof}>
              <Text style={registerStyles.socialProofText}>
                ⭐ Rejoint par +50,000 investisseurs passionnés
              </Text>
            </View>
            <TouchableOpacity 
              style={registerStyles.loginLink} 
              onPress={handleBackToLogin}
              disabled={isLoading}
            >
              <Text style={registerStyles.loginLinkText}>
                Déjà membre ? <Text style={registerStyles.loginLinkHighlight}>Se connecter</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Register;