import React from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { 
  TrendingUp, 
  ArrowRight, 
  Star, 
  Shield,
  DollarSign,
  PieChart
} from 'lucide-react-native';
import { introStyles } from '../styles/IntroStyle';

const Intro: React.FC = () => {
  const router = useRouter();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(30)).current;
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleRegisterPress = () => {
    router.push('/register');
  };

  const handleLoginPress = () => {
    router.push('/login');
  };

  const handleContinueWithoutAccount = () => {
    router.push('/home');
  };

  return (
    <View style={introStyles.container}>
      <ScrollView
        style={introStyles.scrollView}
        contentContainerStyle={introStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={[
          introStyles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}>
          {/* Hero Section Clean */}
          <View style={introStyles.heroSection}>
            {/* Logo Finance */}
            <View style={introStyles.logoContainer}>
              <View style={introStyles.logoIcon}>
                <TrendingUp size={40} color="#ffffff" strokeWidth={2.5} />
              </View>
              <Text style={introStyles.brandName}>MoneyQuest</Text>
              <Text style={introStyles.tagline}>Investissement simplifié</Text>
            </View>

            {/* Value Proposition Épurée */}
            <View style={introStyles.valueSection}>
              <Text style={introStyles.mainHeadline}>
                Apprenez à investir
              </Text>
              <Text style={introStyles.subHeadline}>
                avec <Text style={introStyles.highlight}>1000€ virtuels</Text>
              </Text>
              <Text style={introStyles.description}>
                Maîtrisez les marchés financiers sans risque.{'\n'}
                Données réelles, gains virtuels, apprentissage réel.
              </Text>
            </View>

            {/* Features Essentielles */}
            <View style={introStyles.featuresGrid}>
              <View style={introStyles.featureCard}>
                <DollarSign size={24} color="#10b981" strokeWidth={2} />
                <Text style={introStyles.featureTitle}>Capital virtuel</Text>
                <Text style={introStyles.featureDesc}>1000€ pour débuter</Text>
              </View>
              
              <View style={introStyles.featureCard}>
                <PieChart size={24} color="#3b82f6" strokeWidth={2} />
                <Text style={introStyles.featureTitle}>Marchés réels</Text>
                <Text style={introStyles.featureDesc}>Données en temps réel</Text>
              </View>
            </View>
          </View>

          {/* CTA Section Épurée */}
          <View style={introStyles.ctaSection}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <TouchableOpacity 
                style={introStyles.primaryButton}
                onPress={handleRegisterPress}
                activeOpacity={0.9}
              >
                <Text style={introStyles.primaryButtonText}>Commencer gratuitement</Text>
                <ArrowRight size={20} color="#ffffff" strokeWidth={2.5} />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity 
              style={introStyles.secondaryButton}
              onPress={handleLoginPress}
              activeOpacity={0.8}
            >
              <Text style={introStyles.secondaryButtonText}>J'ai déjà un compte</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={introStyles.demoButton}
              onPress={handleContinueWithoutAccount}
              activeOpacity={0.7}
            >
              <Text style={introStyles.demoButtonText}>Aperçu rapide</Text>
            </TouchableOpacity>
          </View>

          {/* Trust Indicators Minimalistes */}
          <View style={introStyles.trustSection}>
            <View style={introStyles.trustBadge}>
              <Shield size={14} color="#10b981" strokeWidth={2} />
              <Text style={introStyles.trustText}>Sécurisé & Confidentiel</Text>
            </View>
            <View style={introStyles.ratingBadge}>
              <Star size={14} color="#fbbf24" strokeWidth={2} fill="#fbbf24" />
              <Text style={introStyles.ratingText}>4.9 • 25K+ utilisateurs</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default Intro;