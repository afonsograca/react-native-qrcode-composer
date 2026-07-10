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

// WIFI: values backslash-escape their delimiter characters
const escapeDelimiters = (value: string): string =>
  value.replace(/([\\;,:"])/g, '\\$1');

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
  let vcard = 'BEGIN:VCARD\n';
  vcard += `VERSION:${contents.version ?? '4.0'}\n`;
  vcard += `FN:${contents.fullName}\n`;
  if (contents.address != null) {
    vcard += `ADR:${contents.address}\n`;
  }
  if (contents.anniversary != null) {
    vcard += `ANNIVERSARY:${contents.anniversary}\n`;
  }
  if (contents.birthday != null) {
    vcard += `BDAY:${contents.birthday}\n`;
  }
  if (contents.calendarAddressURI != null) {
    vcard += `CALADRURI:${contents.calendarAddressURI}\n`;
  }
  if (contents.calendarURI != null) {
    vcard += `CALURI:${contents.calendarURI}\n`;
  }
  if (contents.categories != null) {
    vcard += `CATEGORIES:${contents.categories.join(',')}\n`;
  }
  if (contents.clientPIDMap != null) {
    vcard += `CLIENTPIDMAP:${contents.clientPIDMap}\n`;
  }
  if (contents.email != null) {
    vcard += `EMAIL:${contents.email}\n`;
  }
  if (contents.facebookURL != null) {
    vcard += `FBURL:${contents.facebookURL}\n`;
  }
  vcard += 'END:VCARD';
  return vcard;
};

const encodeMeCardContents = (contents: MeCard): string => {
  let mecard = 'MeCard:';
  mecard += `N:${encodeURIComponent(contents.lastName)},${encodeURIComponent(contents.firstName)};`;
  if (contents.nickname != null) {
    mecard += `${encodeURIComponent(contents.nickname)};`;
  }
  if (contents.telephone != null) {
    mecard += `TEL:${encodeURIComponent(contents.telephone)};`;
  }
  if (contents.email != null) {
    mecard += `EMAIL:${encodeURIComponent(contents.email)};`;
  }
  if (contents.birthday != null) {
    mecard += `BDAY:${formatDateToYYYYMMDD(contents.birthday)};`;
  }
  if (contents.address != null) {
    mecard += `ADR:${encodeURIComponent(contents.address)};`;
  }
  if (contents.sound != null) {
    mecard += `SOUND:${encodeURIComponent(contents.sound)};`;
  }
  if (contents.website != null) {
    mecard += `URL:${encodeURIComponent(contents.website)};`;
  }
  if (contents.note != null) {
    mecard += `NOTE:${encodeURIComponent(contents.note)};`;
  }
  if (contents.videoCall != null) {
    mecard += `VIDEO:${encodeURIComponent(contents.videoCall)};`;
  }
  mecard += ';';

  return mecard;
};

const encodeCalendarEventContents = (contents: CalendarEvent): string => {
  let event = 'BEGIN:VEVENT\n';
  event += `UID:${encodeURIComponent(contents.uid)}\n`;
  event += `DTSTART:${formatDateTimeToICalendarFormat(contents.dtStart)}\n`;
  if (contents.dtEnd != null) {
    event += `DTEND:${formatDateTimeToICalendarFormat(contents.dtEnd)}\n`;
  }
  if (contents.dtEnd == null && contents.duration != null) {
    event += `DURATION:${encodeURIComponent(contents.duration)}\n`;
  }
  if (contents.summary != null) {
    event += `SUMMARY:${encodeURIComponent(contents.summary)}\n`;
  }
  if (contents.description != null) {
    event += `DESCRIPTION:${encodeURIComponent(contents.description)}\n`;
  }
  if (contents.location != null) {
    event += `LOCATION:${encodeURIComponent(contents.location)}\n`;
  }
  if (contents.url != null) {
    event += `URL:${encodeURIComponent(contents.url)}\n`;
  }
  if (contents.geo != null) {
    event += `GEO:${contents.geo}\n`;
  }
  if (contents.categories != null) {
    event += `CATEGORIES:${contents.categories.join(',')}\n`;
  }
  if (contents.status != null) {
    event += `STATUS:${contents.status}\n`;
  }
  if (contents.transp != null) {
    event += `TRANSP:${contents.transp}\n`;
  }
  if (contents.organizer != null) {
    event += `ORGANIZER:${encodeURIComponent(contents.organizer)}\n`;
  }
  if (contents.attach != null) {
    event += `ATTACH:${contents.attach}\n`;
  }
  if (contents.priority != null) {
    const priority = Math.min(Math.max(contents.priority, 0), 9).toString();
    event += `PRIORITY:${priority}\n`;
  }
  if (contents.rrule != null) {
    event += `RRULE:${contents.rrule}\n`;
  }
  if (contents.sequence != null) {
    event += `SEQUENCE:${contents.sequence.toString()}\n`;
  }
  if (contents.class != null) {
    event += `CLASS:${contents.class}\n`;
  }
  event += 'END:VEVENT';
  return event;
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
  anniversary?: string;
  birthday?: string;
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
