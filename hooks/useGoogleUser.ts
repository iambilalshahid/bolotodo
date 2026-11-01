import * as Device from 'expo-device';
import { useState } from 'react';

export interface UserProfile {
  name: string;
}

export function useGoogleUser() {
  const [user, setUser] = useState<UserProfile>({
    name: Device.deviceName || 'Bilal',
  });

  return {
    user,
    setUserName: (name: string) => setUser({ name }),
  };
}
