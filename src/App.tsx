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

        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="size-4 sm:size-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs sm:text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">
                Como funciona:
              </p>
              <ul className="space-y-1 text-xs">
                <li>
                  • Use o switch ao lado do status para alterar
                </li>
                <li>
                  • ✅ Verde = Trabalhando, ❌ Vermelho = De Férias
                </li>
                <li>
                  • Switch verde (ativo) = usuário trabalhando
                </li>
                <li>
                  • O botão "Salvar" envia todos os usuários
                  que tiveram alterações para a webhook
                </li>
                <li className="hidden sm:block">
                  • As URLs das webhooks podem ser configuradas
                  no arquivo useVacationManager.ts
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}