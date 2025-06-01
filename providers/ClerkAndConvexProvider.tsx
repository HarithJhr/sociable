import { ClerkLoaded, ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import React from 'react';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!);

if (!publishableKey) {
  throw new Error("NEXT_PUBLIC_PUBLISHABLE_KEY is not set");
}

export default function ClerkAndConvexProvider({children}: {children: React.ReactNode}) {
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            <ClerkLoaded>
                {children}
            </ClerkLoaded>
        </ConvexProviderWithClerk>
    </ClerkProvider>
  )
}