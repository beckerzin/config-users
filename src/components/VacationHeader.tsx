import { Button } from "./ui/button";
import { RefreshCw, Save } from "lucide-react";

interface VacationHeaderProps {
  hasChanges: boolean;
  loading: boolean;
  onSave: () => void;
  onRefresh: () => void;
}

export function VacationHeader({ hasChanges, loading, onSave, onRefresh }: VacationHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h1 className="text-xl sm:text-2xl font-medium text-foreground truncate">
          Gerenciamento de Férias
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">
          Gerencie o status de férias dos usuários da equipe
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <Button
          variant="outline"
          onClick={onRefresh}
          disabled={loading}
          className="gap-2 w-full sm:w-auto"
        >
          <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="truncate">Atualizar</span>
        </Button>
        
        <Button
          onClick={onSave}
          disabled={!hasChanges || loading}
          className="gap-2 w-full sm:w-auto"
        >
          <Save className="size-4" />
          <span className="truncate">Salvar Alterações</span>
        </Button>
      </div>
    </div>
  );
}