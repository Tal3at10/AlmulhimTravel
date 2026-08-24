/**
 * Normalizes Arabic text by removing Tashkeel, Tatweel, and unifying Hamzas, Alifs, YAs, and Ta-Marbutas.
 * This guarantees that "إندونيسيا", "اندونيسيا", "أندونيسيا" match 100%.
 */
export const normalizeArabicText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, '') // Tashkeel / Diacritics
    .replace(/[أإآ]/g, 'ا')         // Alifs
    .replace(/ى/g, 'ي')            // Ya / Alif Maqsura
    .replace(/ة/g, 'ه')            // Ta Marbuta / Ha
    .replace(/ـ/g, '');            // Tatweel
};
