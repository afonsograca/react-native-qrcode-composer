export type QRCodeContents =
  | string
  | PlainText
  | URL
  | Email
  | Phone
  | SMS
  | WiFi
  | Geolocation;

export const encodeQRCodeContents = (contents: QRCodeContents): string => {
  if (typeof contents === 'string') {
    return contents;
  }
  switch (contents.type) {
    case 'plain-text':
      return contents.content;
    case 'url':
      return contents.url;
    case 'email':
      return encodeEmailContents(contents);
    case 'phone':
      return `tel:${encodePhoneNumber(contents.telephone)}`;
    case 'sms':
      return encodeSMSContents(contents);
    case 'wifi':
      return encodeWiFiContents(contents);
    case 'geolocation':
      return encodeGeolocationContents(contents);
  }
};

const encodeEmailContents = (contents: Email): string => {
  const subject =
    contents.subject != null
      ? `subject=${encodeURIComponent(contents.subject)}`
      : '';
  const body =
    contents.body != null ? `body=${encodeURIComponent(contents.body)}` : '';
  const cc = contents.cc != null ? `cc=${encodeURI(contents.cc)}` : '';
  const bcc = contents.bcc != null ? `bcc=${encodeURI(contents.bcc)}` : '';
  const query = [subject, body, cc, bcc].filter(x => x).join('&');
  return `mailto:${encodeURI(contents.email)}` + (query ? `?${query}` : '');
};

const encodePhoneNumber = (phoneNumber: string): string =>
  phoneNumber.replace(/[\s()-]/g, '');

const encodeSMSContents = (contents: SMS): string =>
  `SMSTO:${encodePhoneNumber(contents.phoneNumber)}:${contents.message != null ? encodeURIComponent(contents.message) : ''}`;

const encodeWiFiContents = (contents: WiFi): string =>
  `WIFI:T:${contents.security};S:${encodeURIComponent(contents.ssid)}` +
  (contents.password != null
    ? `;P:${encodeURIComponent(contents.password)}`
    : '') +
  (contents.hidden != null ? `;H:${encodeURIComponent(contents.hidden)}` : '') +
  ';;';

const encodeGeolocationContents = (contents: Geolocation): string =>
  `geo:${encodeURIComponent(contents.latitude)},${encodeURIComponent(contents.longitude)}` +
  (contents.altitude != null
    ? `,${encodeURIComponent(contents.altitude)}`
    : '');

interface PlainText {
  type: 'plain-text';
  content: string;
}

interface URL {
  type: 'url';
  url: string;
}

interface Email {
  type: 'email';
  email: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

interface Phone {
  type: 'phone';
  telephone: string;
}

interface SMS {
  type: 'sms';
  phoneNumber: string;
  message?: string;
}

type SecurityType = 'WEP' | 'WPA' | 'WPA3' | 'nopass';
interface WiFi {
  type: 'wifi';
  security: SecurityType;
  ssid: string;
  password?: string;
  hidden?: boolean;
}

interface Geolocation {
  type: 'geolocation';
  latitude: number;
  longitude: number;
  altitude?: number;
}

};
