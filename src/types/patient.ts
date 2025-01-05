export interface Patient {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  medical_history: string | null;
  sex: string | null;
  user_id: string;
}

export interface PatientFormProps {
  onSuccess?: () => void;
}