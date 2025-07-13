import { StyleSheet, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

// === DESIGN TOKENS ===
const tokens = {
  // Colors
  colors: {
    primary: '#3b82f6',
    primaryLight: '#dbeafe',
    secondary: '#6366f1',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // Neutrals
    white: '#ffffff',
    gray50: '#f9fafb',
    gray100: '#f3f4f6',
    gray200: '#e5e7eb',
    gray300: '#d1d5db',
    gray400: '#9ca3af',
    gray500: '#6b7280',
    gray600: '#4b5563',
    gray700: '#374151',
    gray800: '#1f2937',
    gray900: '#111827',
    
    // Surfaces
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceElevated: '#ffffff',
    
    // Text
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    
    // Overlays
    overlay: 'rgba(0, 0, 0, 0.5)',
    overlayLight: 'rgba(0, 0, 0, 0.1)',
  },
  
  // Typography
  typography: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 48,
    '5xl': 64,
  },
  
  // Border radius
  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 999,
  },
  
  // Shadows
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 12,
    },
  },
};

export const profileStyles = StyleSheet.create({
  // === LAYOUT ===
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: tokens.spacing['5xl'],
  },

  // === HEADER ===
  header: {
    backgroundColor: tokens.colors.surface,
    paddingTop: tokens.spacing['5xl'],
    paddingHorizontal: tokens.spacing.xl,
    paddingBottom: tokens.spacing['2xl'],
    borderBottomLeftRadius: tokens.radius['2xl'],
    borderBottomRightRadius: tokens.radius['2xl'],
    marginBottom: tokens.spacing.xl,
    ...tokens.shadows.md,
  },

  editButton: {
    position: 'absolute',
    top: 70,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: tokens.colors.gray50,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.gray200,
    ...tokens.shadows.sm,
  },

  // === AVATAR ===
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: tokens.spacing.lg,
    position: 'relative',
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: tokens.colors.gray100,
  },

  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: tokens.colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.gray200,
  },

  cameraButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: tokens.colors.white,
    ...tokens.shadows.sm,
  },

  // === USER INFO ===
  userInfo: {
    alignItems: 'center',
    marginBottom: tokens.spacing.lg,
  },

  userName: {
    fontSize: tokens.typography['2xl'],
    fontWeight: '800',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.5,
  },

  userEmail: {
    fontSize: tokens.typography.sm,
    color: tokens.colors.textSecondary,
    fontWeight: '500',
    marginBottom: tokens.spacing.md,
  },

  // === LEVEL & PROGRESS ===
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    marginBottom: tokens.spacing.sm,
  },

  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.xs + 2,
    borderRadius: tokens.radius.xl,
    gap: tokens.spacing.xs,
  },

  levelText: {
    fontSize: tokens.typography.sm,
    fontWeight: '700',
    color: '#d97706',
  },

  experienceText: {
    fontSize: tokens.typography.sm,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
  },

  progressContainer: {
    width: '100%',
    alignItems: 'center',
    gap: tokens.spacing.xs + 2,
  },

  progressBar: {
    width: 200,
    height: 6,
    backgroundColor: tokens.colors.gray200,
    borderRadius: tokens.radius.sm / 2,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: tokens.colors.primary,
    borderRadius: tokens.radius.sm / 2,
  },

  progressText: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    fontWeight: '500',
  },

  // === BIO ===
  bioSection: {
    backgroundColor: tokens.colors.surface,
    marginHorizontal: tokens.spacing.xl,
    padding: tokens.spacing.xl,
    borderRadius: tokens.radius.lg,
    marginBottom: tokens.spacing.xl,
    ...tokens.shadows.md,
  },

  bioText: {
    fontSize: tokens.typography.base - 1,
    color: tokens.colors.textSecondary,
    lineHeight: 22,
    fontWeight: '500',
    textAlign: 'center',
    fontStyle: 'italic',
  },

  // === SECTIONS ===
  sectionTitle: {
    fontSize: tokens.typography.lg,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.lg,
  },

  // === STATISTICS ===
  statsSection: {
    marginHorizontal: tokens.spacing.xl,
    marginBottom: tokens.spacing['2xl'],
  },

  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },

  statCard: {
    flex: 1,
    minWidth: (screenWidth - 52) / 2,
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    ...tokens.shadows.md,
    gap: tokens.spacing.sm,
  },

  statValue: {
    fontSize: tokens.typography.xl,
    fontWeight: '800',
    color: tokens.colors.textPrimary,
    letterSpacing: -0.5,
  },

  statLabel: {
    fontSize: tokens.typography.sm - 1,
    color: tokens.colors.textSecondary,
    fontWeight: '600',
    textAlign: 'center',
  },

  // === BADGES ===
  badgesSection: {
    marginHorizontal: tokens.spacing.xl,
    marginBottom: tokens.spacing['2xl'],
  },

  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.md,
  },

  badge: {
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    borderRadius: tokens.radius.lg,
    alignItems: 'center',
    minWidth: 100,
    gap: tokens.spacing.xs,
    ...tokens.shadows.sm,
  },

  badgeEmoji: {
    fontSize: tokens.typography.xl,
  },

  badgeName: {
    fontSize: tokens.typography.xs,
    fontWeight: '700',
    color: tokens.colors.white,
    textAlign: 'center',
  },

  badgeLock: {
    backgroundColor: tokens.colors.gray300,
    opacity: 0.7,
  },

  badgeCondition: {
    fontSize: tokens.typography.xs - 1,
    color: tokens.colors.white,
    textAlign: 'center',
    opacity: 0.9,
    fontWeight: '500',
    marginTop: tokens.spacing.xs / 2,
  },

  // === INFORMATION ===
  infoSection: {
    marginHorizontal: tokens.spacing.xl,
    marginBottom: tokens.spacing['2xl'],
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.sm,
    gap: tokens.spacing.md,
    ...tokens.shadows.sm,
  },

  infoText: {
    fontSize: tokens.typography.base - 1,
    color: tokens.colors.textPrimary,
    fontWeight: '500',
    flex: 1,
  },

  // === ACTIONS ===
  actionsSection: {
    marginHorizontal: tokens.spacing.xl,
    marginBottom: tokens.spacing['2xl'],
  },

  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.surface,
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.sm,
    ...tokens.shadows.sm,
  },

  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },

  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionText: {
    fontSize: tokens.typography.base,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },

  // === MODALS ===
  modalContainer: {
    flex: 1,
    backgroundColor: tokens.colors.surface,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: tokens.spacing.xl,
    paddingTop: tokens.spacing['5xl'],
    paddingBottom: tokens.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.gray100,
  },

  modalTitle: {
    fontSize: tokens.typography.lg,
    fontWeight: '700',
    color: tokens.colors.textPrimary,
  },

  modalContent: {
    flex: 1,
    padding: tokens.spacing.xl,
  },

  // === FORMS ===
  inputGroup: {
    marginBottom: tokens.spacing.xl,
  },

  inputLabel: {
    fontSize: tokens.typography.sm,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },

  input: {
    backgroundColor: tokens.colors.gray50,
    borderWidth: 1,
    borderColor: tokens.colors.gray200,
    borderRadius: tokens.radius.md,
    paddingHorizontal: tokens.spacing.lg,
    paddingVertical: tokens.spacing.md,
    fontSize: tokens.typography.base,
    color: tokens.colors.textPrimary,
    fontWeight: '500',
  },

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // === PREFERENCES ===
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colors.gray50,
    padding: tokens.spacing.lg,
    borderRadius: tokens.radius.md,
    marginBottom: tokens.spacing.md,
    borderWidth: 1,
    borderColor: tokens.colors.gray200,
  },

  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
  },

  preferenceText: {
    fontSize: tokens.typography.base,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },

  // === DELETE MODAL ===
  deleteModalOverlay: {
    flex: 1,
    backgroundColor: tokens.colors.overlay,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: tokens.spacing.xl,
  },

  deleteModalContent: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing['2xl'],
    alignItems: 'center',
    width: '100%',
    maxWidth: 320,
    ...tokens.shadows.xl,
  },

  deleteModalIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fef2f2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xl,
  },

  deleteModalTitle: {
    fontSize: tokens.typography.xl,
    fontWeight: '800',
    color: tokens.colors.textPrimary,
    textAlign: 'center',
    marginBottom: tokens.spacing.md,
    letterSpacing: -0.5,
  },

  deleteModalText: {
    fontSize: tokens.typography.base - 1,
    color: tokens.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: tokens.spacing['2xl'],
    fontWeight: '500',
  },

  deleteModalButtons: {
    flexDirection: 'row',
    gap: tokens.spacing.md,
    width: '100%',
  },

  cancelButton: {
    flex: 1,
    backgroundColor: tokens.colors.gray50,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.gray200,
  },

  cancelButtonText: {
    fontSize: tokens.typography.base,
    fontWeight: '600',
    color: tokens.colors.textSecondary,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: tokens.colors.error,
    paddingVertical: tokens.spacing.md,
    paddingHorizontal: tokens.spacing.xl,
    borderRadius: tokens.radius.md,
    alignItems: 'center',
    ...tokens.shadows.md,
  },

  deleteButtonText: {
    fontSize: tokens.typography.base,
    fontWeight: '700',
    color: tokens.colors.white,
  },

  // === SPACING ===
  bottomSpacer: {
    height: tokens.spacing.xl,
  },

  // Ajoutez ces styles à votre fichier ProfileStyle.js existant

// Styles pour l'avatar
avatar: {
  width: 80,
  height: 80,
  borderRadius: 40,
  backgroundColor: '#f1f5f9',
},

avatarUpload: {
  width: 100,
  height: 100,
  borderRadius: 50,
  backgroundColor: '#f8fafc',
  borderWidth: 2,
  borderColor: '#e2e8f0',
  borderStyle: 'dashed',
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'center',
  marginBottom: 8,
},

avatarPreview: {
  width: 96,
  height: 96,
  borderRadius: 48,
},

avatarUploadPlaceholder: {
  alignItems: 'center',
  justifyContent: 'center',
},

avatarUploadText: {
  fontSize: 12,
  color: '#94a3b8',
  fontWeight: '500',
  marginTop: 4,
},

// Styles pour les préférences améliorées
preferenceSection: {
  marginBottom: 24,
},

preferenceSectionTitle: {
  fontSize: 16,
  fontWeight: '700',
  color: '#1e293b',
  marginBottom: 12,
  paddingLeft: 4,
},

preferenceTextContainer: {
  flex: 1,
  marginLeft: 12,
},

preferenceSubtext: {
  fontSize: 12,
  color: '#64748b',
  marginTop: 2,
},

preferenceInputHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 8,
},

selectContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#f8fafc',
  borderWidth: 1,
  borderColor: '#e2e8f0',
  borderRadius: 12,
  paddingHorizontal: 16,
  paddingVertical: 12,
},

selectInput: {
  flex: 1,
  fontSize: 16,
  color: '#1e293b',
  fontWeight: '500',
},

inputHint: {
  fontSize: 12,
  color: '#64748b',
  marginTop: 4,
  paddingLeft: 4,
},

});