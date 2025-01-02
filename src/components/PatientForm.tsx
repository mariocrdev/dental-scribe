import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DialogHeader, DialogTitle } from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { formSchema, FormValues } from "./patient-form/schema";
import { PersonalInfo } from "./patient-form/PersonalInfo";
import { MedicalInfo } from "./patient-form/MedicalInfo";
import { StomatologicalExam } from "./patient-form/StomatologicalExam";

export default function PatientForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      birth_date: "",
      address: "",
      medical_history: "",
      sex: "",
      age: undefined,
      medical_record_number: "",
      age_group: "",
      consultation_reason: "",
      current_illness: "",
      personal_family_history: "",
      blood_pressure: "",
      heart_rate: undefined,
      temperature: undefined,
      respiratory_rate: undefined,
      stomatological_exam: {
        lips: "",
        cheeks: "",
        upper_maxilla: "",
        lower_maxilla: "",
        tongue: "",
        palate: "",
        floor: "",
        lateral_cheeks: "",
        salivary_glands: "",
        oropharynx: "",
        atm: "",
        lymph_nodes: ""
      },
      oral_health_indicators: {
        dental_pieces: {
          "16_17_55": {
            plaque: "",
            calculus: "",
            gingivitis: "",
          },
          "11_21_51": {
            plaque: "",
            calculus: "",
            gingivitis: "",
          },
          "26_27_65": {
            plaque: "",
            calculus: "",
            gingivitis: "",
          },
          "36_37_75": {
            plaque: "",
            calculus: "",
            gingivitis: "",
          },
          "31_41_71": {
            plaque: "",
            calculus: "",
            gingivitis: "",
          },
          "46_47_85": {
            plaque: "",
            calculus: "",
            gingivitis: "",
          },
        },
        periodontal_disease: {
          level: undefined,
        },
        malocclusion: {
          angle_classification: undefined,
        },
        fluorosis: {
          level: undefined,
        },
      },
      cpo_ceo_indices: {
        permanent_teeth: {
          C: null,
          P: null,
          O: null,
          total: 0,
        },
        primary_teeth: {
          c: null,
          e: null,
          o: null,
          total: 0,
        },
      }
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      const { error } = await supabase.from("patients").insert({
        ...values,
        first_name: values.first_name,
        last_name: values.last_name,
      });
      
      if (error) throw error;

      toast({
        title: "Paciente agregado",
        description: "El paciente ha sido agregado exitosamente.",
      });

      queryClient.invalidateQueries({ queryKey: ["patients"] });
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Hubo un error al agregar el paciente.",
      });
    }
  }

  return (
    <div className="p-4">
      <DialogHeader>
        <DialogTitle>Agregar Nuevo Paciente</DialogTitle>
      </DialogHeader>
      
      <ScrollArea className="h-[60vh] mt-4 pr-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <PersonalInfo form={form} />
            <MedicalInfo form={form} />
            <StomatologicalExam form={form} />
            
            <div className="pt-4 space-x-2 flex justify-end">
              <Button type="submit">Guardar Paciente</Button>
            </div>
          </form>
        </Form>
      </ScrollArea>
    </div>
  );
}