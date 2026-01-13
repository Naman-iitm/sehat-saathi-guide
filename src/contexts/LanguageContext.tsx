import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'hi' | 'en' | 'bn' | 'mr' | 'bho' | 'mai';

interface Translations {
  invalidEmail: any;
  newsletterTitle: ReactNode;
  subscribeError: string & ReactNode;
  subscribeSuccess: string & ReactNode;
  appName: string;
  home: string;
  symptomTracker: string;
  healthTips: string;
  medicineStore: string;
  aiAssistant: string;
  sarkariYojana: string;
  nearbyHospitals: string;
  myProfile: string;
  login: string;
  register: string;
  logout: string;
  loading: string;
  addSymptom: string;
  symptomName: string;
  symptomDescription: string;
  addedOn: string;
  noSymptoms: string;
  emptySymptomError: string;
  search: string;
  addToCart: string;
  cart: string;
  checkout: string;
  total: string;
  address: string;
  payment: string;
  proceedToPayment: string;
  orderPlaced: string;
  askHealth: string;
  send: string;
  welcomeMessage: string;
  healthTipsTitle: string;
  governmentSchemes: string;
  freeHealthcare: string;
  schemes: string;
  eligibility: string;
  apply: string;
  email: string;
  password: string;
  otp: string;
  verifyOtp: string;
  name: string;
  phone: string;
  selectLanguage: string;
  changeLanguage: string;
  price: string;
  quantity: string;
  remove: string;
  emptyCart: string;
  continueShopping: string;
  viewCart: string;
  fullName: string;
  streetAddress: string;
  city: string;
  pincode: string;
  paymentMethod: string;
  cod: string;
  upi: string;
  placeOrder: string;
  orderSuccess: string;
  backToHome: string;
  description: string;
  date: string;
  time: string;
  deleteSymptom: string;
  quickLinks: string;
  legal: string;
  privacyPolicy: string;
  termsConditions: string;
  support: string;
  helpCenter: string;
  feedback: string;
  contact: string;
  followUs: string;
  rightsReserved: string;
  offers: string;
  stayUpdated: string;
}

const translations: Record<Language, Translations> = {
  hi: {
    appName: 'स्वास्थ्य साथी',
    home: 'होम',
    symptomTracker: 'लक्षण ट्रैकर',
    healthTips: 'स्वास्थ्य सुझाव',
    medicineStore: 'दवाई दुकान',
    aiAssistant: 'AI सहायक',
    sarkariYojana: 'सरकारी योजना',
    nearbyHospitals: 'नजदीकी अस्पताल',
    myProfile: 'मेरी प्रोफाइल',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    loading: 'लोड हो रहा है...',
    addSymptom: 'लक्षण जोड़ें',
    symptomName: 'लक्षण का नाम',
    symptomDescription: 'विवरण (वैकल्पिक)',
    addedOn: 'जोड़ा गया',
    noSymptoms: 'कोई लक्षण नहीं जोड़ा गया',
    emptySymptomError: 'कृपया लक्षण का नाम डालें',
    search: 'खोजें',
    addToCart: 'कार्ट में डालें',
    cart: 'कार्ट',
    checkout: 'चेकआउट',
    total: 'कुल',
    address: 'पता',
    payment: 'भुगतान',
    proceedToPayment: 'भुगतान करें',
    orderPlaced: 'ऑर्डर हो गया',
    askHealth: 'अपनी स्वास्थ्य समस्या बताएं...',
    send: 'भेजें',
    welcomeMessage: 'नमस्ते! मैं आपका स्वास्थ्य सहायक हूं। आप कैसी तकलीफ महसूस कर रहे हैं?',
    healthTipsTitle: 'स्वास्थ्य सुझाव',
    governmentSchemes: 'सरकारी योजनाएं',
    freeHealthcare: 'मुफ्त स्वास्थ्य सेवा',
    schemes: 'योजनाएं',
    eligibility: 'पात्रता',
    apply: 'आवेदन करें',
    email: 'ईमेल',
    password: 'पासवर्ड',
    otp: 'ओटीपी',
    verifyOtp: 'ओटीपी सत्यापित करें',
    name: 'नाम',
    phone: 'फोन नंबर',
    selectLanguage: 'भाषा चुनें',
    changeLanguage: 'भाषा बदलें',
    price: 'कीमत',
    quantity: 'मात्रा',
    remove: 'हटाएं',
    emptyCart: 'कार्ट खाली है',
    continueShopping: 'खरीदारी जारी रखें',
    viewCart: 'कार्ट देखें',
    fullName: 'पूरा नाम',
    streetAddress: 'पता',
    city: 'शहर',
    pincode: 'पिनकोड',
    paymentMethod: 'भुगतान का तरीका',
    cod: 'कैश ऑन डिलीवरी',
    upi: 'UPI',
    placeOrder: 'ऑर्डर करें',
    orderSuccess: 'ऑर्डर सफल!',
    backToHome: 'होम पर जाएं',
    description: 'विवरण',
    date: 'तारीख',
    time: 'समय',
    deleteSymptom: 'हटाएं',
    quickLinks: 'त्वरित लिंक',
    legal: 'कानूनी',
    privacyPolicy: 'गोपनीयता नीति',
    termsConditions: 'नियम और शर्तें',
    support: 'सहायता',
    helpCenter: 'सहायता केंद्र',
    feedback: 'प्रतिक्रिया',
    contact: 'संपर्क करें',
    followUs: 'हमें फॉलो करें',
    rightsReserved: 'सर्वाधिकार सुरक्षित',
    offers: 'ऑफर',
    invalidEmail: 'अवैध ईमेल',
    newsletterTitle: 'वृत्तपत्र शीर्षक',
    subscribeError: 'सदस्यता त्रुटी',
    subscribeSuccess: 'सदस्यता यशस्वी',
    stayUpdated: 'आमच्या नवीनतम आरोग्य टिप्स आणि वैशिष्ट्यांसह अपडेट रहा.',
  },
  en: {
    appName: 'Sehat Saathi',
    home: 'Home',
    symptomTracker: 'Symptom Tracker',
    healthTips: 'Health Tips',
    medicineStore: 'Medicine Store',
    aiAssistant: 'AI Assistant',
    sarkariYojana: 'Govt. Schemes',
    nearbyHospitals: 'Nearby Hospitals',
    myProfile: 'My Profile',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    loading: 'Loading...',
    addSymptom: 'Add Symptom',
    symptomName: 'Symptom Name',
    symptomDescription: 'Description (optional)',
    addedOn: 'Added on',
    noSymptoms: 'No symptoms added',
    emptySymptomError: 'Please enter symptom name',
    search: 'Search',
    addToCart: 'Add to Cart',
    cart: 'Cart',
    checkout: 'Checkout',
    total: 'Total',
    address: 'Address',
    payment: 'Payment',
    proceedToPayment: 'Proceed to Payment',
    orderPlaced: 'Order Placed',
    askHealth: 'Describe your health issue...',
    send: 'Send',
    welcomeMessage: 'Hello! I am your health assistant. What problem are you facing?',
    healthTipsTitle: 'Health Tips',
    governmentSchemes: 'Government Schemes',
    freeHealthcare: 'Free Healthcare',
    schemes: 'Schemes',
    eligibility: 'Eligibility',
    apply: 'Apply',
    email: 'Email',
    password: 'Password',
    otp: 'OTP',
    verifyOtp: 'Verify OTP',
    name: 'Name',
    phone: 'Phone Number',
    selectLanguage: 'Select Language',
    changeLanguage: 'Change Language',
    price: 'Price',
    quantity: 'Quantity',
    remove: 'Remove',
    emptyCart: 'Cart is empty',
    continueShopping: 'Continue Shopping',
    viewCart: 'View Cart',
    fullName: 'Full Name',
    streetAddress: 'Street Address',
    city: 'City',
    pincode: 'Pincode',
    paymentMethod: 'Payment Method',
    cod: 'Cash on Delivery',
    upi: 'UPI',
    placeOrder: 'Place Order',
    orderSuccess: 'Order Successful!',
    backToHome: 'Back to Home',
    description: 'Description',
    date: 'Date',
    time: 'Time',
    deleteSymptom: 'Delete',
    quickLinks: 'Quick Links',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    support: 'Support',
    helpCenter: 'Help Center',
    feedback: 'Feedback',
    contact: 'Contact',
    followUs: 'Follow Us',
    rightsReserved: 'All Rights Reserved',
    offers: 'Offers',
    invalidEmail: undefined,
    newsletterTitle: 'Newsletter',
    subscribeError: 'Subscription Error',
    subscribeSuccess: 'Subscription Success',
    stayUpdated: 'Stay updated with our latest health tips and features.'
    ,
  },
  bn: {
    appName: 'স্বাস্থ্য সাথী',
    home: 'হোম',
    symptomTracker: 'লক্ষণ ট্র্যাকার',
    healthTips: 'স্বাস্থ্য টিপস',
    medicineStore: 'ওষুধের দোকান',
    aiAssistant: 'AI সহায়ক',
    sarkariYojana: 'সরকারি যোজনা',
    nearbyHospitals: 'কাছের হাসপাতাল',
    myProfile: 'আমার প্রোফাইল',
    login: 'লগইন',
    register: 'রেজিস্টার',
    logout: 'লগআউট',
    loading: 'লোড হচ্ছে...',
    addSymptom: 'লক্ষণ যোগ করুন',
    symptomName: 'লক্ষণের নাম',
    symptomDescription: 'বিবরণ (ঐচ্ছিক)',
    addedOn: 'যোগ করা হয়েছে',
    noSymptoms: 'কোন লক্ষণ যোগ করা হয়নি',
    emptySymptomError: 'অনুগ্রহ করে লক্ষণের নাম লিখুন',
    search: 'খুঁজুন',
    addToCart: 'কার্টে যোগ করুন',
    cart: 'কার্ট',
    checkout: 'চেকআউট',
    total: 'মোট',
    address: 'ঠিকানা',
    payment: 'পেমেন্ট',
    proceedToPayment: 'পেমেন্ট করুন',
    orderPlaced: 'অর্ডার হয়ে গেছে',
    askHealth: 'আপনার স্বাস্থ্য সমস্যা বলুন...',
    send: 'পাঠান',
    welcomeMessage: 'নমস্কার! আমি আপনার স্বাস্থ্য সহায়ক। আপনার কি সমস্যা হচ্ছে?',
    healthTipsTitle: 'স্বাস্থ্য টিপস',
    governmentSchemes: 'সরকারি যোজনা',
    freeHealthcare: 'বিনামূল্যে স্বাস্থ্যসেবা',
    schemes: 'যোজনা',
    eligibility: 'যোগ্যতা',
    apply: 'আবেদন করুন',
    email: 'ইমেইল',
    password: 'পাসওয়ার্ড',
    otp: 'ওটিপি',
    verifyOtp: 'ওটিপি যাচাই করুন',
    name: 'নাম',
    phone: 'ফোন নম্বর',
    selectLanguage: 'ভাষা নির্বাচন করুন',
    changeLanguage: 'ভাষা পরিবর্তন করুন',
    price: 'দাম',
    quantity: 'পরিমাণ',
    remove: 'সরান',
    emptyCart: 'কার্ট খালি',
    continueShopping: 'কেনাকাটা চালিয়ে যান',
    viewCart: 'কার্ট দেখুন',
    fullName: 'পুরো নাম',
    streetAddress: 'ঠিকানা',
    city: 'শহর',
    pincode: 'পিনকোড',
    paymentMethod: 'পেমেন্ট পদ্ধতি',
    cod: 'ক্যাশ অন ডেলিভারি',
    upi: 'UPI',
    placeOrder: 'অর্ডার করুন',
    orderSuccess: 'অর্ডার সফল!',
    backToHome: 'হোমে যান',
    description: 'বিবরণ',
    date: 'তারিখ',
    time: 'সময়',
    deleteSymptom: 'মুছুন',
    quickLinks: 'দ্রুত লিঙ্ক',
    legal: 'আইনি',
    privacyPolicy: 'গোপনীয়তা নীতি',
    termsConditions: 'শর্তাবলী',
    support: 'সমর্থন',
    helpCenter: 'সাহায্য কেন্দ্র',
    feedback: 'প্রতিক্রিয়া',
    contact: 'যোগাযোগ',
    followUs: 'আমাদের অনুসরণ করুন',
    rightsReserved: 'সর্বস্বত্ব সংরক্ষিত',
    offers: 'অফার',
    invalidEmail: undefined,
    newsletterTitle: 'নিউজলেটার',
    subscribeError: 'সাবস্ক্রিপশন ত্রুটি',
    subscribeSuccess: 'সাবস্ক্রিপশন সফল',
    stayUpdated: 'আমাদের সর্বশেষ স্বাস্থ্য টিপস এবং বৈশিষ্ট্য সম্পর্কে আপডেট থাকুন।'
    ,
  },
  mr: {
    appName: 'स्वास्थ्य साथी',
    home: 'होम',
    symptomTracker: 'लक्षण ट्रॅकर',
    healthTips: 'आरोग्य टिप्स',
    medicineStore: 'औषध दुकान',
    aiAssistant: 'AI सहाय्यक',
    sarkariYojana: 'सरकारी योजना',
    nearbyHospitals: 'जवळचे रुग्णालय',
    myProfile: 'माझी प्रोफाइल',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    loading: 'लोड होत आहे...',
    addSymptom: 'लक्षण जोडा',
    symptomName: 'लक्षणाचे नाव',
    symptomDescription: 'वर्णन (पर्यायी)',
    addedOn: 'जोडले',
    noSymptoms: 'कोणतेही लक्षण जोडलेले नाही',
    emptySymptomError: 'कृपया लक्षणाचे नाव टाका',
    search: 'शोधा',
    addToCart: 'कार्टमध्ये जोडा',
    cart: 'कार्ट',
    checkout: 'चेकआउट',
    total: 'एकूण',
    address: 'पत्ता',
    payment: 'पेमेंट',
    proceedToPayment: 'पेमेंट करा',
    orderPlaced: 'ऑर्डर झाली',
    askHealth: 'तुमची आरोग्य समस्या सांगा...',
    send: 'पाठवा',
    welcomeMessage: 'नमस्कार! मी तुमचा आरोग्य सहाय्यक आहे. तुम्हाला काय त्रास आहे?',
    healthTipsTitle: 'आरोग्य टिप्स',
    governmentSchemes: 'सरकारी योजना',
    freeHealthcare: 'मोफत आरोग्य सेवा',
    schemes: 'योजना',
    eligibility: 'पात्रता',
    apply: 'अर्ज करा',
    email: 'ईमेल',
    password: 'पासवर्ड',
    otp: 'OTP',
    verifyOtp: 'OTP तपासा',
    name: 'नाव',
    phone: 'फोन नंबर',
    selectLanguage: 'भाषा निवडा',
    changeLanguage: 'भाषा बदला',
    price: 'किंमत',
    quantity: 'प्रमाण',
    remove: 'काढा',
    emptyCart: 'कार्ट रिकामी आहे',
    continueShopping: 'खरेदी सुरू ठेवा',
    viewCart: 'कार्ट पहा',
    fullName: 'पूर्ण नाव',
    streetAddress: 'पत्ता',
    city: 'शहर',
    pincode: 'पिनकोड',
    paymentMethod: 'पेमेंट पद्धत',
    cod: 'कॅश ऑन डिलिव्हरी',
    upi: 'UPI',
    placeOrder: 'ऑर्डर करा',
    orderSuccess: 'ऑर्डर यशस्वी!',
    backToHome: 'होमवर जा',
    description: 'वर्णन',
    date: 'तारीख',
    time: 'वेळ',
    deleteSymptom: 'हटवा',
    quickLinks: 'द्रुत दुवे',
    legal: 'कायदेशीर',
    privacyPolicy: 'गोपनीयता धोरण',
    termsConditions: 'नियम आणि अटी',
    support: 'समर्थन',
    helpCenter: 'मदत केंद्र',
    feedback: 'प्रतिक्रिया',
    contact: 'संपर्क करा',
    followUs: 'आम्हाला फॉलो करा',
    rightsReserved: 'सर्व हक्क राखीव',
     offers: 'ऑफर',
  invalidEmail: 'अवैध ईमेल',
  newsletterTitle: 'न्यूजलेटर',
  subscribeError: 'सदस्यता त्रुटी',
  subscribeSuccess: 'सदस्यता यशस्वी',
  stayUpdated: 'आमच्या नवीनतम आरोग्य टिप्स आणि वैशिष्ट्यांसह अपडेट रहा.',
  },
  bho: {
    appName: 'स्वास्थ्य साथी',
    home: 'होम',
    symptomTracker: 'लक्षण ट्रैकर',
    healthTips: 'स्वास्थ्य सुझाव',
    medicineStore: 'दवाई दुकान',
    aiAssistant: 'AI सहायक',
    sarkariYojana: 'सरकारी योजना',
    nearbyHospitals: 'नजदीकी अस्पताल',
    myProfile: 'हमार प्रोफाइल',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    loading: 'लोड हो रहल बा...',
    addSymptom: 'लक्षण जोड़ीं',
    symptomName: 'लक्षण के नाम',
    symptomDescription: 'विवरण (वैकल्पिक)',
    addedOn: 'जोड़ल गइल',
    noSymptoms: 'कवनो लक्षण ना जोड़ल गइल',
    emptySymptomError: 'कृपया लक्षण के नाम डालीं',
    search: 'खोजीं',
    addToCart: 'कार्ट में डालीं',
    cart: 'कार्ट',
    checkout: 'चेकआउट',
    total: 'कुल',
    address: 'पता',
    payment: 'भुगतान',
    proceedToPayment: 'भुगतान करीं',
    orderPlaced: 'ऑर्डर हो गइल',
    askHealth: 'आपन स्वास्थ्य समस्या बताईं...',
    send: 'भेजीं',
    welcomeMessage: 'नमस्ते! हम रउआ के स्वास्थ्य सहायक बानी। का तकलीफ बा?',
    healthTipsTitle: 'स्वास्थ्य सुझाव',
    governmentSchemes: 'সরকারি योजना',
    freeHealthcare: 'मुफ्त स्वास्थ्य सेवा',
    schemes: 'योजना',
    eligibility: 'पात्रता',
    apply: 'आवेदन करीं',
    email: 'ईमेल',
    password: 'पासवर्ड',
    otp: 'OTP',
    verifyOtp: 'OTP सत्यापित करीं',
    name: 'नाम',
    phone: 'फोन नंबर',
    selectLanguage: 'भाषा चुनीं',
    changeLanguage: 'भाषा बदलीं',
    price: 'कीमत',
    quantity: 'मात्रा',
    remove: 'हटाईं',
    emptyCart: 'कार्ट खाली बा',
    continueShopping: 'खरीदारी जारी राखीं',
    viewCart: 'कार्ट देखीं',
    fullName: 'पूरा नाम',
    streetAddress: 'पता',
    city: 'शहर',
    pincode: 'पिनकोड',
    paymentMethod: 'भुगतान के तरीका',
    cod: 'कैश ऑन डिलीवरी',
    upi: 'UPI',
    placeOrder: 'ऑर्डर करीं',
    orderSuccess: 'ऑर्डर सफल!',
    backToHome: 'होम पर जाईं',
    description: 'विवरण',
    date: 'तारीख',
    time: 'समय',
    deleteSymptom: 'हटाईं',
    quickLinks: 'Quick Links',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    support: 'Support',
    helpCenter: 'Help Center',
    feedback: 'Feedback',
    contact: 'Contact Us',
    followUs: 'Follow Us',
    rightsReserved: 'All Rights Reserved',
    offers: 'ऑफर',
    invalidEmail: undefined,
    newsletterTitle: 'न्यूजलेटर',
    subscribeError: 'सदस्यता त्रुटी',
    subscribeSuccess: 'सदस्यता सफल',
    stayUpdated: 'हमार नवीनतम स्वास्थ्य टिप्स आ फीचर्स से अपडेट रहअ।',
  },
  mai: {
    appName: 'स्वास्थ्य साथी',
    home: 'होम',
    symptomTracker: 'लक्षण ट्रैकर',
    healthTips: 'स्वास्थ्य सुझाव',
    medicineStore: 'दवाई दोकान',
    aiAssistant: 'AI सहायक',
    sarkariYojana: 'सरकारी योजना',
    nearbyHospitals: 'लग के अस्पताल',
    myProfile: 'हमर प्रोफाइल',
    login: 'लॉगिन',
    register: 'रजिस्टर',
    logout: 'लॉगआउट',
    loading: 'लोड भ रहल अछि...',
    addSymptom: 'लक्षण जोड़ू',
    symptomName: 'लक्षण के नाम',
    symptomDescription: 'विवरण (वैकल्पिक)',
    addedOn: 'जोड़ल गेल',
    noSymptoms: 'कोनो लक्षण नहि जोड़ल गेल',
    emptySymptomError: 'कृपया लक्षण के नाम दिअ',
    search: 'खोजू',
    addToCart: 'कार्ट मे राखू',
    cart: 'कार्ट',
    checkout: 'चेकआउट',
    total: 'कुल',
    address: 'ठेकाना',
    payment: 'भुगतान',
    proceedToPayment: 'भुगतान करू',
    orderPlaced: 'ऑर्डर भ गेल',
    askHealth: 'अपन स्वास्थ्य समस्या बताउ...',
    send: 'পठाउ',
    welcomeMessage: 'नमस्ते! हम अहाँक स्वास्थ्य सहायक छी। की तकलीफ अछि?',
    healthTipsTitle: 'स्वास्थ्य सुझाव',
    governmentSchemes: 'सरकारी योजना',
    freeHealthcare: 'मुफ्त स्वास्थ्य सेवा',
    schemes: 'योजना',
    eligibility: 'पात्रता',
    apply: 'आवेदन करू',
    email: 'ईमेल',
    password: 'पासवर्ड',
    otp: 'OTP',
    verifyOtp: 'OTP सत्यापित करू',
    name: 'नाम',
    phone: 'फोन नंबर',
    selectLanguage: 'भाषा चुनू',
    changeLanguage: 'भाषा बदलू',
    price: 'दाम',
    quantity: 'मात्रा',
    remove: 'हटाउ',
    emptyCart: 'कार्ट खाली अछि',
    continueShopping: 'खरीदारी जारी राखू',
    viewCart: 'कार्ट देखू',
    fullName: 'पूरा नाम',
    streetAddress: 'ठेकाना',
    city: 'शहर',
    pincode: 'पिनकोड',
    paymentMethod: 'भुगतान के तरीका',
    cod: 'कैश ऑन डिलीवरी',
    upi: 'UPI',
    placeOrder: 'ऑर्डर करू',
    orderSuccess: 'ऑर्डर सफल!',
    backToHome: 'होम पर जाउ',
    description: 'विवरण',
    date: 'तारीख',
    time: 'समय',
    deleteSymptom: 'हटाउ',
    quickLinks: 'Quick Links',
    legal: 'Legal',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    support: 'Support',
    helpCenter: 'Help Center',
    feedback: 'Feedback',
    contact: 'Contact Us',
    followUs: 'Follow Us',
    rightsReserved: 'All Rights Reserved',
   offers: 'ऑफर',
  invalidEmail: undefined,
  newsletterTitle: 'न्यूजलेटर',
  subscribeError: 'सदस्यता त्रुटी',
  subscribeSuccess: 'सदस्यता सफल',
  stayUpdated: 'हमर नवीनतम स्वास्थ्य टिप्स आ सुविधासँ अपडेट रहू।',
  },
};

const languageNames: Record<Language, string> = {
  hi: 'हिंदी',
  en: 'English',
  bn: 'বাংলা',
  mr: 'मराठी',
  bho: 'भोजपुरी',
  mai: 'मैथिली',
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  languageNames: Record<Language, string>;
  availableLanguages: Language[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'hi';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage: handleSetLanguage,
        t: translations[language],
        languageNames,
        availableLanguages: ['hi', 'en', 'bn', 'mr', 'bho', 'mai'],
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};