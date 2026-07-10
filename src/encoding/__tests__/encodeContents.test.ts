import {encodeQRCodeContents} from '../encodeContents';

describe('QRContents', () => {
  describe('Plain text', () => {
    it('should encode plain text correctly', () => {
      const plainText = {type: 'plain-text' as const, content: 'Hello World'};
      expect(encodeQRCodeContents(plainText)).toEqual('Hello World');
    });
    it('should encode actual text correctly', () => {
      const expectedContent = 'Hello World';
      expect(encodeQRCodeContents(expectedContent)).toEqual(expectedContent);
    });
  });

  describe('URL QRCodeContents', () => {
    it('should encode URL correctly', () => {
      const url = {type: 'url' as const, url: 'https://example.com'};
      expect(encodeQRCodeContents(url)).toEqual('https://example.com');
    });

    it('should encode URL with query parameters correctly', () => {
      const url = {
        type: 'url' as const,
        url: 'https://example.com/search?q=github+copilot',
      };
      expect(encodeQRCodeContents(url)).toEqual(
        'https://example.com/search?q=github+copilot',
      );
    });

    it('should encode URL with special characters correctly', () => {
      const url = {type: 'url' as const, url: 'https://example.com/!@#$%^&*()'};
      expect(encodeQRCodeContents(url)).toEqual(
        'https://example.com/!@#$%^&*()',
      );
    });

    it('should encode URL with encoded characters correctly', () => {
      const url = {
        type: 'url' as const,
        url: 'https://example.com/%20%3C%3E%23%25%7B%7D%7C%5C%5E%7E%5B%5D%60%3B%2F%3F%3A%40%3D%26%24',
      };
      expect(encodeQRCodeContents(url)).toEqual(
        'https://example.com/%20%3C%3E%23%25%7B%7D%7C%5C%5E%7E%5B%5D%60%3B%2F%3F%3A%40%3D%26%24',
      );
    });

    it('should encode URL with international characters correctly', () => {
      const url = {type: 'url' as const, url: 'https://example.com/こんにちは'};
      expect(encodeQRCodeContents(url)).toEqual(
        'https://example.com/こんにちは',
      );
    });
  });

  describe('Email QRCodeContents', () => {
    it('should encode email correctly', () => {
      const email = {
        type: 'email' as const,
        email: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body',
        cc: 'cc@example.com',
        bcc: 'bcc@example.com',
      };
      expect(encodeQRCodeContents(email)).toEqual(
        'mailto:test@example.com?subject=Test%20Subject&body=Test%20Body&cc=cc%40example.com&bcc=bcc%40example.com',
      );
    });

    it('should encode email with minimal fields correctly', () => {
      const email = {type: 'email' as const, email: 'test@example.com'};
      expect(encodeQRCodeContents(email)).toEqual('mailto:test@example.com');
    });

    it('should encode email with special characters in subject and body correctly', () => {
      const email = {
        type: 'email' as const,
        email: 'test@example.com',
        subject: "Special Characters: !@#$;%^&*-_.!~*'()",
        body: "Special Characters: !@#$;%^&*-_.!~*'()",
      };
      expect(encodeQRCodeContents(email)).toEqual(
        "mailto:test@example.com?subject=Special%20Characters%3A%20!%40%23%24%3B%25%5E%26*-_.!~*'()" +
          "&body=Special%20Characters%3A%20!%40%23%24%3B%25%5E%26*-_.!~*'()",
      );
    });

    it('should encode email with no subject or body correctly', () => {
      const email = {
        type: 'email' as const,
        email: 'test@example.com',
        cc: 'cc@example.com',
      };
      expect(encodeQRCodeContents(email)).toEqual(
        'mailto:test@example.com?cc=cc%40example.com',
      );
    });

    it('should percent-encode reserved characters in cc and bcc', () => {
      const email = {
        type: 'email' as const,
        email: 'test@example.com',
        cc: 'a&b=c@example.com',
        bcc: 'd+e?f@example.com',
      };
      expect(encodeQRCodeContents(email)).toEqual(
        'mailto:test@example.com?cc=a%26b%3Dc%40example.com' +
          '&bcc=d%2Be%3Ff%40example.com',
      );
    });

    it('should encode email with no cc or bcc correctly', () => {
      const email = {
        type: 'email' as const,
        email: 'test@example.com',
        subject: 'Test Subject',
        body: 'Test Body',
      };
      expect(encodeQRCodeContents(email)).toEqual(
        'mailto:test@example.com?subject=Test%20Subject&body=Test%20Body',
      );
    });
  });

  describe('Phone QRCodeContents', () => {
    it('should encode phone number correctly', () => {
      const phone = {type: 'phone' as const, telephone: '123456789'};
      expect(encodeQRCodeContents(phone)).toEqual('tel:123456789');
    });

    it('should encode phone number with special characters correctly', () => {
      const phone = {type: 'phone' as const, telephone: '+1 (123) 456-7890'};
      expect(encodeQRCodeContents(phone)).toEqual('tel:+11234567890');
    });

    it('should encode phone number with international format correctly', () => {
      const phone = {type: 'phone' as const, telephone: '+44 123 456 7890'};
      expect(encodeQRCodeContents(phone)).toEqual('tel:+441234567890');
    });
  });

  describe('SMS QRCodeContents', () => {
    it('should encode SMS correctly', () => {
      const sms = {
        type: 'sms' as const,
        phoneNumber: '123456789',
        message: 'Hello World',
      };
      expect(encodeQRCodeContents(sms)).toEqual(
        'SMSTO:123456789:Hello%20World',
      );
    });

    it('should encode SMS with no message correctly', () => {
      const sms = {
        type: 'sms' as const,
        phoneNumber: '123456789',
      };
      expect(encodeQRCodeContents(sms)).toEqual('SMSTO:123456789:');
    });

    it('should encode SMS with special characters in message correctly', () => {
      const sms = {
        type: 'sms' as const,
        phoneNumber: '123456789',
        message: "Special Characters: !@#$;%^&*-_.!~*'()",
      };
      expect(encodeQRCodeContents(sms)).toEqual(
        "SMSTO:123456789:Special%20Characters%3A%20!%40%23%24%3B%25%5E%26*-_.!~*'()",
      );
    });

    it('should encode SMS with special characters in phone number correctly', () => {
      const sms = {
        type: 'sms' as const,
        phoneNumber: '+1 (123) 456-7890',
        message: 'Hello World',
      };
      expect(encodeQRCodeContents(sms)).toEqual(
        'SMSTO:+11234567890:Hello%20World',
      );
    });

    it('should encode SMS with encoded characters in message correctly', () => {
      const sms = {
        type: 'sms' as const,
        phoneNumber: '123456789',
        message: 'Hello%20World',
      };
      expect(encodeQRCodeContents(sms)).toEqual(
        'SMSTO:123456789:Hello%2520World',
      );
    });

    it('should encode SMS with encoded characters in phone number correctly', () => {
      const sms = {
        type: 'sms' as const,
        phoneNumber: '123%20456%207890',
        message: 'Hello World',
      };
      expect(encodeQRCodeContents(sms)).toEqual(
        'SMSTO:123%20456%207890:Hello%20World',
      );
    });

    it('should encode SMS with international phone number correctly', () => {
      const sms = {
        type: 'sms' as const,
        phoneNumber: '+44 123 456 7890',
        message: 'Hello World',
      };
      expect(encodeQRCodeContents(sms)).toEqual(
        'SMSTO:+441234567890:Hello%20World',
      );
    });
  });

  describe('WiFi QRCodeContents', () => {
    it('should encode WiFi with minimal fields correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'nopass' as const,
        ssid: 'MyWiFi',
      };
      expect(encodeQRCodeContents(wifi)).toEqual('WIFI:T:nopass;S:MyWiFi;;');
    });

    it('should escape special characters in SSID correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WPA' as const,
        ssid: 'My;Wi:Fi,"Net\\work"',
        password: 'password123',
        hidden: false,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WPA;S:My\\;Wi\\:Fi\\,\\"Net\\\\work\\";P:password123;H:false;;',
      );
    });

    it('should escape special characters in password correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WPA' as const,
        ssid: 'MyWiFi',
        password: 'a\\b;c,d:e"f',
        hidden: false,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WPA;S:MyWiFi;P:a\\\\b\\;c\\,d\\:e\\"f;H:false;;',
      );
    });

    it('should keep percent-encoded characters in password literal', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WPA' as const,
        ssid: 'MyWiFi',
        password: 'password%20123',
        hidden: false,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WPA;S:MyWiFi;P:password%20123;H:false;;',
      );
    });

    it('should encode WiFi with hidden network correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WPA' as const,
        ssid: 'MyWiFi',
        password: 'password123',
        hidden: true,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WPA;S:MyWiFi;P:password123;H:true;;',
      );
    });

    it('should encode WiFi with all fields correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WEP' as const,
        ssid: 'MyWiFi',
        password: 'password123',
        hidden: false,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WEP;S:MyWiFi;P:password123;H:false;;',
      );
    });

    it('should encode WiFi with empty password correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WPA' as const,
        ssid: 'MyWiFi',
        password: '',
        hidden: false,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WPA;S:MyWiFi;P:;H:false;;',
      );
    });

    it('should encode WiFi with long password correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WPA' as const,
        ssid: 'MyWiFi',
        password:
          'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890;!@#$%^&*()',
        hidden: false,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WPA;S:MyWiFi;P:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890\\;!@#$%^&*();H:false;;',
      );
    });
  });

  describe('Geolocation QRCodeContents', () => {
    it('should encode geolocation with altitude correctly', () => {
      const geolocation = {
        type: 'geolocation' as const,
        latitude: 1.234,
        longitude: 5.678,
        altitude: 100,
      };
      expect(encodeQRCodeContents(geolocation)).toEqual('geo:1.234,5.678,100');
    });

    it('should encode geolocation with negative latitude and longitude correctly', () => {
      const geolocation = {
        type: 'geolocation' as const,
        latitude: -1.234,
        longitude: -5.678,
      };
      expect(encodeQRCodeContents(geolocation)).toEqual('geo:-1.234,-5.678');
    });

    it('should encode geolocation with zero altitude correctly', () => {
      const geolocation = {
        type: 'geolocation' as const,
        latitude: 1.234,
        longitude: 5.678,
        altitude: 0,
      };
      expect(encodeQRCodeContents(geolocation)).toEqual('geo:1.234,5.678,0');
    });

    it('should encode geolocation with undefined altitude correctly', () => {
      const geolocation = {
        type: 'geolocation' as const,
        latitude: 1.234,
        longitude: 5.678,
        altitude: undefined,
      };
      expect(encodeQRCodeContents(geolocation)).toEqual('geo:1.234,5.678');
    });
  });

  describe('MeCard QRCodeContents', () => {
    it('should encode MeCard with minimal fields correctly', () => {
      const mecard = {
        type: 'mecard' as const,
        firstName: 'John',
        lastName: 'Doe',
      };
      expect(encodeQRCodeContents(mecard)).toEqual('MECARD:N:Doe,John;;');
    });

    it('should encode MeCard with all fields correctly', () => {
      const mecard = {
        type: 'mecard' as const,
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        telephone: '+1234567890',
        email: 'john@example.com',
        birthday: new Date(1990, 0, 5),
        address: '123 Main St',
        sound: 'dou',
        website: 'example.com',
        note: 'A note',
        videoCall: 'video.example.com',
      };
      expect(encodeQRCodeContents(mecard)).toEqual(
        'MECARD:N:Doe,John;NICKNAME:Johnny;TEL:+1234567890;' +
          'EMAIL:john@example.com;BDAY:19900105;ADR:123 Main St;SOUND:dou;' +
          'URL:example.com;NOTE:A note;VIDEO:video.example.com;;',
      );
    });

    it('should encode the nickname with its own key', () => {
      const mecard = {
        type: 'mecard' as const,
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'Johnny',
        telephone: '123456789',
      };
      expect(encodeQRCodeContents(mecard)).toEqual(
        'MECARD:N:Doe,John;NICKNAME:Johnny;TEL:123456789;;',
      );
    });

    it('should escape special characters in values', () => {
      const mecard = {
        type: 'mecard' as const,
        firstName: 'Ann,Marie',
        lastName: 'O;Brien',
        note: 'quote:"hi"\\bye',
      };
      expect(encodeQRCodeContents(mecard)).toEqual(
        'MECARD:N:O\\;Brien,Ann\\,Marie;NOTE:quote\\:\\"hi\\"\\\\bye;;',
      );
    });

    it('should format the birthday as YYYYMMDD', () => {
      const mecard = {
        type: 'mecard' as const,
        firstName: 'John',
        lastName: 'Doe',
        birthday: new Date(2024, 11, 31),
      };
      expect(encodeQRCodeContents(mecard)).toEqual(
        'MECARD:N:Doe,John;BDAY:20241231;;',
      );
    });
  });

  describe('VCard QRCodeContents', () => {
    it('should encode vCard with minimal fields correctly', () => {
      const vcard = {type: 'vcard' as const, fullName: 'John Doe'};
      expect(encodeQRCodeContents(vcard)).toEqual(
        ['BEGIN:VCARD', 'VERSION:4.0', 'FN:John Doe', 'END:VCARD'].join('\r\n'),
      );
    });

    it('should encode vCard with all fields correctly', () => {
      const vcard = {
        type: 'vcard' as const,
        fullName: 'John Doe',
        address: '123 Main St',
        anniversary: new Date(2010, 5, 15),
        birthday: new Date(1990, 0, 5),
        calendarAddressURI: 'mailto:calendar@example.com',
        calendarURI: 'https://example.com/calendar.ics',
        categories: ['friend', 'colleague'],
        clientPIDMap: '1;urn:uuid:53e374d9-337e-4727-8803-a1e9c14e0556',
        email: 'john@example.com',
        facebookURL: 'https://facebook.com/johndoe',
        gender: 'M' as const,
        geo: 'geo:37.386013,-122.082932',
        instantMessenger: 'xmpp:john@example.com',
        key: 'https://example.com/key.pgp',
        kind: 'individual',
        language: 'en',
        logo: 'https://example.com/logo.png',
        member: 'urn:uuid:03a0e51f-d1aa-4385-8a53-e29025acd8af',
        name: ['Doe', 'John', '', '', ''],
        nickname: 'Johnny',
        note: 'A note',
        organization: 'ACME Inc.',
        productID: '-//Example//vCard//EN',
        related: 'urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
        role: 'Engineer',
        sound: 'https://example.com/sound.mp3',
        source: 'https://example.com/johndoe.vcf',
        telephone: '+1234567890',
        title: 'Senior Engineer',
        timezone: 'America/New_York',
        uid: 'urn:uuid:4fbe8971-0bc3-424c-9c26-36c3e1eff6b1',
        url: 'https://example.com',
        xml: '<a xmlns="http://www.w3.org/1999/xhtml" href="https://example.com">Example</a>',
      };
      expect(encodeQRCodeContents(vcard)).toEqual(
        [
          'BEGIN:VCARD',
          'VERSION:4.0',
          'FN:John Doe',
          'ADR:123 Main St',
          'ANNIVERSARY:20100615',
          'BDAY:19900105',
          'CALADRURI:mailto:calendar@example.com',
          'CALURI:https://example.com/calendar.ics',
          'CATEGORIES:friend,colleague',
          'CLIENTPIDMAP:1;urn:uuid:53e374d9-337e-4727-8803-a1e9c14e0556',
          'EMAIL:john@example.com',
          'FBURL:https://facebook.com/johndoe',
          'GENDER:M',
          'GEO:geo:37.386013,-122.082932',
          'IMPP:xmpp:john@example.com',
          'KEY:https://example.com/key.pgp',
          'KIND:individual',
          'LANG:en',
          'LOGO:https://example.com/logo.png',
          'MEMBER:urn:uuid:03a0e51f-d1aa-4385-8a53-e29025acd8af',
          'N:Doe;John;;;',
          'NICKNAME:Johnny',
          'NOTE:A note',
          'ORG:ACME Inc.',
          'PRODID:-//Example//vCard//EN',
          'RELATED:urn:uuid:f81d4fae-7dec-11d0-a765-00a0c91e6bf6',
          'ROLE:Engineer',
          'SOUND:https://example.com/sound.mp3',
          'SOURCE:https://example.com/johndoe.vcf',
          'TEL:+1234567890',
          'TITLE:Senior Engineer',
          'TZ:America/New_York',
          'UID:urn:uuid:4fbe8971-0bc3-424c-9c26-36c3e1eff6b1',
          'URL:https://example.com',
          'XML:<a xmlns="http://www.w3.org/1999/xhtml" href="https://example.com">Example</a>',
          'END:VCARD',
        ].join('\r\n'),
      );
    });

    it('should use CRLF line endings', () => {
      const vcard = {type: 'vcard' as const, fullName: 'John Doe'};
      const encoded = encodeQRCodeContents(vcard);
      expect(encoded).not.toMatch(/[^\r]\n/);
      expect(encoded.split('\r\n')).toHaveLength(4);
    });

    it('should escape text values per RFC 6350', () => {
      const vcard = {
        type: 'vcard' as const,
        fullName: 'Doe; John, Jr.\\',
        note: 'line one\nline two',
        organization: 'ACME, Inc.; R&D',
      };
      expect(encodeQRCodeContents(vcard)).toEqual(
        [
          'BEGIN:VCARD',
          'VERSION:4.0',
          'FN:Doe\\; John\\, Jr.\\\\',
          'NOTE:line one\\nline two',
          'ORG:ACME\\, Inc.\\; R&D',
          'END:VCARD',
        ].join('\r\n'),
      );
    });

    it('should escape commas in category items', () => {
      const vcard = {
        type: 'vcard' as const,
        fullName: 'John Doe',
        categories: ['friends, family', 'work'],
      };
      expect(encodeQRCodeContents(vcard)).toContain(
        'CATEGORIES:friends\\, family,work',
      );
    });

    it('should join name components with semicolons', () => {
      const vcard = {
        type: 'vcard' as const,
        fullName: 'John Doe',
        name: ['Doe', 'John', 'Quinlan', 'Mr.', 'Esq.'],
      };
      expect(encodeQRCodeContents(vcard)).toContain(
        'N:Doe;John;Quinlan;Mr.;Esq.',
      );
    });

    it('should escape a name provided as a string', () => {
      const vcard = {
        type: 'vcard' as const,
        fullName: 'John Doe',
        name: 'Doe;John;;;',
      };
      expect(encodeQRCodeContents(vcard)).toContain('N:Doe\\;John\\;\\;\\;');
    });

    it('should escape commas and semicolons in a string name', () => {
      const vcard = {
        type: 'vcard' as const,
        fullName: 'Ada Lovelace',
        name: 'Lovelace, Ada; Countess',
      };
      expect(encodeQRCodeContents(vcard)).toContain(
        'N:Lovelace\\, Ada\\; Countess',
      );
    });

    it('should format birthday and anniversary as YYYYMMDD', () => {
      const vcard = {
        type: 'vcard' as const,
        fullName: 'John Doe',
        birthday: new Date(1985, 2, 9),
        anniversary: new Date(2012, 9, 1),
      };
      const encoded = encodeQRCodeContents(vcard);
      expect(encoded).toContain('BDAY:19850309');
      expect(encoded).toContain('ANNIVERSARY:20121001');
    });
  });

  describe('CalendarEvent QRCodeContents', () => {
    it('should encode calendar event with minimal fields correctly', () => {
      const event = {
        type: 'calendar-event' as const,
        uid: 'event-1',
        dtStart: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)),
      };
      expect(encodeQRCodeContents(event)).toEqual(
        [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//react-native-qrcode-composer//EN',
          'BEGIN:VEVENT',
          'UID:event-1',
          'DTSTART:20240101T100000Z',
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\r\n'),
      );
    });

    it('should encode calendar event with all fields correctly', () => {
      const event = {
        type: 'calendar-event' as const,
        uid: 'event-1',
        dtStart: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)),
        dtEnd: new Date(Date.UTC(2024, 0, 1, 11, 30, 0)),
        summary: 'Team meeting',
        description: 'Quarterly planning',
        location: 'Room 101',
        url: 'https://example.com/meeting',
        geo: '37.386013;-122.082932',
        categories: ['work', 'planning'],
        status: 'CONFIRMED' as const,
        transp: 'OPAQUE' as const,
        organizer: 'mailto:boss@example.com',
        attach: 'https://example.com/agenda.pdf',
        priority: 5,
        rrule: 'FREQ=WEEKLY;BYDAY=MO',
        sequence: 2,
        class: 'PRIVATE' as const,
      };
      expect(encodeQRCodeContents(event)).toEqual(
        [
          'BEGIN:VCALENDAR',
          'VERSION:2.0',
          'PRODID:-//react-native-qrcode-composer//EN',
          'BEGIN:VEVENT',
          'UID:event-1',
          'DTSTART:20240101T100000Z',
          'DTEND:20240101T113000Z',
          'SUMMARY:Team meeting',
          'DESCRIPTION:Quarterly planning',
          'LOCATION:Room 101',
          'URL:https://example.com/meeting',
          'GEO:37.386013;-122.082932',
          'CATEGORIES:work,planning',
          'STATUS:CONFIRMED',
          'TRANSP:OPAQUE',
          'ORGANIZER:mailto:boss@example.com',
          'ATTACH:https://example.com/agenda.pdf',
          'PRIORITY:5',
          'RRULE:FREQ=WEEKLY;BYDAY=MO',
          'SEQUENCE:2',
          'CLASS:PRIVATE',
          'END:VEVENT',
          'END:VCALENDAR',
        ].join('\r\n'),
      );
    });

    it('should prefer DTEND over DURATION when both are provided', () => {
      const event = {
        type: 'calendar-event' as const,
        uid: 'event-1',
        dtStart: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)),
        dtEnd: new Date(Date.UTC(2024, 0, 1, 11, 0, 0)),
        duration: 'PT1H',
      };
      const encoded = encodeQRCodeContents(event);
      expect(encoded).toContain('DTEND:20240101T110000Z');
      expect(encoded).not.toContain('DURATION');
    });

    it('should encode DURATION when DTEND is not provided', () => {
      const event = {
        type: 'calendar-event' as const,
        uid: 'event-1',
        dtStart: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)),
        duration: 'PT1H',
      };
      const encoded = encodeQRCodeContents(event);
      expect(encoded).toContain('DURATION:PT1H');
      expect(encoded).not.toContain('DTEND');
    });

    it('should escape text values per RFC 5545', () => {
      const event = {
        type: 'calendar-event' as const,
        uid: 'event;1',
        dtStart: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)),
        summary: 'Lunch; with, friends\\',
        description: 'line one\nline two',
      };
      const encoded = encodeQRCodeContents(event);
      expect(encoded).toContain('UID:event\\;1');
      expect(encoded).toContain('SUMMARY:Lunch\\; with\\, friends\\\\');
      expect(encoded).toContain('DESCRIPTION:line one\\nline two');
    });

    it('should use CRLF line endings', () => {
      const event = {
        type: 'calendar-event' as const,
        uid: 'event-1',
        dtStart: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)),
      };
      const encoded = encodeQRCodeContents(event);
      expect(encoded).not.toMatch(/[^\r]\n/);
    });

    it('should clamp priority to the 0-9 range', () => {
      const event = {
        type: 'calendar-event' as const,
        uid: 'event-1',
        dtStart: new Date(Date.UTC(2024, 0, 1, 10, 0, 0)),
        priority: 15,
      };
      expect(encodeQRCodeContents(event)).toContain('PRIORITY:9');
    });
  });
});
