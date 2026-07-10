import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import type {ColorValue} from 'react-native';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {ErrorCorrectionLevel, QRCode} from 'react-native-qrcode-composer';
import type {QRCodeProps} from 'react-native-qrcode-composer';
import Logo from './assets/placeholder.svg';
import placeholder from './assets/placeholder.png';

type ThemeColors = {
  background: ColorValue;
  surface: ColorValue;
  title: ColorValue;
  error: ColorValue;
};

const palette: Record<'light' | 'dark', ThemeColors> = {
  light: {
    background: '#F3F3F3',
    surface: '#FFFFFF',
    title: '#1B1B1B',
    error: '#B00020',
  },
  dark: {
    background: '#0B0B0B',
    surface: '#000000',
    title: '#FFFFFF',
    error: '#CF6679',
  },
};

function useThemeColors(): ThemeColors {
  const isDarkMode = useColorScheme() === 'dark';
  return isDarkMode ? palette.dark : palette.light;
}

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const colors = useThemeColors();
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, {color: colors.title}]}>{title}</Text>
      <View style={styles.sectionBody}>{children}</View>
    </View>
  );
}

type Demo = {
  title: string;
  props: QRCodeProps;
};

const demos: Demo[] = [
  {title: 'Simple', props: {value: 'Simple QR code'}},
  {title: 'With size', props: {value: 'QR code with a custom size', size: 200}},
  {
    title: 'With color',
    props: {
      value: 'QR code with custom colors',
      style: {color: '#753a88', backgroundColor: '#FF0099'},
    },
  },
  {
    title: 'With gradient',
    props: {
      value: 'QR code with a gradient',
      style: {linearGradient: ['#FBD786', '#f7797d']},
    },
  },
  {
    title: 'Diagonal gradient direction',
    props: {
      value: 'QR code with a diagonal gradient',
      style: {
        linearGradient: ['#FBD786', '#f7797d'],
        gradientDirection: ['0%', '0%', '100%', '100%'],
      },
    },
  },
  {
    title: 'High error correction and quiet zone',
    props: {
      value: 'QR code with extra resilience',
      style: {
        errorCorrectionLevel: ErrorCorrectionLevel.H,
        quietZone: 16,
      },
    },
  },
  {
    title: 'Round Detection Markers',
    props: {
      value: 'QR code with round detection markers',
      style: {detectionMarkerOptions: {cornerRadius: 1}},
    },
  },
  {
    title: 'Mixed round detection markers',
    props: {
      value: 'QR code with mixed round detection markers',
      style: {
        detectionMarkerOptions: {outerCornerRadius: 0.5, innerCornerRadius: 1},
      },
    },
  },
  {
    title: 'Rounded pattern styling',
    props: {
      value: 'QR code with a rounded pattern',
      style: {patternOptions: {cornerRadius: 1}},
    },
  },
  {
    title: 'Connected rounded pattern styling',
    props: {
      value: 'QR code with a connected rounded pattern',
      style: {patternOptions: {connected: true, cornerRadius: 1}},
    },
  },
  {
    title: 'Image Logo',
    props: {value: 'QR code with an image logo', logo: placeholder},
  },
  {title: 'SVG Logo', props: {value: 'QR code with an SVG logo', logo: Logo}},
  {
    title: 'Logo with styling',
    props: {
      value: 'QR code with a styled logo',
      logo: Logo,
      logoStyle: {backgroundColor: '#99f2c8', margin: 8, borderRadius: 1},
    },
  },
  {
    title: 'URL content',
    props: {value: {type: 'url', url: 'https://reactnative.dev'}},
  },
  {
    title: 'Email content',
    props: {
      value: {
        type: 'email',
        email: 'hello@example.com',
        subject: 'Hi there',
        body: 'Scanned from a QR code',
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
      },
    },
  },
  {
    title: 'Phone content',
    props: {value: {type: 'phone', telephone: '+15551234567'}},
  },
  {
    title: 'SMS content',
    props: {
      value: {
        type: 'sms',
        phoneNumber: '+15551234567',
        message: 'Hello from a QR code',
      },
    },
  },
  {
    title: 'WiFi content',
    props: {
      value: {
        type: 'wifi',
        security: 'WPA',
        ssid: 'GuestNetwork',
        password: 'supersecret',
        hidden: false,
      },
    },
  },
  {
    title: 'Geolocation content',
    props: {
      value: {
        type: 'geolocation',
        latitude: 37.7749,
        longitude: -122.4194,
        altitude: 16,
      },
    },
  },
  {
    title: 'VCard content',
    props: {
      value: {
        type: 'vcard',
        fullName: 'Ada Lovelace',
        organization: 'Analytical Engines',
        title: 'Mathematician',
        email: 'ada@example.com',
        telephone: '+15557654321',
        url: 'https://example.com/ada',
      },
    },
  },
  {
    title: 'MeCard content',
    props: {
      value: {
        type: 'mecard',
        firstName: 'Grace',
        lastName: 'Hopper',
        email: 'grace@example.com',
        telephone: '+15550001111',
        website: 'https://example.com/grace',
      },
    },
  },
  {
    title: 'Calendar event content',
    props: {
      value: {
        type: 'calendar-event',
        uid: 'event-001@example.com',
        dtStart: new Date('2026-08-01T09:00:00Z'),
        dtEnd: new Date('2026-08-01T10:00:00Z'),
        summary: 'Launch review',
        location: 'Room 4',
        status: 'CONFIRMED',
      },
    },
  },
];

function ErrorDemo(): React.JSX.Element {
  const colors = useThemeColors();
  const [error, setError] = useState<string | null>(null);
  return (
    <Section title="Failing to generate a QR code">
      <QRCode value="" onError={e => setError(e.message)} />
      {error !== null && (
        <Text style={[styles.errorText, {color: colors.error}]}>{error}</Text>
      )}
    </Section>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = useThemeColors();

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={{backgroundColor: colors.background}}
      >
        <View style={[styles.scrollView, {backgroundColor: colors.surface}]}>
          {demos.map(demo => (
            <Section key={demo.title} title={demo.title}>
              <QRCode {...demo.props} />
            </Section>
          ))}
          <ErrorDemo />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionBody: {
    marginTop: 8,
  },
  errorText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '500',
  },
  scrollView: {
    paddingBottom: 24,
  },
});

export default App;
