
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { AppSidebar } from "@/components/AppSidebar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppointmentDialog } from "@/components/AppointmentDialog";
import { AppointmentsList } from "@/components/AppointmentsList";
import { Tables } from "@/integrations/supabase/types";

type AppointmentWithPatient = Tables<"appointments"> & {
  patients: {
    first_name: string;
    last_name: string;
  } | null;
};

const Appointments = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAppointmentDialogOpen, setIsAppointmentDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithPatient | null>(null);

  const { data: appointments, isLoading, refetch } = useQuery({
    queryKey: ["appointments", date],
    queryFn: async () => {
      if (!date) return [];

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      const { data, error } = await supabase
        .from("appointments")
        .select(`
          *,
          patients:patient_id (
            first_name,
            last_name
          )
        `)
        .gte("start_time", startOfDay.toISOString())
        .lte("start_time", endOfDay.toISOString())
        .order("start_time", { ascending: true });

      if (error) {
        console.error("Error fetching appointments:", error);
        throw error;
      }
      
      return data as AppointmentWithPatient[];
    },
    enabled: !!date,
  });

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate);
  };

  const handleCreateAppointment = () => {
    setSelectedAppointment(null);
    setIsAppointmentDialogOpen(true);
  };

  const handleEditAppointment = (appointment: AppointmentWithPatient) => {
    setSelectedAppointment(appointment);
    setIsAppointmentDialogOpen(true);
  };

  return (
    <div className="flex h-screen bg-background dark:bg-gray-900">
      <AppSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold dark:text-white">
              Citas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col">
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Calendario</h2>
                <div className="p-4 border rounded-md bg-card dark:bg-gray-700">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateChange}
                    className="mx-auto"
                    locale={es}
                  />
                </div>
                {date && (
                  <div className="mt-4 flex flex-col">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium dark:text-white">
                        {format(date, "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
                      </h3>
                      <button 
                        onClick={handleCreateAppointment}
                        className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                      >
                        Nueva Cita
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 dark:text-white">Citas del día</h2>
                <AppointmentsList 
                  isLoading={isLoading} 
                  appointments={appointments || []}
                  onEdit={handleEditAppointment}
                  onDelete={refetch}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <AppointmentDialog
          open={isAppointmentDialogOpen}
          onOpenChange={setIsAppointmentDialogOpen}
          selectedDate={date}
          appointment={selectedAppointment}
          onSuccess={refetch}
        />
      </div>
    </div>
  );
};

export default Appointments;
