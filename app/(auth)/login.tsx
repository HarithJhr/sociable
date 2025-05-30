import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

export default function login() {

	// Initialize SSO flow hook from Clerk
	const { startSSOFlow } = useSSO();
	// Get the router instance for navigation
	const router = useRouter();

	// Function to handle sign in with Google using the SSO flow
	const handleGoogleSignIn = async () => {
		try {
			// Start the SSO flow with the strategy for Google OAuth
			const { createdSessionId, setActive } = await startSSOFlow({ strategy: "oauth_google" });

			// If a session is successfully created and setActive is available
			if (setActive && createdSessionId) {
				// Activate the newly created session
				setActive({ session: createdSessionId });
				// Navigate to the main tabs route after successful sign in
				router.replace("/(tabs)");
			}

		} catch (error) {
			// Log any errors that occur during the OAuth process
			console.error("OAuth error:", error);
		}
	};

  return (
    <View style={styles.container}>
      
      {/* Brand secttion */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>Sociable</Text>
        <Text style={styles.tagline}>Be social</Text>
      </View>

      {/* Image */}
      <View style={styles.illustrationContainer}>
        <Image
					source={require('@/assets/images/auth-bg.png')}
					style={styles.illustration}
					resizeMode="contain"
				/>
			</View>

			{/* Login */}
			<View style={styles.loginSection}>
				{/* Google login */}
				<TouchableOpacity 
					style={styles.googleButton}
					onPress={handleGoogleSignIn}
					activeOpacity={0.9}
				>
					<View style={styles.googleIconContainer}>
						<Ionicons name="logo-google" size={20} color={COLORS.surface} />
					</View>
					<Text style={styles.googleButtonText}>Continue with Google</Text>
				</TouchableOpacity>

				{/* Email login */}
				<TouchableOpacity 
					style={styles.googleButton}
					onPress={() => router.push("/(auth)/create-or-sign-in")}
					activeOpacity={0.9}
				>
					<View style={styles.googleIconContainer}>
						<Ionicons name="mail" size={20} color={COLORS.surface} />
					</View>
					<Text style={styles.googleButtonText}>Continue with Email</Text>
				</TouchableOpacity>

				<Text style={styles.termsText}>
						By continuing, you agree to our Terms and Privacy Policy
				</Text>

			</View>

    </View>
  );
}