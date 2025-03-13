
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";
import { format, parse } from "date-fns";

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate?: Date;
  appointment: (Tables<"appointments"> & { 
    patients: { first_name: string; last_name: string; } | null 
  }) | null;
  onSuccess: () => void;
}

interface FormValues {
  patient_id: string;
  title: string;
  start_time: string;
  end_time: string;
  description: string;
  status: string;
}

export function AppointmentDialog({
  open,
  onOpenChange,
  selectedDate,
  appointment,
  onSuccess,
}: AppointmentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    defaultValues: {
      patient_id: "",
      title: "",
      start_time: selectedDate 
        ? format(selectedDate, "HH:mm") 
        : format(new Date().setHours(9, 0, 0, 0), "HH:mm"),
      end_time: selectedDate 
        ? format(selectedDate, "HH:mm") 
        : format(new Date().setHours(10, 0, 0, 0), "HH:mm"),
      description: "",
      status: "pendiente",
    },
  });

  useEffect(() => {
    if (appointment) {
      const startDate = new Date(appointment.start_time);
      const endDate = new Date(appointment.end_time);

      form.reset({
        patient_id: appointment.patient_id,
        title: appointment.title,
        start_time: format(startDate, "HH:mm"),
        end_time: format(endDate, "HH:mm"),
        description: appointment.description || "",
        status: appointment.status || "pendiente",
      });
    } else {
      form.reset({
        patient_id: "",
        title: "",
        start_time: selectedDate 
          ? format(new Date(selectedDate).setHours(9, 0, 0, 0), "HH:mm") 
          : format(new Date().setHours(9, 0, 0, 0), "HH:mm"),
        end_time: selectedDate 
          ? format(new Date(selectedDate).setHours(10, 0, 0, 0), "HH:mm") 
          : format(new Date().setHours(10, 0, 0, 0), "HH:mm"),
        description: "",
        status: "pendiente",
      });
    }
  }, [appointment, selectedDate, form, open]);

  const { data: patients, isLoading } = useQuery({
    queryKey: ["patients"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { data, error } = await supabase
        .from("patients")
        .select("id, first_name, last_name")
        .eq('user_id', user.id)
        .order("last_name", { ascending: true });

      if (error) {
        console.error("Error fetching patients:", error);
        throw error;
      }
      
      return data;
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!selectedDate) return;
    
    setIsSubmitting(true);
    
    try {
      // Crear fechas completas combinando la fecha seleccionada con las horas del formulario
      const startDateTime = new Date(selectedDate);
      const [startHours, startMinutes] = values.start_time.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);
      
      const endDateTime = new Date(selectedDate);
      const [endHours, endMinutes] = values.end_time.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes, 0, 0);
      
      if (appointment) {
        // Actualizar cita existente
        const { error } = await supabase
          .from("appointments")
          .update({
            patient_id: values.patient_id,
            title: values.title,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            description: values.description,
            status: values.status,
          })
          .eq("id", appointment.id);
          
        if (error) throw error;
        toast.success("Cita actualizada correctamente");
      } else {
        // Crear nueva cita
        const { error } = await supabase
          .from("appointments")
          .insert({
            patient_id: values.patient_id,
            title: values.title,
            start_time: startDateTime.toISOString(),
            end_time: endDateTime.toISOString(),
            description: values.description,
            status: values.status,
          });
          
        if (error) throw error;
        toast.success("Cita creada correctamente");
      }
      
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error saving appointment:", error);
      toast.error("Error al guardar la cita");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle>
            {appointment ? "Editar Cita" : "Nueva Cita"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="patient_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paciente</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                    disabled={isLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar paciente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {patients?.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {patient.first_name} {patient.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. Limpieza dental" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de inicio</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de fin</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detalles de la cita..."
                      className="resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : appointment ? "Actualizar" : "Crear"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
