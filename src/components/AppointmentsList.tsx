
import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Tables } from "@/integrations/supabase/types";
import { Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AppointmentWithPatient = Tables<"appointments"> & {
  patients: {
    first_name: string;
    last_name: string;
  } | null;
};

interface AppointmentsListProps {
  appointments: AppointmentWithPatient[];
  isLoading: boolean;
  onEdit: (appointment: AppointmentWithPatient) => void;
  onDelete: () => void;
}

export function AppointmentsList({ 
  appointments, 
  isLoading, 
  onEdit,
  onDelete 
}: AppointmentsListProps) {
  const [appointmentToDelete, setAppointmentToDelete] = useState<AppointmentWithPatient | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'confirmada':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'cancelada':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'completada':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const handleDeleteAppointment = async () => {
    if (!appointmentToDelete) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", appointmentToDelete.id);
        
      if (error) throw error;
      
      toast.success("Cita eliminada correctamente");
      onDelete();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error("Error al eliminar la cita");
    } finally {
      setIsDeleting(false);
      setAppointmentToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="p-6 text-center border rounded-md bg-card dark:bg-gray-700">
        <p className="text-gray-500 dark:text-gray-400">No hay citas programadas para este día</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div 
          key={appointment.id} 
          className="p-4 border rounded-md bg-card dark:bg-gray-700 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium dark:text-white">{appointment.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Paciente: {appointment.patients?.first_name} {appointment.patients?.last_name}
              </p>
              <div className="flex items-center mt-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mr-3">
                  {format(new Date(appointment.start_time), "HH:mm")} - {format(new Date(appointment.end_time), "HH:mm")}
                </p>
                <span 
                  className={`text-xs px-2 py-1 rounded-full capitalize ${getStatusColor(appointment.status || 'pendiente')}`}
                >
                  {appointment.status}
                </span>
              </div>
              {appointment.description && (
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  {appointment.description}
                </p>
              )}
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => onEdit(appointment)}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button 
                variant="destructive" 
                size="icon"
                onClick={() => setAppointmentToDelete(appointment)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <AlertDialog 
        open={!!appointmentToDelete} 
        onOpenChange={(open) => !open && setAppointmentToDelete(null)}
      >
        <AlertDialogContent className="dark:bg-gray-800">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la cita y no se podrá recuperar.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteAppointment}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground"
            >
              {isDeleting ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
