import {encodeQRCodeContents} from '../QRContents';

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
        'mailto:test@example.com?subject=Test%20Subject&body=Test%20Body&cc=cc@example.com&bcc=bcc@example.com',
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
        'mailto:test@example.com?cc=cc@example.com',
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

    it('should encode WiFi with special characters in SSID correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WPA' as const,
        ssid: 'My!@#$%^&*()Wi-Fi',
        password: 'password123',
        hidden: false,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WPA;S:My!%40%23%24%25%5E%26*()Wi-Fi;P:password123;H:false;;',
      );
    });

    it('should encode WiFi with encoded characters in password correctly', () => {
      const wifi = {
        type: 'wifi' as const,
        security: 'WPA' as const,
        ssid: 'MyWiFi',
        password: 'password%20123',
        hidden: false,
      };
      expect(encodeQRCodeContents(wifi)).toEqual(
        'WIFI:T:WPA;S:MyWiFi;P:password%2520123;H:false;;',
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
        'WIFI:T:WPA;S:MyWiFi;P:abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890%3B!%40%23%24%25%5E%26*();H:false;;',
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
});
