import type { Compound } from "~/types/hplc";

// Initial compound library for Phase 1
export const compoundLibrary: Compound[] = [
  {
    id: "caffeine",
    name: "Caffeine",
    molecularWeight: 194.19,
    pKa: [0.6, 14.0],
    logP: -0.07,
    uvAbsorption: [
      { wavelength: 205, absorbance: 1.0 },
      { wavelength: 273, absorbance: 0.95 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "paracetamol",
    name: "Paracetamol (Acetaminophen)",
    molecularWeight: 151.16,
    pKa: [9.5],
    logP: 0.46,
    uvAbsorption: [
      { wavelength: 243, absorbance: 0.95 },
      { wavelength: 257, absorbance: 0.68 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "aspirin",
    name: "Aspirin (Acetylsalicylic Acid)",
    molecularWeight: 180.16,
    pKa: [3.5],
    logP: 1.19,
    uvAbsorption: [
      { wavelength: 230, absorbance: 0.8 },
      { wavelength: 276, absorbance: 0.92 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "ibuprofen",
    name: "Ibuprofen",
    molecularWeight: 206.28,
    pKa: [4.91],
    logP: 3.97,
    uvAbsorption: [
      { wavelength: 222, absorbance: 0.85 },
      { wavelength: 264, absorbance: 0.42 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "salicylic-acid",
    name: "Salicylic Acid",
    molecularWeight: 138.12,
    pKa: [2.98, 13.6],
    logP: 2.26,
    uvAbsorption: [
      { wavelength: 210, absorbance: 0.9 },
      { wavelength: 303, absorbance: 0.88 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "benzene",
    name: "Benzene",
    molecularWeight: 78.11,
    pKa: [],
    logP: 2.13,
    uvAbsorption: [
      { wavelength: 254, absorbance: 0.7 },
      { wavelength: 280, absorbance: 0.3 },
    ],
    category: "environmental",
  },
  {
    id: "phenol",
    name: "Phenol",
    molecularWeight: 94.11,
    pKa: [9.99],
    logP: 1.46,
    uvAbsorption: [
      { wavelength: 210, absorbance: 0.85 },
      { wavelength: 270, absorbance: 0.92 },
    ],
    category: "environmental",
  },
  {
    id: "toluene",
    name: "Toluene",
    molecularWeight: 92.14,
    pKa: [],
    logP: 2.73,
    uvAbsorption: [
      { wavelength: 262, absorbance: 0.65 },
      { wavelength: 268, absorbance: 0.72 },
    ],
    category: "environmental",
  },
  {
    id: "vitamin-c",
    name: "Vitamin C (Ascorbic Acid)",
    molecularWeight: 176.12,
    pKa: [4.17, 11.57],
    logP: -1.85,
    uvAbsorption: [
      { wavelength: 243, absorbance: 0.88 },
      { wavelength: 265, absorbance: 0.92 },
    ],
    category: "biological",
  },
  {
    id: "tryptophan",
    name: "L-Tryptophan",
    molecularWeight: 204.23,
    pKa: [2.38, 9.39],
    logP: -1.06,
    uvAbsorption: [
      { wavelength: 220, absorbance: 0.82 },
      { wavelength: 280, absorbance: 0.95 },
    ],
    category: "biological",
  },
];

export function getCompoundById(id: string): Compound | undefined {
  return compoundLibrary.find((c) => c.id === id);
}

export function getCompoundsByCategory(
  category: Compound["category"]
): Compound[] {
  return compoundLibrary.filter((c) => c.category === category);
}
