export type QRCodeContents =
  | string
  | PlainText
  | URL
  | Email
  | Phone
  | SMS
  | WiFi
  | Geolocation
  | VCard
  | MeCard
  | CalendarEvent;

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
    case 'vcard':
      return encodeVCardContents(contents);
    case 'mecard':
      return encodeMeCardContents(contents);
    case 'calendar-event':
      return encodeCalendarEventContents(contents);
  }
};

// WIFI: and MECARD: values backslash-escape their delimiter characters
const escapeDelimiters = (value: string): string =>
  value.replace(/([\\;,:"])/g, '\\$1');

// TEXT escaping per RFC 6350 §3.4 and RFC 5545 §3.3.11
const escapeTextValue = (value: string): string =>
  value.replace(/([\\;,])/g, '\\$1').replace(/\r\n|\r|\n/g, '\\n');

type FieldValue = string | undefined;

const encodeField = <T>(
  value: T | undefined,
  format: (value: T) => string,
): FieldValue => (value != null ? format(value) : undefined);

const encodeFieldLines = (fields: [string, FieldValue][]): string[] =>
  fields.flatMap(([key, value]) => (value != null ? [`${key}:${value}`] : []));

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
  `WIFI:T:${contents.security};S:${escapeDelimiters(contents.ssid)}` +
  (contents.password != null
    ? `;P:${escapeDelimiters(contents.password)}`
    : '') +
  (contents.hidden != null ? `;H:${contents.hidden.toString()}` : '') +
  ';;';

const encodeGeolocationContents = (contents: Geolocation): string =>
  `geo:${encodeURIComponent(contents.latitude)},${encodeURIComponent(contents.longitude)}` +
  (contents.altitude != null
    ? `,${encodeURIComponent(contents.altitude)}`
    : '');

const encodeVCardContents = (contents: VCard): string => {
  const fields: [string, FieldValue][] = [
    ['VERSION', contents.version ?? '4.0'],
    ['FN', escapeTextValue(contents.fullName)],
    ['ADR', encodeField(contents.address, escapeTextValue)],
    ['ANNIVERSARY', encodeField(contents.anniversary, formatDateToYYYYMMDD)],
    ['BDAY', encodeField(contents.birthday, formatDateToYYYYMMDD)],
    ['CALADRURI', contents.calendarAddressURI],
    ['CALURI', contents.calendarURI],
    [
      'CATEGORIES',
      encodeField(contents.categories, categories =>
        categories.map(escapeTextValue).join(','),
      ),
    ],
    ['CLIENTPIDMAP', contents.clientPIDMap],
    ['EMAIL', encodeField(contents.email, escapeTextValue)],
    ['FBURL', contents.facebookURL],
    ['GENDER', contents.gender],
    ['GEO', contents.geo],
    ['IMPP', contents.instantMessenger],
    ['KEY', contents.key],
    ['KIND', encodeField(contents.kind, escapeTextValue)],
    ['LANG', encodeField(contents.language, escapeTextValue)],
    ['LOGO', contents.logo],
    ['MEMBER', contents.member],
    [
      'N',
      encodeField(contents.name, name =>
        Array.isArray(name) ? name.map(escapeTextValue).join(';') : name,
      ),
    ],
    ['NICKNAME', encodeField(contents.nickname, escapeTextValue)],
    ['NOTE', encodeField(contents.note, escapeTextValue)],
    ['ORG', encodeField(contents.organization, escapeTextValue)],
    ['PRODID', encodeField(contents.productID, escapeTextValue)],
    ['RELATED', encodeField(contents.related, escapeTextValue)],
    ['ROLE', encodeField(contents.role, escapeTextValue)],
    ['SOUND', contents.sound],
    ['SOURCE', contents.source],
    ['TEL', encodeField(contents.telephone, escapeTextValue)],
    ['TITLE', encodeField(contents.title, escapeTextValue)],
    ['TZ', encodeField(contents.timezone, escapeTextValue)],
    ['UID', encodeField(contents.uid, escapeTextValue)],
    ['URL', contents.url],
    ['XML', contents.xml],
  ];

  return ['BEGIN:VCARD', ...encodeFieldLines(fields), 'END:VCARD'].join('\r\n');
};

const encodeMeCardContents = (contents: MeCard): string => {
  const fields: [string, FieldValue][] = [
    [
      'N',
      `${escapeDelimiters(contents.lastName)},${escapeDelimiters(contents.firstName)}`,
    ],
    ['NICKNAME', encodeField(contents.nickname, escapeDelimiters)],
    ['TEL', encodeField(contents.telephone, escapeDelimiters)],
    ['EMAIL', encodeField(contents.email, escapeDelimiters)],
    ['BDAY', encodeField(contents.birthday, formatDateToYYYYMMDD)],
    ['ADR', encodeField(contents.address, escapeDelimiters)],
    ['SOUND', encodeField(contents.sound, escapeDelimiters)],
    ['URL', encodeField(contents.website, escapeDelimiters)],
    ['NOTE', encodeField(contents.note, escapeDelimiters)],
    ['VIDEO', encodeField(contents.videoCall, escapeDelimiters)],
  ];

  return `MECARD:${encodeFieldLines(fields)
    .map(line => `${line};`)
    .join('')};`;
};

const encodeCalendarEventContents = (contents: CalendarEvent): string => {
  const fields: [string, FieldValue][] = [
    ['UID', escapeTextValue(contents.uid)],
    ['DTSTART', formatDateTimeToICalendarFormat(contents.dtStart)],
    ['DTEND', encodeField(contents.dtEnd, formatDateTimeToICalendarFormat)],
    [
      'DURATION',
      contents.dtEnd == null
        ? encodeField(contents.duration, escapeTextValue)
        : undefined,
    ],
    ['SUMMARY', encodeField(contents.summary, escapeTextValue)],
    ['DESCRIPTION', encodeField(contents.description, escapeTextValue)],
    ['LOCATION', encodeField(contents.location, escapeTextValue)],
    ['URL', contents.url],
    ['GEO', contents.geo],
    [
      'CATEGORIES',
      encodeField(contents.categories, categories =>
        categories.map(escapeTextValue).join(','),
      ),
    ],
    ['STATUS', contents.status],
    ['TRANSP', contents.transp],
    ['ORGANIZER', encodeField(contents.organizer, escapeTextValue)],
    ['ATTACH', contents.attach],
    [
      'PRIORITY',
      encodeField(contents.priority, priority =>
        Math.min(Math.max(priority, 0), 9).toString(),
      ),
    ],
    ['RRULE', contents.rrule],
    [
      'SEQUENCE',
      encodeField(contents.sequence, sequence => sequence.toString()),
    ],
    ['CLASS', contents.class],
  ];

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//react-native-qrcode-composer//EN',
    'BEGIN:VEVENT',
    ...encodeFieldLines(fields),
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
};

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

interface VCard {
  type: 'vcard';
  version?: '2.1' | '3.0' | '4.0';
  address?: string;
  anniversary?: Date;
  birthday?: Date;
  calendarAddressURI?: string;
  calendarURI?: string;
  categories?: string[];
  clientPIDMap?: string;
  email?: string;
  facebookURL?: string;
  fullName: string;
  gender?: 'M' | 'F' | 'O' | 'N' | 'U';
  geo?: string;
  instantMessenger?: string;
  key?: string;
  kind?: string;
  language?: string;
  logo?: string;
  member?: string;
  name?: string | string[];
  nickname?: string;
  note?: string;
  organization?: string;
  productID?: string;
  related?: string;
  role?: string;
  sound?: string;
  source?: string;
  telephone?: string;
  title?: string;
  timezone?: string;
  uid?: string;
  url?: string;
  xml?: string;
}

interface MeCard {
  type: 'mecard';
  address?: string;
  birthday?: Date;
  email?: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  note?: string;
  sound?: string;
  telephone?: string;
  videoCall?: string;
  website?: string;
}

interface CalendarEvent {
  type: 'calendar-event';
  uid: string;
  dtStart: Date;
  dtEnd?: Date;
  duration?: string;
  summary?: string;
  description?: string;
  location?: string;
  url?: string;
  geo?: string;
  categories?: string[];
  status?: 'TENTATIVE' | 'CONFIRMED' | 'CANCELLED';
  transp?: 'TRANSPARENT' | 'OPAQUE';
  organizer?: string;
  attach?: string;
  priority?: number;
  rrule?: string;
  sequence?: number;
  class?: 'PUBLIC' | 'PRIVATE' | 'CONFIDENTIAL';
}

const formatDateToYYYYMMDD = (date: Date) => {
  const year = date.getFullYear().toString();
  // Pad month and day with leading zero if necessary
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
};

const formatDateTimeToICalendarFormat = (dateTime: Date): string => {
  const year = dateTime.getUTCFullYear().toString();
  const month = (dateTime.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = dateTime.getUTCDate().toString().padStart(2, '0');
  const hours = dateTime.getUTCHours().toString().padStart(2, '0');
  const minutes = dateTime.getUTCMinutes().toString().padStart(2, '0');
  const seconds = dateTime.getUTCSeconds().toString().padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
};
