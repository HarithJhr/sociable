import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

export default function Page() {
  return (
    <View style={styles.container}>
       {/* Brand section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Sociable</Text>
        </View>
        
      {/* Login */}
      <View style={styles.emailLoginSection}>
        {/* Google login */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={() => router.push("/(auth)/sign-in")}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="log-in" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Sign in</Text>
        </TouchableOpacity>

        {/* Email login */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={() => router.push("/(auth)/sign-up")}
          activeOpacity={0.9}
        >
          <View style={styles.googleIconContainer}>
            <Ionicons name="add" size={20} color={COLORS.surface} />
          </View>
          <Text style={styles.googleButtonText}>Create an account</Text>
        </TouchableOpacity>

      </View>
    </View>
  )
}