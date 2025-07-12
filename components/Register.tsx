import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, TrendingUp, Gift, Zap, Star } from 'lucide-react-native';
import { registerStyles } from '../styles/RegisterStyle';

const Register: React.FC = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Refs pour navigation entre champs
  const firstNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  // Calcul du score de progression
  const getProgressScore = () => {
    let score = 0;
    if (firstName.length > 0) score += 33;
    if (email.includes('@') && email.includes('.')) score += 33;
    if (password.length >= 6) score += 34;
    return score;
  };

  const progressScore = getProgressScore();
  const isFormComplete = firstName.length > 0 && email.includes('@') && email.includes('.') && password.length >= 6;

  const handleRegister = async () => {
    try {
      const response = await fetch('http://192.168.1.73:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ firstName, email, password })
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Succès', 'Compte créé avec succès 🎉');
        router.push('/home');
      } else {
        Alert.alert('Erreur', data.error || 'Erreur lors de l inscription.');
      }
    } catch (error) {
      console.error('Erreur lors de l inscription:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
    }
  };

  const handleBackToLogin = () => {
    router.push('/home');
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
          {/* Header avec proposition de valeur */}
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

            {/* Barre de progression gamifiée */}
            <View style={registerStyles.progressContainer}>
              <View style={registerStyles.progressHeader}>
                <Text style={registerStyles.progressLabel}>Progression de l'inscription</Text>
                <Text style={registerStyles.progressScore}>{progressScore}%</Text>
              </View>
              <View style={registerStyles.progressBar}>
                <View 
                  style={[
                    registerStyles.progressFill, 
                    { width: `${progressScore}%` }
                  ]} 
                />
              </View>
            </View>
          </View>

          {/* Formulaire avec feedback visuel */}
          <View style={registerStyles.form}>
            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.label}>
                Prénom <Text style={registerStyles.stepNumber}>1/3</Text>
              </Text>
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
                  onSubmitEditing={() => emailRef.current?.focus()}
                />
                {firstName.length > 0 && (
                  <View style={registerStyles.validationIcon}>
                    <Text style={registerStyles.validationText}>✓</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.label}>
                Email <Text style={registerStyles.stepNumber}>2/3</Text>
              </Text>
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
                  onSubmitEditing={() => passwordRef.current?.focus()}
                />
                {email.includes('@') && email.includes('.') && (
                  <View style={registerStyles.validationIcon}>
                    <Text style={registerStyles.validationText}>✓</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={registerStyles.inputGroup}>
              <Text style={registerStyles.label}>
                Mot de passe <Text style={registerStyles.stepNumber}>3/3</Text>
              </Text>
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
                  onSubmitEditing={isFormComplete ? handleRegister : undefined}
                />
                <TouchableOpacity onPress={togglePasswordVisibility}>
                  {showPassword ? (
                    <EyeOff size={20} color="#94a3b8" strokeWidth={2} />
                  ) : (
                    <Eye size={20} color="#94a3b8" strokeWidth={2} />
                  )}
                </TouchableOpacity>
              </View>
              {password.length > 0 && password.length < 6 && (
                <Text style={registerStyles.passwordHint}>
                  Minimum 6 caractères requis
                </Text>
              )}
            </View>

            {/* Récompenses à venir */}
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

            {/* CTA Principal avec état dynamique */}
            <TouchableOpacity 
              style={[
                registerStyles.registerButton,
                isFormComplete && registerStyles.registerButtonReady
              ]}
              onPress={handleRegister}
              activeOpacity={0.9}
              disabled={!isFormComplete}
            >
              <Text style={registerStyles.registerButtonText}>
                {isFormComplete ? 'Créer mon compte et recevoir 1000€ 🎉' : 'Complétez votre profil'}
              </Text>
              {isFormComplete && (
                <ArrowRight size={20} color="#ffffff" strokeWidth={2.5} />
              )}
            </TouchableOpacity>
          </View>

          {/* Actions alternatives */}
          <View style={registerStyles.alternativeActions}>
            <View style={registerStyles.socialProof}>
              <Text style={registerStyles.socialProofText}>
                ⭐ Rejoint par +50,000 investisseurs passionnés
              </Text>
            </View>
            
            <TouchableOpacity 
              style={registerStyles.loginLink}
              onPress={handleBackToLogin}
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