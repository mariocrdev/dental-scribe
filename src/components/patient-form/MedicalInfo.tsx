import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { FormValues } from "./schema";

interface MedicalInfoProps {
  form: UseFormReturn<FormValues>;
}

export function MedicalInfo({ form }: MedicalInfoProps) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="medical_history"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Antecedentes Médicos</FormLabel>
            <FormControl>
              <Textarea placeholder="Antecedentes Médicos" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="consultation_reason"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Motivo de Consulta</FormLabel>
            <FormControl>
              <Textarea placeholder="Motivo de Consulta" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="blood_pressure"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Presión Arterial</FormLabel>
              <FormControl>
                <Input placeholder="Presión Arterial" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="heart_rate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frecuencia Cardíaca</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Frecuencia Cardíaca"
                  {...field}
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}