import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowRight, Eye, EyeOff, TrendingUp } from 'lucide-react-native';
import { loginStyles } from '../styles/LoginStyle';

const API_URL = 'http://192.168.1.73:5000';

const Login: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Refs pour éviter les re-renders
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/home');
      } else {
        Alert.alert('Erreur de connexion', data.error || 'Email ou mot de passe incorrect.');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      Alert.alert('Erreur', 'Impossible de se connecter au serveur.');
    }
  };

  const handleRegister = () => {
    router.push('/register');
  };

  const handleContinueWithoutAccount = () => {
    router.push('/home');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <KeyboardAvoidingView
      style={loginStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <ScrollView
        contentContainerStyle={loginStyles.scrollContent}
        keyboardShouldPersistTaps="always"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Header */}
        <View style={loginStyles.header}>
          <View style={loginStyles.logoContainer}>
            <View style={loginStyles.logoIcon}>
              <TrendingUp size={24} color="#10b981" strokeWidth={2.5} />
            </View>
            <Text style={loginStyles.brandName}>MoneyQuest</Text>
          </View>

          <Text style={loginStyles.title}>Bon retour !</Text>
          <Text style={loginStyles.subtitle}>
            Connectez-vous pour accéder à votre portefeuille
          </Text>
        </View>

        {/* Form */}
        <View style={loginStyles.form}>
          <View style={loginStyles.inputGroup}>
            <Text style={loginStyles.label}>Email</Text>
            <View style={loginStyles.inputContainer}>
              <Mail size={18} color="#94a3b8" strokeWidth={2} />
              <TextInput
                ref={emailRef}
                style={loginStyles.input}
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
            </View>
          </View>

          <View style={loginStyles.inputGroup}>
            <Text style={loginStyles.label}>Mot de passe</Text>
            <View style={loginStyles.inputContainer}>
              <Lock size={18} color="#94a3b8" strokeWidth={2} />
              <TextInput
                ref={passwordRef}
                style={loginStyles.input}
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor="#94a3b8"
                returnKeyType="done"
                onSubmitEditing={isFormValid ? handleLogin : undefined}
              />
              <TouchableOpacity onPress={togglePasswordVisibility}>
                {showPassword ? (
                  <EyeOff size={18} color="#94a3b8" strokeWidth={2} />
                ) : (
                  <Eye size={18} color="#94a3b8" strokeWidth={2} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[
              loginStyles.loginButton,
              isFormValid && loginStyles.loginButtonActive
            ]}
            onPress={handleLogin}
            activeOpacity={0.9}
            disabled={!isFormValid}
          >
            <Text style={loginStyles.loginButtonText}>Se connecter</Text>
            <ArrowRight size={18} color="#ffffff" strokeWidth={2.5} />
          </TouchableOpacity>

          <TouchableOpacity style={loginStyles.forgotPassword}>
            <Text style={loginStyles.forgotPasswordText}>
              Mot de passe oublié ?
            </Text>
          </TouchableOpacity>
        </View>

        {/* Alternatives */}
        <View style={loginStyles.alternativeActions}>
          <Text style={loginStyles.registerPrompt}>Pas encore de compte ?</Text>

          <TouchableOpacity style={loginStyles.registerButton} onPress={handleRegister}>
            <Text style={loginStyles.registerText}>Créer un compte gratuit</Text>
            <ArrowRight size={16} color="#10b981" strokeWidth={2} />
          </TouchableOpacity>

          <TouchableOpacity style={loginStyles.demoButton} onPress={handleContinueWithoutAccount}>
            <Text style={loginStyles.demoText}>Continuer sans compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;