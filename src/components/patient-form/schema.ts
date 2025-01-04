import * as z from "zod";

export const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  birth_date: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  address: z.string().optional(),
  medical_history: z.string().optional(),
  sex: z.string().max(1).optional(),
  consultation_reason: z.string().optional(),
  blood_pressure: z.string().optional(),
  heart_rate: z.number().optional(),
  stomatological_exam: z.record(z.string()).optional(),
});

export type FormValues = z.infer<typeof formSchema>;