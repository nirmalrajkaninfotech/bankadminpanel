// General multi-language text
export interface MultiLangText {
  en: string;
  ta: string;
}

// Slide
export interface Slide {
  id: number;
  image_url: string;
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
  link: string;
}

// Loan
export interface Loan {
  id: number;
  icon: string;
  title_en: string;
  title_ta: string;
  description_en: string;
  description_ta: string;
  rate: string;
  features_en: string[];
  features_ta: string[];
  image: string;
  created_at: string;
  updated_at: string;
}

// Footer
export interface Footer {
  bankName: MultiLangText;
  description: MultiLangText;
  quickLinks: { title: MultiLangText; links: { text: MultiLangText; href: string }[] };
  help: { title: MultiLangText; links: { text: MultiLangText; href: string }[] };
  newsletter: { title: MultiLangText; description: MultiLangText };
  copyright: MultiLangText;
}

// Header
export interface Header {
  logoText: MultiLangText;
  navLinks: { text: MultiLangText; href: string }[];
  languageSelector: { en: string; ta: string };
}

// Hero
export interface Hero {
  mainText: MultiLangText;
  subText: MultiLangText;
  buttonText: MultiLangText;
}

// Quick Service
export interface QuickServiceItem {
  id: string;
  icon: string;
  title: MultiLangText;
  description: MultiLangText;
  href: string;
}

export interface QuickServicesContent {
  sectionTitle: MultiLangText;
  sectionDescription: MultiLangText;
  services: QuickServiceItem[];
}

// Announcement
export interface Announcement {
  id: number;
  text_en: string;
  text_ta: string;
  speed: number;
}

// Video
export interface Video {
  id: number;
  src: string;
  isVisible: boolean;
  type: string;
}

// Contact Info
export interface ContactInfo {
  id: number;
  icon: string;
  title: string;
  tamilTitle: string;
  description: string[];
  tamilDescription: string[];
}

// Before Header
export interface BeforeHeaderContact {
  type: string;
  value: string;
  display: string;
  href: string;
  icon: string;
}

export interface BeforeHeaderData {
  _id?: string;
  logo: {
    src: string | File;
    altTamil: string;
    altEnglish: string;
  };
  title: {
    tamil: string;
    english: string;
  };
  subtitle: {
    tamil: string;
    english: string;
  };
  yearsImage: {
    src: string | File;
    alt: string;
  };
  contacts: BeforeHeaderContact[];
}

export type ImageField = string | File | null | undefined;
