import type { DocumentType } from "@/types";

export const DOCUMENT_TYPES: DocumentType[] = [
  {
    id: "passport",
    name: "Passport",
    description:
      "Valid passport with at least 1 year of validity remaining beyond your intended stay.",
    requiredFor: ["spain-dnv", "spain-student", "spain-exploration"],
    acceptedFormats: ["pdf", "jpg", "png"],
    validityDays: 365,
    requiresTranslation: false,
    requiresApostille: false,
    weight: 10,
  },
  {
    id: "passport-scan",
    name: "Passport Scan (all pages)",
    description: "Color scan of all passport pages, including blank pages.",
    requiredFor: ["spain-dnv", "spain-student", "spain-exploration"],
    acceptedFormats: ["pdf", "jpg", "png"],
    requiresTranslation: false,
    requiresApostille: false,
    weight: 5,
  },
  {
    id: "photo",
    name: "Biometric Photo",
    description:
      "Recent color biometric photo (35x45mm or local consulate spec), white background.",
    requiredFor: ["spain-dnv", "spain-student", "spain-exploration"],
    acceptedFormats: ["jpg", "png"],
    requiresTranslation: false,
    requiresApostille: false,
    weight: 5,
  },
  {
    id: "proof-of-income",
    name: "Proof of Income",
    description:
      "Bank statements, payslips, or tax declarations showing stable income from outside Spain. Last 3–6 months.",
    requiredFor: ["spain-dnv"],
    acceptedFormats: ["pdf"],
    validityDays: 90,
    requiresTranslation: true,
    requiresApostille: false,
    weight: 20,
  },
  {
    id: "work-contract",
    name: "Work Contract / Client Contracts",
    description:
      "Employment contract with foreign employer, or contracts/invoices proving remote freelance work.",
    requiredFor: ["spain-dnv"],
    acceptedFormats: ["pdf"],
    requiresTranslation: true,
    requiresApostille: false,
    weight: 15,
  },
  {
    id: "bank-statement",
    name: "Bank Statement",
    description:
      "Recent bank statement (last 3 months) showing sufficient savings. Usually requires official bank letterhead.",
    requiredFor: ["spain-dnv", "spain-student"],
    acceptedFormats: ["pdf"],
    validityDays: 90,
    requiresTranslation: true,
    requiresApostille: false,
    weight: 15,
  },
  {
    id: "criminal-record",
    name: "Criminal Record Certificate",
    description:
      "Certificate of no criminal record from your country of citizenship (and country of residence if different). Must be apostilled.",
    requiredFor: ["spain-dnv", "spain-student"],
    acceptedFormats: ["pdf"],
    validityDays: 90,
    requiresTranslation: true,
    requiresApostille: true,
    weight: 15,
  },
  {
    id: "health-insurance",
    name: "Health Insurance",
    description:
      "Health insurance policy valid in Spain for the entire duration of stay. Must cover €30,000+ in medical expenses.",
    requiredFor: ["spain-dnv", "spain-student", "spain-exploration"],
    acceptedFormats: ["pdf"],
    requiresTranslation: false,
    requiresApostille: false,
    weight: 10,
  },
  {
    id: "proof-of-address",
    name: "Proof of Current Address",
    description:
      "Utility bill, bank letter, or official document showing your current residential address.",
    requiredFor: ["spain-dnv"],
    acceptedFormats: ["pdf", "jpg"],
    validityDays: 90,
    requiresTranslation: true,
    requiresApostille: false,
    weight: 5,
  },
  {
    id: "application-form",
    name: "Application Form",
    description:
      "Official visa/permit application form from the Spanish consulate or immigration authority.",
    requiredFor: ["spain-dnv", "spain-student"],
    acceptedFormats: ["pdf"],
    requiresTranslation: false,
    requiresApostille: false,
    weight: 10,
  },
  {
    id: "admission-letter",
    name: "Admission Letter / Course Enrollment",
    description:
      "Official letter from a Spanish educational institution confirming your enrollment in an accredited program.",
    requiredFor: ["spain-student"],
    acceptedFormats: ["pdf"],
    requiresTranslation: false,
    requiresApostille: false,
    weight: 35,
  },
  {
    id: "proof-of-funds",
    name: "Proof of Funds",
    description:
      "Bank statement or financial guarantee showing sufficient funds to cover tuition and living costs for the duration of study.",
    requiredFor: ["spain-student", "spain-exploration"],
    acceptedFormats: ["pdf"],
    validityDays: 90,
    requiresTranslation: true,
    requiresApostille: false,
    weight: 20,
  },
];

export function getDocumentTypeById(id: string): DocumentType | undefined {
  return DOCUMENT_TYPES.find((d) => d.id === id);
}

export function getDocumentTypesForPath(pathId: string): DocumentType[] {
  return DOCUMENT_TYPES.filter((d) => d.requiredFor.includes(pathId));
}
