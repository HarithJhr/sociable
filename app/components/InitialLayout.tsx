import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export default function InitialLayout() {
    // Retrieve authentication status from Clerk using the provided hook
    const { isLoaded, isSignedIn } = useAuth();

    // Retrieve current route segments and router for navigation control
    const segments = useSegments();
    const router = useRouter();

    // useEffect hook to handle navigation based on the auth state and current URL segments
    useEffect(() => {
        // If authentication state is not loaded yet, do nothing
        if (!isLoaded) return

        // Check if the user is currently viewing an authentication screen (i.e., part of the "(auth)" group)
        const inAuthScreen = segments[0] === "(auth)"

        // If the user is not signed in and not on an auth screen, redirect to the login page
        if (!isSignedIn && !inAuthScreen) router.replace("/(auth)/login");
        // If the user is signed in but is on an auth screen, redirect to the main tabs area
        else if (isSignedIn && inAuthScreen) router.replace("/(tabs)");

    // Include dependencies to trigger this effect on state/route changes
    }, [isLoaded, isSignedIn, segments]);

    // Don't render anything until the auth state is loaded
    if (!isLoaded) return null;

    // Render the initial layout stack with header hidden
    return <Stack screenOptions={{ headerShown: false }} />;
}