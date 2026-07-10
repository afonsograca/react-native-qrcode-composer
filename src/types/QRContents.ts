export type QRCodeContents =
  | string
  | PlainText
  | URLContent
  | Email
  | Phone
  | SMS
  | WiFi
  | GeolocationContent
  | VCard
  | MeCard
  | CalendarEvent;

export interface PlainText {
  type: 'plain-text';
  content: string;
}

export interface URLContent {
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

export interface GeolocationContent {
  type: 'geolocation';
  latitude: number;
  longitude: number;
  altitude?: number;
}

export interface VCard {
  type: 'vcard';
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
