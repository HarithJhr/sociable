import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { useSignIn } from '@clerk/clerk-expo';
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2))
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={styles.container}>
      {/* Brand secttion */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Sign In</Text>
        </View>
      
      {/* Log in text fields */}
      <View style={styles.emailLoginSection}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter email"
          placeholderTextColor={COLORS.grey}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          style={styles.textBox}
          keyboardType="email-address"
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          placeholderTextColor={COLORS.grey}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={styles.textBox}
        />
        <TouchableOpacity onPress={onSignInPress} style={styles.textButton}>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      
      {/* Sign up shortcut*/}
      <View>
        <Link href="./sign-up">
          <Text style={styles.termsText}>Don't have an account? Sign up</Text>
        </Link>
      </View>
    </View>
  )
}