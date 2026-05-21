export interface Resource {
  name: string
  contact: string
  type: 'hotline' | 'text' | 'chat' | 'app'
  available: string
  url?: string
}

export interface CountryResources {
  country: string
  flag: string
  emergency: string
  resources: Resource[]
}

export const resourcesByCountry: Record<string, CountryResources> = {
  NG: {
    country: 'Nigeria', flag: '🇳🇬', emergency: '112',
    resources: [
      { name: 'Mentally Aware Nigeria Initiative', contact: '08091116264', type: 'hotline', available: '24/7' },
      { name: 'NIMH Suicide Prevention', contact: '08000736477', type: 'hotline', available: '24/7' },
      { name: 'She Writes Woman', contact: '08090916816', type: 'hotline', available: 'Mon–Fri 9am–5pm' },
      { name: 'Findahelpline', contact: 'findahelpline.com', type: 'chat', available: '24/7', url: 'https://findahelpline.com' },
    ],
  },
  US: {
    country: 'United States', flag: '🇺🇸', emergency: '911',
    resources: [
      { name: '988 Suicide & Crisis Lifeline', contact: '988', type: 'hotline', available: '24/7' },
      { name: 'Crisis Text Line', contact: 'Text HOME to 741741', type: 'text', available: '24/7' },
      { name: 'NAMI Helpline', contact: '1-800-950-6264', type: 'hotline', available: 'Mon–Fri 10am–10pm ET' },
    ],
  },
  GB: {
    country: 'United Kingdom', flag: '🇬🇧', emergency: '999',
    resources: [
      { name: 'Samaritans', contact: '116 123', type: 'hotline', available: '24/7' },
      { name: 'Shout Crisis Text Line', contact: 'Text SHOUT to 85258', type: 'text', available: '24/7' },
      { name: 'Mind Infoline', contact: '0300 123 3393', type: 'hotline', available: 'Mon–Fri 9am–6pm' },
    ],
  },
  GH: {
    country: 'Ghana', flag: '🇬🇭', emergency: '112',
    resources: [
      { name: 'Mental Health Authority Ghana', contact: '0800-111-900', type: 'hotline', available: '24/7' },
      { name: 'Befrienders Ghana', contact: '+233 244 846 800', type: 'hotline', available: '24/7' },
    ],
  },
  ZA: {
    country: 'South Africa', flag: '🇿🇦', emergency: '112',
    resources: [
      { name: 'SADAG', contact: '0800 456 789', type: 'hotline', available: '24/7' },
      { name: 'Lifeline South Africa', contact: '0861 322 322', type: 'hotline', available: '24/7' },
    ],
  },
  KE: {
    country: 'Kenya', flag: '🇰🇪', emergency: '999',
    resources: [
      { name: 'Befrienders Kenya', contact: '0722 178 177', type: 'hotline', available: '24/7' },
      { name: 'Niskize', contact: '0900 620 800', type: 'hotline', available: '24/7' },
    ],
  },
  IN: {
    country: 'India', flag: '🇮🇳', emergency: '112',
    resources: [
      { name: 'iCall', contact: '9152987821', type: 'hotline', available: 'Mon–Sat 8am–10pm' },
      { name: 'Vandrevala Foundation', contact: '1860-2662-345', type: 'hotline', available: '24/7' },
      { name: 'AASRA', contact: '9820466627', type: 'hotline', available: '24/7' },
    ],
  },
  CA: {
    country: 'Canada', flag: '🇨🇦', emergency: '911',
    resources: [
      { name: 'Talk Suicide Canada', contact: '1-833-456-4566', type: 'hotline', available: '24/7' },
      { name: 'Crisis Text Line Canada', contact: 'Text HOME to 686868', type: 'text', available: '24/7' },
    ],
  },
  AU: {
    country: 'Australia', flag: '🇦🇺', emergency: '000',
    resources: [
      { name: 'Lifeline Australia', contact: '13 11 14', type: 'hotline', available: '24/7' },
      { name: 'Beyond Blue', contact: '1300 22 4636', type: 'hotline', available: '24/7' },
    ],
  },
  ZW: {
    country: 'Zimbabwe', flag: '🇿🇼', emergency: '999',
    resources: [
      { name: 'ZVAN Hotline', contact: '0800 0115', type: 'hotline', available: '24/7' },
    ],
  },
  PH: {
    country: 'Philippines', flag: '🇵🇭', emergency: '911',
    resources: [
      { name: 'In Touch Crisis Line', contact: '(02) 8893-7603', type: 'hotline', available: '24/7' },
      { name: 'Hopeline Philippines', contact: '(02) 8804-4673', type: 'hotline', available: '24/7' },
    ],
  },
  SG: {
    country: 'Singapore', flag: '🇸🇬', emergency: '999',
    resources: [
      { name: 'Samaritans of Singapore', contact: '1767', type: 'hotline', available: '24/7' },
      { name: 'IMH Mental Health Helpline', contact: '6389-2222', type: 'hotline', available: '24/7' },
    ],
  },
  BR: {
    country: 'Brazil', flag: '🇧🇷', emergency: '192',
    resources: [
      { name: 'CVV', contact: '188', type: 'hotline', available: '24/7', url: 'https://cvv.org.br' },
    ],
  },
  DEFAULT: {
    country: 'International', flag: '🌍', emergency: '112',
    resources: [
      { name: 'Findahelpline', contact: 'findahelpline.com', type: 'chat', available: '24/7', url: 'https://findahelpline.com' },
      { name: 'IASP Crisis Centres', contact: 'iasp.info', type: 'chat', available: '24/7', url: 'https://www.iasp.info/resources/Crisis_Centres/' },
    ],
  },
}

export function getResourcesByTimezone(): CountryResources {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    const tzToCountry: Record<string, string> = {
      'Africa/Lagos': 'NG', 'Africa/Abuja': 'NG',
      'Africa/Accra': 'GH',
      'Africa/Johannesburg': 'ZA', 'Africa/Cape_Town': 'ZA',
      'Africa/Nairobi': 'KE',
      'Africa/Harare': 'ZW',
      'America/New_York': 'US', 'America/Chicago': 'US',
      'America/Los_Angeles': 'US',
      'America/Toronto': 'CA', 'America/Vancouver': 'CA',
      'Europe/London': 'GB',
      'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN',
      'Asia/Manila': 'PH',
      'Asia/Singapore': 'SG',
      'Australia/Sydney': 'AU', 'Australia/Melbourne': 'AU',
      'America/Sao_Paulo': 'BR',
    }
    const code = tzToCountry[tz]
    return resourcesByCountry[code] ?? resourcesByCountry.DEFAULT
  } catch {
    return resourcesByCountry.DEFAULT
  }
}