import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const PatientForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const patient = {
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      birth_date: formData.get("birth_date"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      medical_history: formData.get("medical_history"),
    };

    try {
      const { error } = await supabase.from("patients").insert([patient]);
      if (error) throw error;

      toast({
        title: "Paciente registrado",
        description: "El paciente ha sido registrado exitosamente.",
      });
      
      // Reset form
      e.currentTarget.reset();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Nombre</Label>
          <Input id="first_name" name="first_name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Apellido</Label>
          <Input id="last_name" name="last_name" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birth_date">Fecha de Nacimiento</Label>
          <Input id="birth_date" name="birth_date" type="date" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input id="phone" name="phone" type="tel" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input id="address" name="address" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medical_history">Historia Médica</Label>
        <Textarea id="medical_history" name="medical_history" />
      </div>

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
  );
};

export default PatientForm;