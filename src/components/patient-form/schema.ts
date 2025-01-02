import * as z from "zod";

export const formSchema = z.object({
  first_name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  last_name: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email("Correo electrónico inválido").optional().or(z.literal("")),
  phone: z.string().optional(),
  birth_date: z.string().optional(),
  address: z.string().optional(),
  medical_history: z.string().optional(),
  sex: z.string().max(1).optional(), // Ensure sex is max 1 character
  age: z.number().int().positive().optional(),
  medical_record_number: z.string().optional(),
  age_group: z.string().optional(),
  consultation_reason: z.string().optional(),
  current_illness: z.string().optional(),
  personal_family_history: z.string().optional(),
  blood_pressure: z.string().optional(),
  heart_rate: z.number().int().positive().optional(),
  temperature: z.number().positive().optional(),
  respiratory_rate: z.number().int().positive().optional(),
  stomatological_exam: z.object({
    lips: z.string().optional(),
    cheeks: z.string().optional(),
    upper_maxilla: z.string().optional(),
    lower_maxilla: z.string().optional(),
    tongue: z.string().optional(),
    palate: z.string().optional(),
    floor: z.string().optional(),
    lateral_cheeks: z.string().optional(),
    salivary_glands: z.string().optional(),
    oropharynx: z.string().optional(),
    atm: z.string().optional(),
    lymph_nodes: z.string().optional()
  }).optional(),
  oral_health_indicators: z.object({
    dental_pieces: z.object({
      "16_17_55": z.object({
        plaque: z.string().optional(),
        calculus: z.string().optional(),
        gingivitis: z.string().optional(),
      }),
      "11_21_51": z.object({
        plaque: z.string().optional(),
        calculus: z.string().optional(),
        gingivitis: z.string().optional(),
      }),
      "26_27_65": z.object({
        plaque: z.string().optional(),
        calculus: z.string().optional(),
        gingivitis: z.string().optional(),
      }),
      "36_37_75": z.object({
        plaque: z.string().optional(),
        calculus: z.string().optional(),
        gingivitis: z.string().optional(),
      }),
      "31_41_71": z.object({
        plaque: z.string().optional(),
        calculus: z.string().optional(),
        gingivitis: z.string().optional(),
      }),
      "46_47_85": z.object({
        plaque: z.string().optional(),
        calculus: z.string().optional(),
        gingivitis: z.string().optional(),
      }),
    }),
    periodontal_disease: z.object({
      level: z.enum(["LEVE", "MODERADA", "SEVERA"]).optional(),
    }),
    malocclusion: z.object({
      angle_classification: z.enum(["I", "II", "III"]).optional(),
    }),
    fluorosis: z.object({
      level: z.enum(["LEVE", "MODERADA", "SEVERA"]).optional(),
    }),
  }).optional(),
  cpo_ceo_indices: z.object({
    permanent_teeth: z.object({
      C: z.number().min(0).nullable(),
      P: z.number().min(0).nullable(),
      O: z.number().min(0).nullable(),
      total: z.number().min(0).optional(),
    }),
    primary_teeth: z.object({
      c: z.number().min(0).nullable(),
      e: z.number().min(0).nullable(),
      o: z.number().min(0).nullable(),
      total: z.number().min(0).optional(),
    }),
  }).optional(),
});

export type FormValues = z.infer<typeof formSchema>;