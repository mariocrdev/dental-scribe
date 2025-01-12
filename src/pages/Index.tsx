import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Stethoscope, Trash2 } from "lucide-react";
import PatientForm from "@/components/PatientForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OdontogramDialog } from "@/components/OdontogramDialog";
import { PatientDetailsDialog } from "@/components/PatientDetailsDialog";
import { Tables } from "@/integrations/supabase/types";
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
import { toast } from "sonner";
import { AppSidebar } from "@/components/AppSidebar";
import { UserManagement } from "@/components/UserManagement";

const SearchInput = ({ value, onChange }: { value: string; onChange: (value: string) => void }) => (
  <div className="flex items-center space-x-2 mb-4">
    <Input
      placeholder="Buscar pacientes..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="max-w-sm"
    />
  </div>
);

const PatientList = ({ 
  patients, 
  isLoading, 
  onSelectOdontogram, 
  onSelectDetails,
  onDeletePatient 
}: { 
  patients: Tables<"patients">[] | null;
  isLoading: boolean;
  onSelectOdontogram: (id: string) => void;
  onSelectDetails: (patient: Tables<"patients">) => void;
  onDeletePatient: (patient: Tables<"patients">) => void;
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 border-gray-200">
      {patients?.map((patient) => (
        <Card key={patient.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">
                  {patient.first_name} {patient.last_name}
                </h3>
                <p className="text-sm text-gray-500">{patient.email}</p>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => onSelectOdontogram(patient.id)}
                >
                  <Stethoscope className="mr-2 h-4 w-4" />
                  Odontograma
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => onSelectDetails(patient)}
                >
                  Ver Detalles
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => onDeletePatient(patient)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Tables<"patients"> | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Tables<"patients"> | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);

  const { data: currentUserRole } = useQuery({
    queryKey: ["current-user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      const { data: userRole, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return userRole.role;
    },
  });

  const { data: patients, isLoading, refetch } = useQuery({
    queryKey: ["patients", search],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user logged in");

      let query = supabase
        .from("patients")
        .select("*")
        .eq('user_id', user.id)
        .order("created_at", { ascending: false });

      if (search) {
        query = query.or(
          `first_name.ilike.%${search}%,last_name.ilike.%${search}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;

    try {
      const { error: dentalRecordsError } = await supabase
        .from("dental_records")
        .delete()
        .eq("patient_id", patientToDelete.id);

      if (dentalRecordsError) throw dentalRecordsError;

      const { error: patientError } = await supabase
        .from("patients")
        .delete()
        .eq("id", patientToDelete.id);

      if (patientError) throw patientError;

      toast.success("Paciente eliminado correctamente");
      refetch();
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Error al eliminar el paciente");
    } finally {
      setPatientToDelete(null);
    }
  };

  return (
    <div className="flex h-screen bg-background dark:bg-gray-900">
      <AppSidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="space-y-8">
          {currentUserRole === 'admin' && (
            <UserManagement />
          )}
          
          <Card className="dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-2xl font-bold dark:text-white">Pacientes</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Paciente
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[90%] h-[90%] dark:bg-gray-800">
                  <PatientForm onSuccess={refetch} />
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <SearchInput value={search} onChange={setSearch} />
              <PatientList 
                patients={patients}
                isLoading={isLoading}
                onSelectOdontogram={setSelectedPatientId}
                onSelectDetails={setSelectedPatient}
                onDeletePatient={setPatientToDelete}
              />
            </CardContent>
          </Card>
        </div>

        <OdontogramDialog
          patientId={selectedPatientId || ""}
          open={!!selectedPatientId}
          onOpenChange={(open) => !open && setSelectedPatientId(null)}
        />

        <PatientDetailsDialog
          patient={selectedPatient}
          open={!!selectedPatient}
          onOpenChange={(open) => !open && setSelectedPatient(null)}
        />

        <AlertDialog open={!!patientToDelete} onOpenChange={() => setPatientToDelete(null)}>
          <AlertDialogContent className="dark:bg-gray-800">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente al paciente {patientToDelete?.first_name} {patientToDelete?.last_name} y todos sus registros dentales asociados.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeletePatient} className="bg-destructive text-destructive-foreground">
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Index;
