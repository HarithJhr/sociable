import { COLORS } from '@/constants/theme';
import { styles } from '@/styles/auth.styles';
import { isClerkAPIResponseError, useSignUp } from '@clerk/clerk-expo';
import { ClerkAPIError } from "@clerk/types";
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import * as React from 'react';
import { Button, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Page() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [pendingVerification, setPendingVerification] = React.useState(false)
  const [code, setCode] = React.useState('')
  const [errors, setErrors] = React.useState<ClerkAPIError[]>()
  const [errorMessage, setErrorMessage] = React.useState<string | undefined>(undefined)
  const [errorType, setErrorType] = React.useState<string | undefined>(undefined)

  // Handle submission of sign-up form
  const onSignUpPress = async () => {

    // Clear any errors that may have occurred during previous form submission
    setErrors(undefined)
    setErrorType(undefined)
    setErrorMessage(undefined)

    if (!isLoaded) return

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true)
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

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      })

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === 'complete') {
        await setActive({ session: signUpAttempt.createdSessionId })
        router.replace('/')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(signUpAttempt, null, 2))
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

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        {/* Brand section */}
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={32} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Verify your email</Text>
        </View>

        {/* Input field */}
        <View style={styles.emailLoginSection}>
          <TextInput
            value={code}
            placeholder="Enter your verification code"
            placeholderTextColor="#666666"
            onChangeText={(code) => setCode(code)}
            style={styles.textBox}
            keyboardType="numeric"
          />
          <Button title="Verify" onPress={onVerifyPress} />

          {errors && (
            <View>
              <Text style={styles.signInErrorText}>{errorMessage}</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {/* Brand secttion */}
      <View style={styles.brandSection}>
        <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={32} color={COLORS.primary} />
        </View>
        <Text style={styles.appName}>Create Account</Text>
      </View>

      {/* Log in text fields */}
      <View style={styles.emailLoginSection}>
        <TextInput
          autoCapitalize="none"
          value={emailAddress}
          placeholder="Enter your email"
          placeholderTextColor={COLORS.grey}
          onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
          style={[
            styles.textBox,
            errorType === "email_address" && { borderColor: "red", borderWidth: 2 },
          ]}
          keyboardType="email-address"
        />
        <TextInput
          value={password}
          placeholder="Create a password"
          placeholderTextColor={COLORS.grey}
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
          style={[
            styles.textBox,
            errorType === "password" && { borderColor: "red", borderWidth: 2 },
          ]}
        />
        <TouchableOpacity onPress={onSignUpPress} style={styles.textButton}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>

        {errors && (
          <View>
            <Text style={styles.signInErrorText}>{errorMessage}</Text>
          </View>
        )}
      </View>

      {/* Sign in shortcut */}
      <View>
        <Link href="./sign-in">
          <Text style={styles.termsText}>Have an account? Sign in</Text>
        </Link>
      </View>
    </View>
  )
}