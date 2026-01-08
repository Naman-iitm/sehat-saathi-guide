export interface Symptom {
  id: string;
  name: string;
  description: string;
  date: string;
  time: string;
}

export interface Medicine {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  inStock: boolean;
}

export interface HealthTip {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  icon: string;
  category: string;
}

export interface GovernmentScheme {
  id: string;
  name: string;
  nameHi: string;
  description: string;
  descriptionHi: string;
  eligibility: string;
  eligibilityHi: string;
  link: string;
  icon: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface Offer {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  descriptionHi: string;
  productName: string;
  productNameHi: string;
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
  image: string;
  category: 'medicines' | 'supplements' | 'devices' | 'bundle';
  validFrom: Date;
  validUntil: Date;
  termsAndConditions: string;
  termsAndConditionsHi: string;
  isLimitedTime: boolean;
  isFirstTimeUser: boolean;
  isSeasonal: boolean;
  seasonalTag?: string;
  seasonalTagHi?: string;
}
