// We are augmenting (extending) the built-in React Native module declarations.
// "declare module 'react-native'" lets us tell TypeScript about extra native
// modules that are linked into our app, but which React Native does not know
// about by default.
declare module 'react-native' {
  interface NativeModulesStatic {
    // Custom native module: ExitApp (Android only)
    // Provides a method to programmatically close the app.
    ExitApp: {
      exitApp: () => void
    }

    // Custom native module: NotificationManager (Android only)
    // Allows canceling a notification by its integer ID.
    NotificationManager: {
      cancelNotification: (int: number) => void
    }

    // Custom native module: LockedScreen (Android only)
    // Checks if the device screen is currently locked.
    // Returns a Promise resolving to boolean or null.
    LockedScreen: {
      isScreenLocked: () => Promise<boolean | null>
    }

    // Custom native module: MuteApp (Android & iOS)
    // Lets you mute/unmute the entire app’s audio state.
    MuteApp: {
      setMuteAppState: (state: boolean) => void
    }

    // Custom native module: Ringtone (Android & iOS)
    // Sets the ringtone sound for calls/alerts inside the app.
    Ringtone: {
      setRingtone: (ringtone: string) => void
    }

    // Custom native module: MissedCall (Android & iOS)
    // - On iOS: update state to indicate missed calls
    // - On Android: trigger a missed call broadcast receiver
    MissedCall: {
      setMissedCall: (state: boolean) => void // iOS
      triggerMissedCallReceiver: () => void // Android
    }

    // Custom native module: MuteDevice (Android & iOS)
    // Mutes/unmutes the physical device by serial number.
    MuteDevice: {
      muteDevice: (serialNumber: string, state: boolean) => void
    }
  }
}

// Ensure this file is treated as a module by TypeScript
// (so the declaration merging is applied correctly).
export { }
