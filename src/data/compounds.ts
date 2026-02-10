import type { Compound } from "~/types/hplc";

// Expanded compound library for Phase 2
export const compoundLibrary: Compound[] = [
  // ========== PHARMACEUTICALS ==========
  
  // Analgesics & Anti-inflammatories
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
    id: "naproxen",
    name: "Naproxen",
    molecularWeight: 230.26,
    pKa: [4.15],
    logP: 3.18,
    uvAbsorption: [
      { wavelength: 230, absorbance: 0.92 },
      { wavelength: 272, absorbance: 0.88 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "diclofenac",
    name: "Diclofenac",
    molecularWeight: 296.15,
    pKa: [4.15],
    logP: 4.51,
    uvAbsorption: [
      { wavelength: 276, absorbance: 0.95 },
      { wavelength: 283, absorbance: 0.82 },
    ],
    category: "pharmaceutical",
  },

  // Antibiotics
  {
    id: "amoxicillin",
    name: "Amoxicillin",
    molecularWeight: 365.4,
    pKa: [2.4, 7.4, 9.6],
    logP: 0.87,
    uvAbsorption: [
      { wavelength: 230, absorbance: 0.88 },
      { wavelength: 272, absorbance: 0.75 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "ciprofloxacin",
    name: "Ciprofloxacin",
    molecularWeight: 331.35,
    pKa: [6.09, 8.74],
    logP: 0.28,
    uvAbsorption: [
      { wavelength: 277, absorbance: 0.92 },
      { wavelength: 318, absorbance: 0.68 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "tetracycline",
    name: "Tetracycline",
    molecularWeight: 444.43,
    pKa: [3.3, 7.7, 9.5],
    logP: -1.37,
    uvAbsorption: [
      { wavelength: 268, absorbance: 0.85 },
      { wavelength: 357, absorbance: 0.92 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "erythromycin",
    name: "Erythromycin",
    molecularWeight: 733.93,
    pKa: [8.9],
    logP: 3.06,
    uvAbsorption: [
      { wavelength: 215, absorbance: 0.78 },
      { wavelength: 280, absorbance: 0.35 },
    ],
    category: "pharmaceutical",
  },

  // Cardiovascular
  {
    id: "atenolol",
    name: "Atenolol",
    molecularWeight: 266.34,
    pKa: [9.6],
    logP: 0.16,
    uvAbsorption: [
      { wavelength: 225, absorbance: 0.82 },
      { wavelength: 275, absorbance: 0.88 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "metoprolol",
    name: "Metoprolol",
    molecularWeight: 267.36,
    pKa: [9.68],
    logP: 1.88,
    uvAbsorption: [
      { wavelength: 223, absorbance: 0.85 },
      { wavelength: 275, absorbance: 0.76 },
    ],
    category: "pharmaceutical",
  },
  {
    id: "simvastatin",
    name: "Simvastatin",
    molecularWeight: 418.57,
    pKa: [13.5],
    logP: 4.68,
    uvAbsorption: [
      { wavelength: 238, absorbance: 0.92 },
      { wavelength: 247, absorbance: 0.85 },
    ],
    category: "pharmaceutical",
  },

  // ========== ENVIRONMENTAL POLLUTANTS ==========
  
  // BTEX Compounds
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
    id: "ethylbenzene",
    name: "Ethylbenzene",
    molecularWeight: 106.17,
    pKa: [],
    logP: 3.15,
    uvAbsorption: [
      { wavelength: 260, absorbance: 0.68 },
      { wavelength: 267, absorbance: 0.75 },
    ],
    category: "environmental",
  },
  {
    id: "xylene",
    name: "Xylene (mixed isomers)",
    molecularWeight: 106.17,
    pKa: [],
    logP: 3.12,
    uvAbsorption: [
      { wavelength: 263, absorbance: 0.66 },
      { wavelength: 270, absorbance: 0.72 },
    ],
    category: "environmental",
  },

  // PAHs (Polycyclic Aromatic Hydrocarbons)
  {
    id: "naphthalene",
    name: "Naphthalene",
    molecularWeight: 128.17,
    pKa: [],
    logP: 3.30,
    uvAbsorption: [
      { wavelength: 220, absorbance: 0.95 },
      { wavelength: 275, absorbance: 0.82 },
    ],
    category: "environmental",
  },
  {
    id: "phenanthrene",
    name: "Phenanthrene",
    molecularWeight: 178.23,
    pKa: [],
    logP: 4.46,
    uvAbsorption: [
      { wavelength: 251, absorbance: 0.92 },
      { wavelength: 294, absorbance: 0.78 },
    ],
    category: "environmental",
  },
  {
    id: "anthracene",
    name: "Anthracene",
    molecularWeight: 178.23,
    pKa: [],
    logP: 4.45,
    uvAbsorption: [
      { wavelength: 252, absorbance: 0.95 },
      { wavelength: 356, absorbance: 0.88 },
    ],
    category: "environmental",
  },
  {
    id: "pyrene",
    name: "Pyrene",
    molecularWeight: 202.25,
    pKa: [],
    logP: 4.88,
    uvAbsorption: [
      { wavelength: 241, absorbance: 0.90 },
      { wavelength: 334, absorbance: 0.85 },
    ],
    category: "environmental",
  },

  // Phenols
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
    id: "bisphenol-a",
    name: "Bisphenol A",
    molecularWeight: 228.29,
    pKa: [9.6, 10.2],
    logP: 3.32,
    uvAbsorption: [
      { wavelength: 226, absorbance: 0.88 },
      { wavelength: 278, absorbance: 0.92 },
    ],
    category: "environmental",
  },

  // Pesticides
  {
    id: "atrazine",
    name: "Atrazine",
    molecularWeight: 215.68,
    pKa: [1.7],
    logP: 2.61,
    uvAbsorption: [
      { wavelength: 222, absorbance: 0.85 },
      { wavelength: 264, absorbance: 0.72 },
    ],
    category: "environmental",
  },
  {
    id: "glyphosate",
    name: "Glyphosate",
    molecularWeight: 169.07,
    pKa: [2.0, 2.6, 5.6, 10.6],
    logP: -3.2,
    uvAbsorption: [
      { wavelength: 195, absorbance: 0.78 },
      { wavelength: 240, absorbance: 0.25 },
    ],
    category: "environmental",
  },

  // ========== NATURAL PRODUCTS ==========
  
  // Flavonoids
  {
    id: "quercetin",
    name: "Quercetin",
    molecularWeight: 302.24,
    pKa: [7.0, 8.5, 9.4, 12.5],
    logP: 1.54,
    uvAbsorption: [
      { wavelength: 256, absorbance: 0.88 },
      { wavelength: 370, absorbance: 0.92 },
    ],
    category: "natural",
  },
  {
    id: "rutin",
    name: "Rutin",
    molecularWeight: 610.52,
    pKa: [7.1, 8.9],
    logP: -0.64,
    uvAbsorption: [
      { wavelength: 257, absorbance: 0.85 },
      { wavelength: 362, absorbance: 0.90 },
    ],
    category: "natural",
  },
  {
    id: "kaempferol",
    name: "Kaempferol",
    molecularWeight: 286.24,
    pKa: [6.7, 8.6, 9.7],
    logP: 1.82,
    uvAbsorption: [
      { wavelength: 266, absorbance: 0.92 },
      { wavelength: 367, absorbance: 0.88 },
    ],
    category: "natural",
  },

  // Alkaloids
  {
    id: "morphine",
    name: "Morphine",
    molecularWeight: 285.34,
    pKa: [8.0, 9.9],
    logP: 0.89,
    uvAbsorption: [
      { wavelength: 215, absorbance: 0.82 },
      { wavelength: 285, absorbance: 0.88 },
    ],
    category: "natural",
  },
  {
    id: "codeine",
    name: "Codeine",
    molecularWeight: 299.36,
    pKa: [8.21],
    logP: 1.19,
    uvAbsorption: [
      { wavelength: 215, absorbance: 0.78 },
      { wavelength: 284, absorbance: 0.85 },
    ],
    category: "natural",
  },
  {
    id: "nicotine",
    name: "Nicotine",
    molecularWeight: 162.23,
    pKa: [3.1, 8.0],
    logP: 1.17,
    uvAbsorption: [
      { wavelength: 260, absorbance: 0.75 },
      { wavelength: 280, absorbance: 0.42 },
    ],
    category: "natural",
  },

  // Catechins
  {
    id: "egcg",
    name: "EGCG (Epigallocatechin gallate)",
    molecularWeight: 458.37,
    pKa: [7.8, 8.6, 9.4],
    logP: 0.48,
    uvAbsorption: [
      { wavelength: 210, absorbance: 0.90 },
      { wavelength: 275, absorbance: 0.88 },
    ],
    category: "natural",
  },
  {
    id: "catechin",
    name: "Catechin",
    molecularWeight: 290.27,
    pKa: [8.64, 9.36],
    logP: 0.57,
    uvAbsorption: [
      { wavelength: 210, absorbance: 0.85 },
      { wavelength: 280, absorbance: 0.82 },
    ],
    category: "natural",
  },

  // ========== BIOLOGICAL MOLECULES ==========
  
  // Vitamins
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
    id: "vitamin-b1",
    name: "Vitamin B1 (Thiamine)",
    molecularWeight: 265.35,
    pKa: [4.8, 9.2],
    logP: -1.76,
    uvAbsorption: [
      { wavelength: 233, absorbance: 0.82 },
      { wavelength: 267, absorbance: 0.78 },
    ],
    category: "biological",
  },
  {
    id: "vitamin-b6",
    name: "Vitamin B6 (Pyridoxine)",
    molecularWeight: 169.18,
    pKa: [5.0, 8.96],
    logP: -0.77,
    uvAbsorption: [
      { wavelength: 254, absorbance: 0.72 },
      { wavelength: 324, absorbance: 0.88 },
    ],
    category: "biological",
  },
  {
    id: "vitamin-b12",
    name: "Vitamin B12 (Cobalamin)",
    molecularWeight: 1355.37,
    pKa: [3.2],
    logP: -2.08,
    uvAbsorption: [
      { wavelength: 278, absorbance: 0.62 },
      { wavelength: 361, absorbance: 0.92 },
    ],
    category: "biological",
  },

  // Amino Acids
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
  {
    id: "tyrosine",
    name: "L-Tyrosine",
    molecularWeight: 181.19,
    pKa: [2.20, 9.11, 10.07],
    logP: -2.26,
    uvAbsorption: [
      { wavelength: 225, absorbance: 0.78 },
      { wavelength: 275, absorbance: 0.92 },
    ],
    category: "biological",
  },
  {
    id: "phenylalanine",
    name: "L-Phenylalanine",
    molecularWeight: 165.19,
    pKa: [2.58, 9.24],
    logP: -1.38,
    uvAbsorption: [
      { wavelength: 206, absorbance: 0.88 },
      { wavelength: 258, absorbance: 0.85 },
    ],
    category: "biological",
  },
  {
    id: "histidine",
    name: "L-Histidine",
    molecularWeight: 155.15,
    pKa: [1.82, 6.00, 9.17],
    logP: -3.32,
    uvAbsorption: [
      { wavelength: 211, absorbance: 0.82 },
      { wavelength: 230, absorbance: 0.42 },
    ],
    category: "biological",
  },
  {
    id: "leucine",
    name: "L-Leucine",
    molecularWeight: 131.17,
    pKa: [2.36, 9.60],
    logP: -1.52,
    uvAbsorption: [
      { wavelength: 210, absorbance: 0.35 },
      { wavelength: 280, absorbance: 0.08 },
    ],
    category: "biological",
  },
  {
    id: "lysine",
    name: "L-Lysine",
    molecularWeight: 146.19,
    pKa: [2.18, 8.95, 10.53],
    logP: -3.05,
    uvAbsorption: [
      { wavelength: 210, absorbance: 0.38 },
      { wavelength: 280, absorbance: 0.05 },
    ],
    category: "biological",
  },

  // Nucleotides
  {
    id: "adenosine",
    name: "Adenosine",
    molecularWeight: 267.24,
    pKa: [3.5, 12.5],
    logP: -1.05,
    uvAbsorption: [
      { wavelength: 260, absorbance: 0.95 },
      { wavelength: 280, absorbance: 0.32 },
    ],
    category: "biological",
  },
  {
    id: "guanosine",
    name: "Guanosine",
    molecularWeight: 283.24,
    pKa: [1.6, 9.2, 12.4],
    logP: -1.85,
    uvAbsorption: [
      { wavelength: 253, absorbance: 0.92 },
      { wavelength: 275, absorbance: 0.68 },
    ],
    category: "biological",
  },
  {
    id: "cytidine",
    name: "Cytidine",
    molecularWeight: 243.22,
    pKa: [4.2, 12.2],
    logP: -2.26,
    uvAbsorption: [
      { wavelength: 271, absorbance: 0.88 },
      { wavelength: 280, absorbance: 0.72 },
    ],
    category: "biological",
  },
  {
    id: "uridine",
    name: "Uridine",
    molecularWeight: 244.20,
    pKa: [9.2, 12.5],
    logP: -1.89,
    uvAbsorption: [
      { wavelength: 262, absorbance: 0.90 },
      { wavelength: 280, absorbance: 0.42 },
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
