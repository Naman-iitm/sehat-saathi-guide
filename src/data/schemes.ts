import { GovernmentScheme } from '@/types';

export const governmentSchemes: GovernmentScheme[] = [
  // 🤰 PREGNANT
  {
    id: 'preg-1',
    name: 'Janani Suraksha Yojana',
    nameHi: 'जननी सुरक्षा योजना',
    description: 'Cash assistance for institutional delivery.',
    descriptionHi: 'संस्थागत प्रसव के लिए आर्थिक सहायता।',
    eligibility: 'Pregnant women from BPL families',
    eligibilityHi: 'बीपीएल परिवारों की गर्भवती महिलाएँ',
    link: 'https://nhm.gov.in/',
    icon: '🤰',
    category: 'pregnant',
  },
  {
    id: 'preg-2',
    name: 'PM Surakshit Matritva Abhiyan',
    nameHi: 'पीएम सुरक्षित मातृत्व अभियान',
    description: 'Free antenatal care on 9th of every month.',
    descriptionHi: 'हर महीने की 9 तारीख को मुफ्त जांच।',
    eligibility: 'All pregnant women',
    eligibilityHi: 'सभी गर्भवती महिलाएँ',
    link: 'https://pmsma.nhp.gov.in/',
    icon: '👶',
    category: 'pregnant',
  },

  // 👶 CHILD
  {
    id: 'child-1',
    name: 'Mission Indradhanush',
    nameHi: 'मिशन इंद्रधनुष',
    description: 'Free vaccination for children.',
    descriptionHi: 'बच्चों के लिए मुफ्त टीकाकरण।',
    eligibility: 'Children below 2 years',
    eligibilityHi: '2 वर्ष से कम आयु के बच्चे',
    link: 'https://nhm.gov.in/',
    icon: '💉',
    category: 'child',
  },

  // 🧓 SENIOR
  {
    id: 'senior-1',
    name: 'Ayushman Bharat',
    nameHi: 'आयुष्मान भारत योजना',
    description: 'Health insurance up to ₹5 lakh.',
    descriptionHi: '₹5 लाख तक का स्वास्थ्य बीमा।',
    eligibility: 'Eligible families',
    eligibilityHi: 'पात्र परिवार',
    link: 'https://pmjay.gov.in/',
    icon: '🏥',
    category: 'senior',
  },

  // 🌐 GENERAL
  {
    id: 'gen-1',
    name: 'Rashtriya Swasthya Bima Yojana',
    nameHi: 'राष्ट्रीय स्वास्थ्य बीमा योजना',
    description: 'Health insurance for BPL families.',
    descriptionHi: 'बीपीएल परिवारों के लिए स्वास्थ्य बीमा।',
    eligibility: 'BPL families',
    eligibilityHi: 'बीपीएल परिवार',
    link: 'https://rsby.gov.in/',
    icon: '💳',
    category: 'general',
  },
  {
  id: 'gen-2', name: 'Pradhan Mantri Jan Aushadhi Yojana',
   nameHi: 'प्रधानमंत्री जन औषधि योजना', 
   description: 'Affordable generic medicines.',
    descriptionHi: 'सस्ती जेनेरिक दवाइयाँ।',
     eligibility: 'All citizens', 
     eligibilityHi: 'सभी नागरिक',
     link: 'https://janaushadhi.gov.in/',
      icon: '💊', category: 'general',
     },
];
