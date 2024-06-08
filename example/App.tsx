import React from 'react';
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
import {Colors as ReactColors} from 'react-native/Libraries/NewAppScreen';
import {QRCode} from 'react-native-qrcode-composer';
import Logo from 'assets/placeholder.svg';
import placeholder from 'assets/placeholder.png';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Colors = ReactColors as Record<string, ColorValue>;
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: (isDarkMode ? Colors.white : Colors.black) as
              | ColorValue
              | undefined,
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}
      >
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Colors = ReactColors as Record<string, ColorValue>;

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}
      >
        <View
          style={[
            {
              backgroundColor: isDarkMode ? Colors.black : Colors.white,
            },
            styles.scrollView,
          ]}
        >
          <Section title="Simple">
            <QRCode />
          </Section>
          <Section title="With size">
            <QRCode size={200} />
          </Section>
          <Section title="With color">
            <QRCode style={{color: 'grey', backgroundColor: 'yellow'}} />
          </Section>
          <Section title="Round Detection Markers">
            <QRCode
              style={{
                detectionMarkerOptions: {
                  cornerRadius: 1,
                },
              }}
            />
          </Section>
          <Section title="Mixed round detection markers">
            <QRCode
              style={{
                detectionMarkerOptions: {
                  outerCornerRadius: 0.5,
                  innerCornerRadius: 1,
                },
              }}
            />
          </Section>
          <Section title="Rounded pattern styling">
            <QRCode
              style={{
                patternOptions: {
                  cornerRadius: 1,
                },
              }}
            />
          </Section>
          <Section title="Connected rounded pattern styling">
            <QRCode
              style={{
                patternOptions: {
                  connected: true,
                  cornerRadius: 1,
                },
              }}
            />
          </Section>
          <Section title="Image Logo">
            <QRCode logo={placeholder} />
          </Section>
          <Section title="SVG Logo">
            <QRCode logo={Logo} />
          </Section>
          <Section title="Logo with styling">
            <QRCode
              logo={Logo}
              logoStyle={{backgroundColor: 'red', margin: 8, borderRadius: 1}}
            />
          </Section>
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
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  scrollView: {
    paddingBottom: 24,
  },
});

export default App;
