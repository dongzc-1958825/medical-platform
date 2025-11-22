export interface User {
  id: string;
  name?: string;
  username: string;
  email: string;
  avatar?: string;
  phone?: string;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  medicalHistory?: string;
  allergies?: string[];
  createdAt: string;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  icon: string;
  color: string;
}

export interface HealthRecord {
  id: string;
  title: string;
  date: string;
  type: 'examination' | 'treatment' | 'surgery' | 'medication';
  description: string;
  hospital?: string;
  doctor?: string;
}