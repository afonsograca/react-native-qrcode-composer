import type {
  QRCodeContents,
  Email,
  SMS,
  WiFi,
  GeolocationContent,
  VCard,
  MeCard,
  CalendarEvent,
} from '../types/QRContents';

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

const encodeMailtoQuery = (params: [string, FieldValue][]): string =>
  params
    .flatMap(([key, value]) =>
      value != null ? [`${key}=${encodeURIComponent(value)}`] : [],
    )
    .join('&');

const encodeEmailContents = (contents: Email): string => {
  const query = encodeMailtoQuery([
    ['subject', contents.subject],
    ['body', contents.body],
    ['cc', contents.cc],
    ['bcc', contents.bcc],
  ]);
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

const encodeGeolocationContents = (contents: GeolocationContent): string =>
  `geo:${String(contents.latitude)},${String(contents.longitude)}` +
  (contents.altitude != null ? `,${String(contents.altitude)}` : '');

const encodeVCardContents = (contents: VCard): string => {
  const fields: [string, FieldValue][] = [
    ['VERSION', '4.0'],
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
        Array.isArray(name)
          ? name.map(escapeTextValue).join(';')
          : escapeTextValue(name),
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
