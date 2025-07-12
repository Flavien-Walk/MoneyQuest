import React from 'react';
import Profile from '../components/Profile';

/**
 * Page de profil utilisateur
 * Affiche les informations personnelles, statistiques et paramètres du profil
 */
const ProfilePage: React.FC = () => {
  // À remplacer dynamiquement selon le système d'authentification
  const userId = '12345';

  return <Profile userId={userId} />;
};

export default ProfilePage;
