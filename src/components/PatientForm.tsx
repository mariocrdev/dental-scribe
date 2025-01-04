import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PatientForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      birth_date: "",
      phone: "",
      email: "",
      address: "",
      medical_history: "",
      sex: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      const { error } = await supabase.from("patients").insert({
        first_name: data.first_name,
        last_name: data.last_name,
        birth_date: data.birth_date || null,
        phone: data.phone || null,
        email: data.email || null,
        address: data.address || null,
        medical_history: data.medical_history || null,
        sex: data.sex || null,
      });
      
      if (error) throw error;

      toast({
        title: "Paciente registrado",
        description: "El paciente ha sido registrado exitosamente.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Hubo un error al registrar el paciente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <PersonalInfo form={form} />
        
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Guardando...
            </>
          ) : (
            "Guardar Paciente"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PatientForm;