import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';

const API = process.env.REACT_APP_API_SERVER_URL;

const usePushNotifications = () => {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const token = localStorage.getItem('authToken');
    if (!token) return;

    const register = async () => {
      try {
        let permStatus = await PushNotifications.checkPermissions();
        if (permStatus.receive === 'prompt') {
          permStatus = await PushNotifications.requestPermissions();
        }
        if (permStatus.receive !== 'granted') return;
        await PushNotifications.register();
      } catch (err) {
        console.error('[PushNotifications] Registration error:', err);
      }
    };

    const handleRegistration = async (event) => {
      const deviceToken = event.value;
      try {
        await fetch(`${API}/api/v1/device_tokens`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ device_token: deviceToken, platform: 'ios' }),
        });
      } catch (err) {
        console.error('[PushNotifications] Failed to save token:', err);
      }
    };

    const handleRegistrationError = (error) => {
      console.error('[PushNotifications] Registration failed:', error);
    };

    const handleNotificationReceived = (notification) => {
      console.log('[PushNotifications] Foreground notification:', notification);
    };

    const handleNotificationActionPerformed = (action) => {
      console.log('[PushNotifications] Tapped:', action.notification);
    };

    PushNotifications.addListener('registration', handleRegistration);
    PushNotifications.addListener('registrationError', handleRegistrationError);
    PushNotifications.addListener('pushNotificationReceived', handleNotificationReceived);
    PushNotifications.addListener('pushNotificationActionPerformed', handleNotificationActionPerformed);

    register();

    return () => { PushNotifications.removeAllListeners(); };
  }, []);
};

export default usePushNotifications;
