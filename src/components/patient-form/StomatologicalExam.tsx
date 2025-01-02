import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface StomatologicalExamProps {
  form: UseFormReturn<FormValues>;
}

export function StomatologicalExam({ form }: StomatologicalExamProps) {
  const examFields = [
    { name: "lips" as const, label: "1. Labios" },
    { name: "cheeks" as const, label: "2. Mejillas" },
    { name: "upper_maxilla" as const, label: "3. Maxilar Superior" },
    { name: "lower_maxilla" as const, label: "4. Maxilar Inferior" },
    { name: "tongue" as const, label: "5. Lengua" },
    { name: "palate" as const, label: "6. Paladar" },
    { name: "floor" as const, label: "7. Piso" },
    { name: "lateral_cheeks" as const, label: "8. Carrillos" },
    { name: "salivary_glands" as const, label: "9. Glándulas Salivales" },
    { name: "oropharynx" as const, label: "10. Oro Faringe" },
    { name: "atm" as const, label: "11. A.T.M." },
    { name: "lymph_nodes" as const, label: "12. Ganglios" },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Examen del Sistema Estomatognático</h3>
      <div className="grid grid-cols-2 gap-4">
        {examFields.map((field) => (
          <FormField
            key={field.name}
            control={form.control}
            name={`stomatological_exam.${field.name}`}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea placeholder={`Descripción de ${field.label.toLowerCase()}`} {...formField} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}