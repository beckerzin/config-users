import { useVacationManager } from "./hooks/useVacationManager";
import { VacationHeader } from "./components/VacationHeader";
import { UserList } from "./components/UserList";
import { Alert, AlertDescription } from "./components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { Toaster } from "./components/ui/sonner";

export default function App() {
  const {
    users,
    loading,
    error,
    hasChanges,
    toggleUserStatus,
    updateUserDate,
    saveChanges,
    refreshData,
  } = useVacationManager();

  const handleSave = async () => {
    try {
      await saveChanges();
      toast.success("Alterações salvas com sucesso!");
    } catch (err) {
      toast.error("Erro ao salvar alterações");
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshData();
      toast.success("Dados atualizados com sucesso!");
    } catch (err) {
      toast.error("Erro ao atualizar dados");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-4xl">
        <VacationHeader
          hasChanges={hasChanges}
          loading={loading}
          onSave={handleSave}
          onRefresh={handleRefresh}
        />

        {error && (
          <Alert variant="destructive" className="mt-4 sm:mt-6">
            <AlertCircle className="size-4" />
            <AlertDescription className="text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {hasChanges && !error && (
          <Alert className="mt-4 sm:mt-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
            <AlertCircle className="size-4 text-red-600 dark:text-red-400" />
            <AlertDescription className="text-sm text-red-800 dark:text-red-200">
              *Você tem alterações não salvas. Clique em "Salvar
              Alterações" para confirmar.
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 sm:mt-8">
          <UserList
            users={users}
            loading={loading}
            onToggleUser={toggleUserStatus}
            onUpdateUserDate={updateUserDate}
          />
        </div>
      </div>

      <Toaster />
    </div>
  );
}