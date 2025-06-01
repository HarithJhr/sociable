import ClerkAndConvexProvider from "@/providers/ClerkAndConvexProvider";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from './components/InitialLayout';


const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("NEXT_PUBLIC_PUBLISHABLE_KEY is not set");
}


 
export default function RootLayout() {
  return (
    <ClerkAndConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
          <InitialLayout />
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkAndConvexProvider>
  )
}
