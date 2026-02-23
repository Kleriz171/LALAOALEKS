import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, SlideOutDown, ZoomIn } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MultiSelectChips, { CollapsibleSection } from '../../components/forms/MultiSelectChips';
import { COLORS, useHaptics } from '../../components/animations';

type SectionKey = 'avatar' | 'physical' | 'health' | 'allergies' | 'dietary' | null;

interface HealthOptions {
  physicalLimitations: { id: string; name: string; description: string }[];
  medicalConditions: { id: string; name: string; description: string }[];
  foodAllergies: { id: string; name: string; description: string; severity: string }[];
  dietaryPreferences: { id: string; name: string; description: string }[];
}

interface HealthProfile {
  physicalLimitations: string[];
  healthConditions: string[];
  foodAllergies: string[];
  dietaryPreferences: string[];
  avatar?: string;
}

export default function HealthProfileScreen({ navigation }: any) {
  const { user, updateUser } = useAuth();
  const { trigger } = useHaptics();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Health options from API
  const [healthOptions, setHealthOptions] = useState<HealthOptions | null>(null);

  // User's current selections
  const [physicalLimitations, setPhysicalLimitations] = useState<string[]>([]);
  const [healthConditions, setHealthConditions] = useState<string[]>([]);
  const [foodAllergies, setFoodAllergies] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(user?.avatar || null);

  // Original values for comparison
  const [originalProfile, setOriginalProfile] = useState<HealthProfile | null>(null);

  // Accordion state - only one section open at a time
  const [expandedSection, setExpandedSection] = useState<SectionKey>('avatar');

  // Camera state
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const cameraRef = useRef<any>(null);
  const [cameraVisible, setCameraVisible] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('front');

  const handleSectionToggle = (section: SectionKey) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Track changes
  useEffect(() => {
    if (originalProfile) {
      const changed =
        JSON.stringify(physicalLimitations.sort()) !== JSON.stringify(originalProfile.physicalLimitations.sort()) ||
        JSON.stringify(healthConditions.sort()) !== JSON.stringify(originalProfile.healthConditions.sort()) ||
        JSON.stringify(foodAllergies.sort()) !== JSON.stringify(originalProfile.foodAllergies.sort()) ||
        JSON.stringify(dietaryPreferences.sort()) !== JSON.stringify(originalProfile.dietaryPreferences.sort()) ||
        avatar !== originalProfile.avatar;
      setHasChanges(changed);
    }
  }, [physicalLimitations, healthConditions, foodAllergies, dietaryPreferences, avatar, originalProfile]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [options, profile] = await Promise.all([
        api.getHealthConditions(),
        api.getUserProfile(),
      ]);

      setHealthOptions(options);

      const currentProfile: HealthProfile = {
        physicalLimitations: profile.physicalLimitations || [],
        healthConditions: profile.healthConditions || [],
        foodAllergies: profile.foodAllergies || [],
        dietaryPreferences: profile.dietaryPreferences || [],
        avatar: user?.avatar || undefined,
      };

      setPhysicalLimitations(currentProfile.physicalLimitations);
      setHealthConditions(currentProfile.healthConditions);
      setFoodAllergies(currentProfile.foodAllergies);
      setDietaryPreferences(currentProfile.dietaryPreferences);
      setAvatar(user?.avatar || null);
      setOriginalProfile(currentProfile);
    } catch (error) {
      console.error('Error loading health profile:', error);
      Alert.alert('Error', 'Failed to load health profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const openCamera = async () => {
    trigger('medium');
    if (!cameraPermission?.granted) {
      const r = await requestCameraPermission();
      if (!r.granted) { Alert.alert('Camera access needed', 'Allow camera in Settings.'); return; }
    }
    setCameraVisible(true);
  };

  const pickFromRoll = async () => {
    trigger('light');
    const r = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images, 
      allowsEditing: true, 
      aspect: [1, 1], 
      quality: 0.85 
    });
    if (!r.canceled && r.assets?.length > 0) {
      setAvatar(r.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;
    trigger('medium');
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, base64: false });
      setAvatar(photo.uri);
      setCameraVisible(false);
    } catch (e) {
      console.error('Take photo error:', e);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleSave = async () => {
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      let finalAvatar = avatar;
      
      // If avatar is a local file, upload it first
      if (avatar && (avatar.startsWith('file://') || avatar.startsWith('content://'))) {
        const { avatarUrl } = await api.uploadAvatar(avatar);
        finalAvatar = avatarUrl;
      }

      await api.updateHealthProfile({
        physicalLimitations,
        healthConditions,
        foodAllergies,
        dietaryPreferences,
      });

      // Update global context
      updateUser({ 
        avatar: finalAvatar || undefined,
        physicalLimitations,
        healthConditions,
        foodAllergies,
        dietaryPreferences,
        healthProfileComplete: true
      });

      setOriginalProfile({
        physicalLimitations,
        healthConditions,
        foodAllergies,
        dietaryPreferences,
        avatar: finalAvatar || undefined,
      });

      setHasChanges(false);
      Alert.alert('Success', 'Your profile has been updated.');
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (!originalProfile) return;

    Alert.alert(
      'Reset Changes?',
      'This will discard all unsaved changes.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            setPhysicalLimitations(originalProfile.physicalLimitations);
            setHealthConditions(originalProfile.healthConditions);
            setFoodAllergies(originalProfile.foodAllergies);
            setDietaryPreferences(originalProfile.dietaryPreferences);
            setAvatar(originalProfile.avatar || null);
          },
        },
      ]
    );
  };

  const getTotalSelected = () => {
    return physicalLimitations.length + healthConditions.length + foodAllergies.length + dietaryPreferences.length;
  };

  const initials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color={COLORS.primary} size="large" />
        <Text style={styles.loadingText}>Loading health profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Profile Settings</Text>
        </View>
        <View style={styles.headerActions}>
          {hasChanges && (
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Ionicons name="refresh" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} tintColor={COLORS.primary} />
        }
      >
        {/* Profile Photo Section */}
        <CollapsibleSection
          title="Profile Photo"
          isExpanded={expandedSection === 'avatar'}
          onToggle={() => handleSectionToggle('avatar')}
          accentColor={COLORS.primary}
        >
          <View style={styles.avatarSection}>
            <View style={[styles.avatarRing, { borderColor: user?.isCoach ? COLORS.primary : '#3498db' }]}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatarImg} />
              ) : (
                <LinearGradient colors={[user?.isCoach ? COLORS.primary : '#3498db', '#1a1a1a']} style={styles.avatarGrad}>
                  <Text style={styles.avatarText}>{initials(user?.name || '')}</Text>
                </LinearGradient>
              )}
            </View>
            <View style={styles.avatarBtns}>
              <TouchableOpacity style={styles.avatarBtn} onPress={openCamera}>
                <LinearGradient colors={[COLORS.cardBackground, '#111']} style={styles.avatarBtnGrad}>
                  <Ionicons name="camera" size={20} color={COLORS.text} />
                  <Text style={styles.avatarBtnText}>Take Photo</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.avatarBtn} onPress={pickFromRoll}>
                <LinearGradient colors={[COLORS.cardBackground, '#111']} style={styles.avatarBtnGrad}>
                  <Ionicons name="images" size={20} color={COLORS.text} />
                  <Text style={styles.avatarBtnText}>Choose Library</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </CollapsibleSection>

        {healthOptions && (
          <>
            {/* Physical Limitations */}
            <CollapsibleSection
              title="Physical Limitations"
              isExpanded={expandedSection === 'physical'}
              onToggle={() => handleSectionToggle('physical')}
              badge={physicalLimitations.length > 0 ? `${physicalLimitations.length}` : undefined}
              accentColor="#e74c3c"
            >
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionInfoText}>
                  Select any injuries or mobility limitations. We'll avoid exercises that could aggravate these conditions.
                </Text>
              </View>
              <MultiSelectChips
                title=""
                options={healthOptions.physicalLimitations}
                selectedIds={physicalLimitations}
                onSelectionChange={setPhysicalLimitations}
                collapsible={false}
                accentColor="#e74c3c"
              />
            </CollapsibleSection>

            {/* Health/Medical Conditions */}
            <CollapsibleSection
              title="Health Conditions"
              isExpanded={expandedSection === 'health'}
              onToggle={() => handleSectionToggle('health')}
              badge={healthConditions.length > 0 ? `${healthConditions.length}` : undefined}
              accentColor="#9b59b6"
            >
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionInfoText}>
                  Medical conditions affect both exercise intensity recommendations and nutrition targets.
                </Text>
              </View>
              <MultiSelectChips
                title=""
                options={healthOptions.medicalConditions}
                selectedIds={healthConditions}
                onSelectionChange={setHealthConditions}
                collapsible={false}
                accentColor="#9b59b6"
              />
            </CollapsibleSection>

            {/* Food Allergies */}
            <CollapsibleSection
              title="Food Allergies"
              isExpanded={expandedSection === 'allergies'}
              onToggle={() => handleSectionToggle('allergies')}
              badge={foodAllergies.length > 0 ? `${foodAllergies.length}` : undefined}
              accentColor="#f39c12"
            >
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionInfoText}>
                  We'll warn you about foods containing these allergens when tracking nutrition.
                </Text>
              </View>
              <MultiSelectChips
                title=""
                options={healthOptions.foodAllergies}
                selectedIds={foodAllergies}
                onSelectionChange={setFoodAllergies}
                collapsible={false}
                accentColor="#f39c12"
              />
            </CollapsibleSection>

            {/* Dietary Preferences */}
            <CollapsibleSection
              title="Dietary Preferences"
              isExpanded={expandedSection === 'dietary'}
              onToggle={() => handleSectionToggle('dietary')}
              badge={dietaryPreferences.length > 0 ? `${dietaryPreferences.length}` : undefined}
              accentColor="#2ecc71"
            >
              <View style={styles.sectionInfo}>
                <Text style={styles.sectionInfoText}>
                  Your dietary preferences help filter food suggestions and adjust macro recommendations.
                </Text>
              </View>
              <MultiSelectChips
                title=""
                options={healthOptions.dietaryPreferences}
                selectedIds={dietaryPreferences}
                onSelectionChange={setDietaryPreferences}
                collapsible={false}
                accentColor="#2ecc71"
              />
            </CollapsibleSection>
          </>
        )}
      </ScrollView>

      {/* Save Button */}
      {hasChanges && (
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={SlideOutDown.duration(200)}
          style={styles.saveContainer}
        >
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Ionicons name="checkmark-circle" size={22} color="#fff" />
            )}
            <Text style={styles.saveButtonText}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Camera Modal */}
      <Modal visible={cameraVisible} animationType="slide" presentationStyle="fullScreen" onRequestClose={() => setCameraVisible(false)}>
        <View style={styles.camRoot}>
          <StatusBar barStyle="light-content" />
          <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={cameraFacing} />
          <SafeAreaView style={styles.camTop}>
            <TouchableOpacity style={styles.camBtn} onPress={() => setCameraVisible(false)}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.camBtn} onPress={() => setCameraFacing(f => f === 'back' ? 'front' : 'back')}>
              <Ionicons name="camera-reverse-outline" size={26} color="#fff" />
            </TouchableOpacity>
          </SafeAreaView>
          <View style={styles.camShutter}>
            <TouchableOpacity style={styles.shutterBtn} onPress={takePhoto}>
              <View style={styles.shutterInner} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 12,
    fontSize: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerActions: {
    flexDirection: 'row',
  },
  resetButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  sectionInfo: {
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionInfoText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  avatarRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarImg: {
    width: 106,
    height: 106,
    borderRadius: 53,
  },
  avatarGrad: {
    width: 106,
    height: 106,
    borderRadius: 53,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
  },
  avatarBtns: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  avatarBtn: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarBtnGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  avatarBtnText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
  saveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(10,10,10,0.9)',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: '#2ecc71',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  camRoot: {
    flex: 1,
    backgroundColor: '#000',
  },
  camTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  camBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camShutter: {
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
  },
  shutterBtn: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
  },
});
