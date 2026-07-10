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

const text = (value?: string): FieldValue =>
  encodeField(value, escapeTextValue);
// URI value type — not TEXT-escaped per RFC 6350 §3.4 / RFC 5545 §3.3.13
const uri = (value?: string): FieldValue => value;
const date = (value?: Date): FieldValue =>
  encodeField(value, formatDateToYYYYMMDD);
const dateTime = (value?: Date): FieldValue =>
  encodeField(value, formatDateTimeToICalendarFormat);
const delimited = (value?: string): FieldValue =>
  encodeField(value, escapeDelimiters);

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
    ['FN', text(contents.fullName)],
    ['ADR', text(contents.address)],
    ['ANNIVERSARY', date(contents.anniversary)],
    ['BDAY', date(contents.birthday)],
    ['CALADRURI', uri(contents.calendarAddressURI)],
    ['CALURI', uri(contents.calendarURI)],
    [
      'CATEGORIES',
      encodeField(contents.categories, categories =>
        categories.map(escapeTextValue).join(','),
      ),
    ],
    ['CLIENTPIDMAP', uri(contents.clientPIDMap)],
    ['EMAIL', text(contents.email)],
    ['FBURL', uri(contents.facebookURL)],
    ['GENDER', uri(contents.gender)],
    ['GEO', uri(contents.geo)],
    ['IMPP', uri(contents.instantMessenger)],
    ['KEY', uri(contents.key)],
    ['KIND', text(contents.kind)],
    ['LANG', text(contents.language)],
    ['LOGO', uri(contents.logo)],
    ['MEMBER', uri(contents.member)],
    [
      'N',
      encodeField(contents.name, name =>
        Array.isArray(name) ? name.map(escapeTextValue).join(';') : name,
      ),
    ],
    ['NICKNAME', text(contents.nickname)],
    ['NOTE', text(contents.note)],
    ['ORG', text(contents.organization)],
    ['PRODID', text(contents.productID)],
    ['RELATED', text(contents.related)],
    ['ROLE', text(contents.role)],
    ['SOUND', uri(contents.sound)],
    ['SOURCE', uri(contents.source)],
    ['TEL', text(contents.telephone)],
    ['TITLE', text(contents.title)],
    ['TZ', text(contents.timezone)],
    ['UID', text(contents.uid)],
    ['URL', uri(contents.url)],
    ['XML', uri(contents.xml)],
  ];

  return ['BEGIN:VCARD', ...encodeFieldLines(fields), 'END:VCARD'].join('\r\n');
};

const encodeMeCardContents = (contents: MeCard): string => {
  const fields: [string, FieldValue][] = [
    [
      'N',
      `${escapeDelimiters(contents.lastName)},${escapeDelimiters(contents.firstName)}`,
    ],
    ['NICKNAME', delimited(contents.nickname)],
    ['TEL', delimited(contents.telephone)],
    ['EMAIL', delimited(contents.email)],
    ['BDAY', date(contents.birthday)],
    ['ADR', delimited(contents.address)],
    ['SOUND', delimited(contents.sound)],
    ['URL', delimited(contents.website)],
    ['NOTE', delimited(contents.note)],
    ['VIDEO', delimited(contents.videoCall)],
  ];

  return `MECARD:${encodeFieldLines(fields).join(';')};;`;
};

const encodeCalendarEventContents = (contents: CalendarEvent): string => {
  const fields: [string, FieldValue][] = [
    ['UID', text(contents.uid)],
    ['DTSTART', dateTime(contents.dtStart)],
    ['DTEND', dateTime(contents.dtEnd)],
    ['DURATION', contents.dtEnd == null ? text(contents.duration) : undefined],
    ['SUMMARY', text(contents.summary)],
    ['DESCRIPTION', text(contents.description)],
    ['LOCATION', text(contents.location)],
    ['URL', uri(contents.url)],
    ['GEO', uri(contents.geo)],
    [
      'CATEGORIES',
      encodeField(contents.categories, categories =>
        categories.map(escapeTextValue).join(','),
      ),
    ],
    ['STATUS', uri(contents.status)],
    ['TRANSP', uri(contents.transp)],
    ['ORGANIZER', text(contents.organizer)],
    ['ATTACH', uri(contents.attach)],
    [
      'PRIORITY',
      encodeField(contents.priority, priority =>
        Math.min(Math.max(priority, 0), 9).toString(),
      ),
    ],
    ['RRULE', uri(contents.rrule)],
    [
      'SEQUENCE',
      encodeField(contents.sequence, sequence => sequence.toString()),
    ],
    ['CLASS', uri(contents.class)],
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

export interface PlainText {
  type: 'plain-text';
  content: string;
}

export interface URL {
  type: 'url';
  url: string;
}

export interface Email {
  type: 'email';
  email: string;
  subject?: string;
  body?: string;
  cc?: string;
  bcc?: string;
}

export interface Phone {
  type: 'phone';
  telephone: string;
}

export interface SMS {
  type: 'sms';
  phoneNumber: string;
  message?: string;
}

export type SecurityType = 'WEP' | 'WPA' | 'WPA3' | 'nopass';
export interface WiFi {
  type: 'wifi';
  security: SecurityType;
  ssid: string;
  password?: string;
  hidden?: boolean;
}

export interface Geolocation {
  type: 'geolocation';
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface VCard {
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

export interface MeCard {
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

export interface CalendarEvent {
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
