import { HealthCategory } from "@/types/healthTips";

export const preventiveHealthCategories: HealthCategory[] = [
  {
    id: "personal-hygiene",
    name: "Personal Hygiene & Safety",
    tips: [
      {
        id: "hand-wash",
        title: "Wash Hands Regularly",
        description:
          "Wash hands with soap for at least 20 seconds before meals and after using the toilet.",
        icon: "🧼",
      },
      {
        id: "oral-hygiene",
        title: "Maintain Oral Hygiene",
        description:
          "Brush twice a day and rinse after meals to prevent tooth decay and infections.",
        icon: "🦷",
      },
      {
        id: "clean-water",
        title: "Drink Safe Water",
        description:
          "Consume filtered or boiled water to prevent waterborne diseases.",
        icon: "💧",
      },
    ],
  },
  {
    id: "nutrition",
    name: "Nutrition & Dietary Habits",
    tips: [
      {
        id: "balanced-diet",
        title: "Eat a Balanced Diet",
        description:
          "Include fruits, vegetables, pulses, whole grains, and proteins in your daily meals.",
        icon: "🥗",
      },
      {
        id: "avoid-junk",
        title: "Limit Junk Food",
        description:
          "Reduce intake of fried, processed, and sugary foods for better long-term health.",
        icon: "🍟",
      },
      {
        id: "hydration",
        title: "Stay Hydrated",
        description:
          "Drink at least 8–10 glasses of water daily, more during hot weather.",
        icon: "🚰",
      },
    ],
  },
  {
    id: "physical-activity",
    name: "Physical Activity & Posture",
    tips: [
      {
        id: "daily-exercise",
        title: "Exercise Daily",
        description:
          "Engage in walking, yoga, or stretching for at least 30 minutes every day.",
        icon: "🏃",
      },
      {
        id: "good-posture",
        title: "Maintain Proper Posture",
        description:
          "Sit straight, avoid slouching, and take breaks during long screen sessions.",
        icon: "🪑",
      },
    ],
  },
  {
    id: "mental-health",
    name: "Mental Health & Stress Management",
    tips: [
      {
        id: "adequate-sleep",
        title: "Get Adequate Sleep",
        description:
          "Aim for 7–8 hours of sleep every night to support mental and physical health.",
        icon: "😴",
      },
      {
        id: "mindfulness",
        title: "Practice Mindfulness",
        description:
          "Meditation, breathing exercises, or prayer can help reduce stress and anxiety.",
        icon: "🧘",
      },
    ],
  },
  {
    id: "environmental-health",
    name: "Environmental & Seasonal Health",
    tips: [
      {
        id: "seasonal-care",
        title: "Adapt to Seasonal Changes",
        description:
          "Wear suitable clothing and eat seasonal foods to protect against illness.",
        icon: "🌦️",
      },
      {
        id: "pollution-protection",
        title: "Protect Yourself from Pollution",
        description:
          "Use masks in polluted areas and avoid outdoor activity during poor air quality.",
        icon: "😷",
      },
    ],
  },
];
