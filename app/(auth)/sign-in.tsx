import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/auth.styles";
import { isClerkAPIResponseError, useSignIn } from '@clerk/clerk-expo';
import { ClerkAPIError } from "@clerk/types";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)
  const [errorType, setErrorType] = React.useState<string | undefined>(undefined)

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {

    // Clear any errors that may have occurred during previous form submission
    setErrors(undefined)
    setErrorType(undefined)
    setErrorMessage(undefined)

    if (!isLoaded) return
    if (!emailAddress) {
      setErrorType("identifier")
      return
    }
    if (!password) {
      setErrorType("password")
      return
    }

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
      if (isClerkAPIResponseError(err)) {
        setErrors(err.errors)
        setErrorMessage(err.errors[0].longMessage)
        setErrorType(
          err.errors[0].meta?.paramName
        )
      }
      console.error(JSON.stringify(err, null, 2))
    }
  }

  return (
    <View style={styles.container}>
      {/* Brand section */}
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
          style={[
            styles.textBox,
            errorType === "identifier" && { borderColor: "red", borderWidth: 3 },
          ]}
          keyboardType="email-address"
        />
        <TextInput
          value={password}
          placeholder="Enter password"
          placeholderTextColor={COLORS.grey}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={[
            styles.textBox,
            errorType === "password" && { borderColor: "red", borderWidth: 2 },
          ]}
        />
        <TouchableOpacity onPress={onSignInPress} style={styles.textButton}>
          <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
        </TouchableOpacity>

        {errors && (
          <View>
            <Text style={styles.signInErrorText}>{errorMessage}</Text>
          </View>
        )}
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