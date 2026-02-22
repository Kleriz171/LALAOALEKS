import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolate,
  Easing,
  FadeIn,
  FadeInRight,
  FadeInLeft,
  FadeOutLeft,
  FadeOutRight,
  SlideInRight,
  SlideOutLeft,
  Layout,
} from 'react-native-reanimated';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import MultiSelectChips, { CollapsibleSection } from '../../components/forms/MultiSelectChips';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
  navigation: any;
}

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');

  // Animation for progress dots
  const progressAnimation = useSharedValue(1);

  // Step 1: Account info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: Personal info
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');

  // Step 3: Fitness info
  const [goal, setGoal] = useState('muscle_gain');
  const [experienceLevel, setExperienceLevel] = useState('beginner');
  const [activityLevel, setActivityLevel] = useState('moderate');

  // Step 4: Health profile (optional)
  const [physicalLimitations, setPhysicalLimitations] = useState<string[]>([]);
  const [medicalConditions, setMedicalConditions] = useState<string[]>([]);
  const [foodAllergies, setFoodAllergies] = useState<string[]>([]);
  const [dietaryPreferences, setDietaryPreferences] = useState<string[]>([]);

  // Health condition options from API
  const [healthOptions, setHealthOptions] = useState<{
    physicalLimitations: { id: string; name: string; description: string }[];
    medicalConditions: { id: string; name: string; description: string }[];
    foodAllergies: { id: string; name: string; description: string; severity: string }[];
    dietaryPreferences: { id: string; name: string; description: string }[];
  } | null>(null);
  const [loadingHealthOptions, setLoadingHealthOptions] = useState(false);

  // Load health options when reaching step 4
  useEffect(() => {
    if (step === 4 && !healthOptions) {
      loadHealthOptions();
    }
  }, [step]);

  const loadHealthOptions = async () => {
    setLoadingHealthOptions(true);
    try {
      const options = await api.getHealthConditions();
      setHealthOptions(options);
    } catch (error) {
      console.log('Failed to load health options:', error);
      // Use fallback options
      setHealthOptions({
        physicalLimitations: [
          { id: 'lower_back_injury', name: 'Lower Back Pain', description: 'Pain in lumbar region' },
          { id: 'knee_injury', name: 'Knee Injury', description: 'Pain or injury in knee' },
          { id: 'shoulder_injury', name: 'Shoulder Injury', description: 'Pain or injury in shoulder' },
          { id: 'neck_injury', name: 'Neck Injury', description: 'Pain in cervical spine' },
        ],
        medicalConditions: [
          { id: 'diabetes_type_2', name: 'Type 2 Diabetes', description: 'Non-insulin dependent diabetes' },
          { id: 'hypertension', name: 'High Blood Pressure', description: 'Chronically elevated BP' },
          { id: 'heart_disease', name: 'Heart Disease', description: 'Cardiovascular condition' },
          { id: 'asthma', name: 'Asthma', description: 'Respiratory condition' },
        ],
        foodAllergies: [
          { id: 'peanuts', name: 'Peanuts', description: 'Peanut allergy', severity: 'high' },
          { id: 'dairy', name: 'Dairy', description: 'Milk allergy', severity: 'moderate' },
          { id: 'gluten', name: 'Gluten', description: 'Celiac/gluten sensitivity', severity: 'moderate' },
          { id: 'shellfish', name: 'Shellfish', description: 'Shellfish allergy', severity: 'high' },
        ],
        dietaryPreferences: [
          { id: 'vegetarian', name: 'Vegetarian', description: 'No meat or fish' },
          { id: 'vegan', name: 'Vegan', description: 'No animal products' },
          { id: 'halal', name: 'Halal', description: 'Islamic dietary laws' },
          { id: 'keto', name: 'Keto', description: 'Very low carb, high fat' },
        ],
      });
    } finally {
      setLoadingHealthOptions(false);
    }
  };

  const validateStep1 = () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    const ageNum = parseInt(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    if (!age || ageNum < 13 || ageNum > 100) {
      Alert.alert('Error', 'Please enter a valid age (13-100)');
      return false;
    }
    if (!weight || weightNum < 30 || weightNum > 300) {
      Alert.alert('Error', 'Please enter a valid weight (30-300 kg)');
      return false;
    }
    if (!height || heightNum < 100 || heightNum > 250) {
      Alert.alert('Error', 'Please enter a valid height (100-250 cm)');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setDirection('forward');
      progressAnimation.value = withSpring(2, { damping: 15 });
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setDirection('forward');
      progressAnimation.value = withSpring(3, { damping: 15 });
      setStep(3);
    } else if (step === 3) {
      setDirection('forward');
      progressAnimation.value = withSpring(4, { damping: 15 });
      setStep(4);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setDirection('backward');
      progressAnimation.value = withSpring(step - 1, { damping: 15 });
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleRegister = async (skipHealthProfile = false) => {
    setIsLoading(true);
    try {
      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        age: parseInt(age),
        gender,
        weight: parseFloat(weight),
        height: parseFloat(height),
        goal,
        activityLevel: activityLevel,
        experienceLevel: experienceLevel,
        // Health profile (optional)
        physicalLimitations: skipHealthProfile ? [] : physicalLimitations,
        healthConditions: skipHealthProfile ? [] : medicalConditions,
        foodAllergies: skipHealthProfile ? [] : foodAllergies,
        dietaryPreferences: skipHealthProfile ? [] : dietaryPreferences,
      } as any);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <Animated.View
      entering={direction === 'forward' ? FadeInRight.duration(300).springify() : FadeInLeft.duration(300).springify()}
      exiting={direction === 'forward' ? FadeOutLeft.duration(200) : FadeOutRight.duration(200)}
      style={styles.stepContainer}
    >
      <Animated.Text entering={FadeIn.delay(100)} style={styles.stepTitle}>Create Account</Animated.Text>
      <Animated.Text entering={FadeIn.delay(150)} style={styles.stepSubtitle}>Step 1 of 4 - Account Details</Animated.Text>

      <Animated.View entering={FadeIn.delay(200)}>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#666"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(250)}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300)}>
        <TextInput
          style={styles.input}
          placeholder="Password (min 6 characters)"
          placeholderTextColor="#666"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(350)}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#666"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
      </Animated.View>
    </Animated.View>
  );

  const renderStep2 = () => (
    <Animated.View
      entering={direction === 'forward' ? FadeInRight.duration(300).springify() : FadeInLeft.duration(300).springify()}
      exiting={direction === 'forward' ? FadeOutLeft.duration(200) : FadeOutRight.duration(200)}
      style={styles.stepContainer}
    >
      <Animated.Text entering={FadeIn.delay(100)} style={styles.stepTitle}>Personal Info</Animated.Text>
      <Animated.Text entering={FadeIn.delay(150)} style={styles.stepSubtitle}>Step 2 of 4 - Body Metrics</Animated.Text>

      <Animated.View entering={FadeIn.delay(200)}>
        <TextInput
          style={styles.input}
          placeholder="Age"
          placeholderTextColor="#666"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(250)} style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Gender</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={gender}
            onValueChange={(value) => setGender(value)}
            style={styles.picker}
            dropdownIconColor="#e74c3c"
          >
            <Picker.Item label="Male" value="male" color="#fff" />
            <Picker.Item label="Female" value="female" color="#fff" />
          </Picker>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300)}>
        <TextInput
          style={styles.input}
          placeholder="Weight (kg)"
          placeholderTextColor="#666"
          value={weight}
          onChangeText={setWeight}
          keyboardType="decimal-pad"
        />
      </Animated.View>

      <Animated.View entering={FadeIn.delay(350)}>
        <TextInput
          style={styles.input}
          placeholder="Height (cm)"
          placeholderTextColor="#666"
          value={height}
          onChangeText={setHeight}
          keyboardType="decimal-pad"
        />
      </Animated.View>
    </Animated.View>
  );

  const renderStep3 = () => (
    <Animated.View
      entering={direction === 'forward' ? FadeInRight.duration(300).springify() : FadeInLeft.duration(300).springify()}
      exiting={direction === 'forward' ? FadeOutLeft.duration(200) : FadeOutRight.duration(200)}
      style={styles.stepContainer}
    >
      <Animated.Text entering={FadeIn.delay(100)} style={styles.stepTitle}>Fitness Goals</Animated.Text>
      <Animated.Text entering={FadeIn.delay(150)} style={styles.stepSubtitle}>Step 3 of 4 - Your Objectives</Animated.Text>

      <Animated.View entering={FadeIn.delay(200)} style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Primary Goal</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={goal}
            onValueChange={(value) => setGoal(value)}
            style={styles.picker}
            dropdownIconColor="#e74c3c"
          >
            <Picker.Item label="Build Muscle" value="muscle_gain" color="#fff" />
            <Picker.Item label="Lose Fat" value="fat_loss" color="#fff" />
            <Picker.Item label="Body Recomposition (Build Muscle + Lose Fat)" value="body_recomposition" color="#fff" />
            <Picker.Item label="General Fitness" value="general_fitness" color="#fff" />
            <Picker.Item label="Build Endurance" value="endurance" color="#fff" />
          </Picker>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(250)} style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Experience Level</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={experienceLevel}
            onValueChange={(value) => setExperienceLevel(value)}
            style={styles.picker}
            dropdownIconColor="#e74c3c"
          >
            <Picker.Item label="Beginner (0-1 years)" value="beginner" color="#fff" />
            <Picker.Item label="Intermediate (1-3 years)" value="intermediate" color="#fff" />
            <Picker.Item label="Advanced (3+ years)" value="advanced" color="#fff" />
          </Picker>
        </View>
      </Animated.View>

      <Animated.View entering={FadeIn.delay(300)} style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Activity Level</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={activityLevel}
            onValueChange={(value) => setActivityLevel(value)}
            style={styles.picker}
            dropdownIconColor="#e74c3c"
          >
            <Picker.Item label="Sedentary (desk job)" value="sedentary" color="#fff" />
            <Picker.Item label="Light (1-2 days/week)" value="light" color="#fff" />
            <Picker.Item label="Moderate (3-5 days/week)" value="moderate" color="#fff" />
            <Picker.Item label="Active (6-7 days/week)" value="active" color="#fff" />
            <Picker.Item label="Very Active (athlete)" value="very_active" color="#fff" />
          </Picker>
        </View>
      </Animated.View>
    </Animated.View>
  );

  const renderStep4 = () => (
    <Animated.View
      entering={direction === 'forward' ? FadeInRight.duration(300).springify() : FadeInLeft.duration(300).springify()}
      exiting={direction === 'forward' ? FadeOutLeft.duration(200) : FadeOutRight.duration(200)}
      style={styles.stepContainer}
    >
      <Animated.Text entering={FadeIn.delay(100)} style={styles.stepTitle}>Health Profile</Animated.Text>
      <Animated.Text entering={FadeIn.delay(150)} style={styles.stepSubtitle}>Step 4 of 4 — Personalizes your workouts & nutrition</Animated.Text>

      {loadingHealthOptions ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color="#e74c3c" size="large" />
          <Text style={styles.loadingText}>Loading options...</Text>
        </View>
      ) : healthOptions ? (
        <Animated.View entering={FadeIn.delay(200)} style={styles.healthScrollView}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <CollapsibleSection
              title="Physical Limitations"
              initiallyExpanded={true}
              badge={physicalLimitations.length > 0 ? `${physicalLimitations.length}` : undefined}
              accentColor="#e74c3c"
            >
              <MultiSelectChips
                title=""
                options={healthOptions.physicalLimitations}
                selectedIds={physicalLimitations}
                onSelectionChange={setPhysicalLimitations}
                collapsible={false}
                accentColor="#e74c3c"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Medical Conditions"
              badge={medicalConditions.length > 0 ? `${medicalConditions.length}` : undefined}
              accentColor="#9b59b6"
            >
              <MultiSelectChips
                title=""
                options={healthOptions.medicalConditions}
                selectedIds={medicalConditions}
                onSelectionChange={setMedicalConditions}
                collapsible={false}
                accentColor="#9b59b6"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Food Allergies"
              badge={foodAllergies.length > 0 ? `${foodAllergies.length}` : undefined}
              accentColor="#f39c12"
            >
              <MultiSelectChips
                title=""
                options={healthOptions.foodAllergies}
                selectedIds={foodAllergies}
                onSelectionChange={setFoodAllergies}
                collapsible={false}
                accentColor="#f39c12"
              />
            </CollapsibleSection>

            <CollapsibleSection
              title="Dietary Preferences"
              badge={dietaryPreferences.length > 0 ? `${dietaryPreferences.length}` : undefined}
              accentColor="#2ecc71"
            >
              <MultiSelectChips
                title=""
                options={healthOptions.dietaryPreferences}
                selectedIds={dietaryPreferences}
                onSelectionChange={setDietaryPreferences}
                collapsible={false}
                accentColor="#2ecc71"
              />
            </CollapsibleSection>

            <Animated.Text entering={FadeIn.delay(400)} style={styles.healthNote}>
              This information helps us personalize your workout and nutrition plans.
              You can update this anytime in your profile settings.
            </Animated.Text>
          </ScrollView>
        </Animated.View>
      ) : (
        <Text style={styles.errorText}>Failed to load options. You can skip this step.</Text>
      )}
    </Animated.View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>AnatomLabs<Text style={{ color: '#e74c3c' }}>+</Text></Text>
        </View>

        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <View key={s} style={styles.progressSegmentWrap}>
              <Animated.View
                layout={Layout.springify()}
                style={[styles.progressSegment, s <= step && styles.progressSegmentActive]}
              />
            </View>
          ))}
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            disabled={isLoading}
          >
            <Text style={styles.backButtonText}>
              {step === 1 ? 'Cancel' : 'Back'}
            </Text>
          </TouchableOpacity>

          {step < 4 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.step4Buttons}>
              <TouchableOpacity
                style={[styles.skipButton, isLoading && styles.buttonDisabled]}
                onPress={() => handleRegister(true)}
                disabled={isLoading}
              >
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.nextButton, styles.completeButton, isLoading && styles.buttonDisabled]}
                onPress={() => handleRegister(false)}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.nextButtonText}>Complete</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.loginLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? <Text style={styles.loginLinkBold}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 32,
  },
  progressSegmentWrap: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    borderRadius: 2,
    backgroundColor: '#333',
  },
  progressSegmentActive: {
    backgroundColor: '#e74c3c',
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontSize: 13,
    color: '#888',
    marginBottom: 28,
    lineHeight: 18,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    color: '#fff',
    marginBottom: 12,
  },
  pickerContainer: {
    marginBottom: 12,
  },
  pickerLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  pickerWrapper: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#2a2a2a',
    borderRadius: 14,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 30,
  },
  loginLinkText: {
    color: '#666',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#e74c3c',
    fontWeight: '700',
  },
  // Step 4 styles
  healthScrollView: {
    flex: 1,
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#888',
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    color: '#e74c3c',
    textAlign: 'center',
    fontSize: 14,
    paddingVertical: 20,
  },
  healthNote: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
    lineHeight: 18,
  },
  step4Buttons: {
    flex: 2,
    flexDirection: 'row',
    gap: 10,
  },
  skipButton: {
    flex: 1,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipButtonText: {
    color: '#666',
    fontSize: 15,
    fontWeight: '600',
  },
  completeButton: {
    flex: 1.5,
  },
});
