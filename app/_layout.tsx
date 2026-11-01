import { Buffer } from 'buffer';
if (typeof (globalThis as any).Buffer === 'undefined') {
  (globalThis as any).Buffer = Buffer;
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import { useColorScheme } from 'react-native';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

import { configureNotificationHandler } from '@/lib/alarm/permissions';
import { initDatabase } from '@/lib/db/client';
import { RootStoreProvider, rootStore } from '@/store/RootStore';
import { useEffect } from 'react';

/**
 * Reactive status bar component that dynamically reflects the selected ThemeMode:
 * - If Theme is 'light': StatusBar style is 'dark' (black icons on light background)
 * - If Theme is 'dark': StatusBar style is 'light' (white icons on dark background)
 * - If Theme is 'system': Follows the device colorScheme dynamically
 */
const ThemedStatusBar = observer(function ThemedStatusBar() {
  const systemScheme = useColorScheme();
  const themeMode = rootStore.uiStore.theme || 'system';

  const isDarkMode =
    themeMode === 'dark' || (themeMode === 'system' && systemScheme === 'dark');

  return <StatusBar
    style={'dark'}
  // style={isDarkMode ? 'light' : 'dark'} 
  />;
});

export default function RootLayout() {
  useEffect(() => {
    configureNotificationHandler();
    initDatabase()
      .then(() => rootStore.todosStore.loadTodos())
      .catch((err) => console.error('Database initialization error:', err));
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <RootStoreProvider value={rootStore}>
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          </Stack>
          <ThemedStatusBar />
        </QueryClientProvider>
      </RootStoreProvider>
    </GestureHandlerRootView>
  );
}