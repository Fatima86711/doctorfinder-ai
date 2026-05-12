export const SYMPTOM_MAP: Record<string, string> = {
  "back pain": "Orthopedic",
  "joint pain": "Orthopedic",
  "knee pain": "Orthopedic",
  "spine": "Orthopedic",
  "fracture": "Orthopedic",
  "skin allergy": "Dermatologist",
  "acne": "Dermatologist",
  "rash": "Dermatologist",
  "eczema": "Dermatologist",
  "skin": "Dermatologist",
  "chest pain": "Cardiologist",
  "palpitations": "Cardiologist",
  "heart": "Cardiologist",
  "blood pressure": "Cardiologist",
  "fever": "General Physician",
  "cough": "General Physician",
  "cold": "General Physician",
  "flu": "General Physician",
  "headache": "Neurologist",
  "migraine": "Neurologist",
  "seizure": "Neurologist",
  "dizziness": "Neurologist",
  "stomach pain": "Gastroenterologist",
  "acidity": "Gastroenterologist",
  "diarrhea": "Gastroenterologist",
  "liver": "Gastroenterologist",
  "anxiety": "Psychiatrist",
  "depression": "Psychiatrist",
  "stress": "Psychiatrist",
  "insomnia": "Psychiatrist",
  "eye": "Ophthalmologist",
  "vision": "Ophthalmologist",
  "blurred": "Ophthalmologist",
};

export function mapSymptomToSpecialization(query: string): string | null {
  const q = query.toLowerCase().trim();
  if (!q) return null;
  // longest-match-first
  const keys = Object.keys(SYMPTOM_MAP).sort((a, b) => b.length - a.length);
  for (const k of keys) if (q.includes(k)) return SYMPTOM_MAP[k];
  return null;
}

export const SPECIALIZATIONS = [
  "Dermatologist",
  "Cardiologist",
  "General Physician",
  "Orthopedic",
  "Neurologist",
  "Gastroenterologist",
  "Psychiatrist",
  "Ophthalmologist",
];

export const CITIES = ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad"];
