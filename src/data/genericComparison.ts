export const genericComparison: Record<
  string,
  {
    brandEquivalent: string;
    genericName: string;
    activeIngredients: string[];
    brandedPrice: number;
    genericPrice: number;
    note?: string;
  }
> = {
  "Paracetamol 500mg": {
    brandEquivalent: "Crocin / Calpol",
    genericName: "Paracetamol",
    activeIngredients: ["Paracetamol 500mg"],
    brandedPrice: 30,
    genericPrice: 15,
    note: "You are already viewing the generic version. It is clinically equivalent to branded options.",
  },

  "ORS (Oral Rehydration Salts)": {
    brandEquivalent: "Electral",
    genericName: "ORS",
    activeIngredients: ["Glucose", "Sodium Chloride", "Potassium Chloride"],
    brandedPrice: 35,
    genericPrice: 25,
  },

  "Vitamin C Tablets": {
    brandEquivalent: "Limcee",
    genericName: "Vitamin C (Ascorbic Acid)",
    activeIngredients: ["Ascorbic Acid"],
    brandedPrice: 150,
    genericPrice: 120,
  },
};
