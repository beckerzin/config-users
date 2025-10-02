import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { User } from "../hooks/useVacationManager";
import { Calendar } from "lucide-react";
import { DateInput } from "./DateInput";

interface UserItemProps {
  user: User;
  onToggle: (userId: string) => void;
  onDateChange?: (userId: string, date: string) => void;
  disabled?: boolean;
}

export function UserItem({ user, onToggle, onDateChange, disabled = false }: UserItemProps) {
  const isWorking = user.ferias === 'desactived'; // 'desactived' significa trabalhando
  const showDateField = !isWorking; // Mostra campo de data quando de férias
  
  return (
    <div 
      className="p-4 bg-white border border-white-200 rounded-lg shadow-sm"
      style={{ touchAction: 'auto' }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0"> {/* min-w-0 para truncar texto se necessário */}
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-gray-900 truncate">{user.nome}</h3>
            <span 
              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${
                isWorking 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800' 
              }`}
            >
              {isWorking ? 'Ativado' : 'Desativado'}
            </span>
          </div>
          <p className="text-sm text-gray-500 truncate">
            Status: {isWorking ? 'Trabalhando' : 'De Férias'}
          </p>
        </div>
        
        <div className="ml-3 flex-shrink-0"> {/* flex-shrink-0 garante que o switch não diminua */}
          <Switch
            checked={isWorking}
            onCheckedChange={() => onToggle(user.id)}
            disabled={disabled}
            className={`transition-all duration-200 ${
              isWorking 
                ? 'bg-green-500 data-[state=checked]:bg-green-500' 
                : 'bg-gray-300 data-[state=unchecked]:bg-gray-300'
            }`}
          />
        </div>
      </div>
      
      {showDateField && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="size-4 text-gray-400" />
            <Label htmlFor={`date-${user.id}`} className="text-sm text-gray-600">
              Data de início das férias:
            </Label>
          </div>
          <div className="relative">
            <DateInput
              id={`date-${user.id}`}
              value={user.data || ''}
              onChange={(value) => onDateChange?.(user.id, value)}
              disabled={disabled}
            />
          </div>
        </div>
      )}
    </div>
  );
}