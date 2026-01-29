import React, { useState } from 'react';
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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';

interface Props {
  navigation: any;
}

export default function RegisterScreen({ navigation }: Props) {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

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
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigation.goBack();
    }
  };

  const handleRegister = async () => {
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
        experience_level: experienceLevel,
        activity_level: activityLevel,
        // Backend expects these field names:
        activityLevel: activityLevel,
        experienceLevel: experienceLevel,
      } as any);
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Please try again');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Create Account</Text>
      <Text style={styles.stepSubtitle}>Step 1 of 3 - Account Details</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password (min 6 characters)"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#666"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Info</Text>
      <Text style={styles.stepSubtitle}>Step 2 of 3 - Body Metrics</Text>

      <TextInput
        style={styles.input}
        placeholder="Age"
        placeholderTextColor="#666"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <View style={styles.pickerContainer}>
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
      </View>

      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        placeholderTextColor="#666"
        value={weight}
        onChangeText={setWeight}
        keyboardType="decimal-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        placeholderTextColor="#666"
        value={height}
        onChangeText={setHeight}
        keyboardType="decimal-pad"
      />
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Fitness Goals</Text>
      <Text style={styles.stepSubtitle}>Step 3 of 3 - Your Objectives</Text>

      <View style={styles.pickerContainer}>
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
            <Picker.Item label="Maintain Weight" value="maintenance" color="#fff" />
            <Picker.Item label="Build Endurance" value="endurance" color="#fff" />
            <Picker.Item label="Build Strength" value="strength" color="#fff" />
          </Picker>
        </View>
      </View>

      <View style={styles.pickerContainer}>
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
      </View>

      <View style={styles.pickerContainer}>
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
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>AnatomLabs+</Text>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressContainer}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s <= step && styles.progressDotActive,
              ]}
            />
          ))}
        </View>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}

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

          {step < 3 ? (
            <TouchableOpacity
              style={styles.nextButton}
              onPress={handleNext}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.nextButton, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.nextButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
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
    justifyContent: 'center',
    gap: 8,
    marginBottom: 30,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#333',
  },
  progressDotActive: {
    backgroundColor: '#e74c3c',
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  pickerLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  pickerWrapper: {
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 12,
    overflow: 'hidden',
  },
  picker: {
    color: '#fff',
    backgroundColor: '#1a1a1a',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#888',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    flex: 2,
    backgroundColor: '#e74c3c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
    paddingBottom: 30,
  },
  loginLinkText: {
    color: '#888',
    fontSize: 14,
  },
  loginLinkBold: {
    color: '#e74c3c',
    fontWeight: '600',
  },
});
