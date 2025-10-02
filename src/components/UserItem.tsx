import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { User } from "../hooks/useVacationManager";
import { Calendar } from "lucide-react";

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
            <input
              id={`date-${user.id}`}
              type="date"
              value={user.data || ''}
              onChange={(e) => onDateChange?.(user.id, e.target.value)}
              disabled={disabled}
              className="flex h-12 w-full max-w-xs rounded-md border border-input bg-input-background px-3 py-2 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              style={{
                WebkitAppearance: 'none',
                MozAppearance: 'none',
                appearance: 'none',
                fontSize: '16px', // Evita zoom automático no iOS
                minHeight: '48px', // Altura mínima para touch targets no iOS
                touchAction: 'manipulation', // Previne double-tap zoom
                userSelect: 'none'
              }}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              readOnly={false}
              data-testid={`date-input-${user.id}`}
              onTouchStart={(e) => {
                // Para iOS: garante que o evento não seja capturado por outros elementos
                e.stopPropagation();
                const target = e.currentTarget;
                // Usa setTimeout para garantir que o foco aconteça após outros eventos
                setTimeout(() => {
                  target.focus();
                  target.click();
                }, 10);
              }}
              onFocus={(e) => {
                // Tenta abrir o date picker quando o campo recebe foco
                const target = e.currentTarget;
                if ('showPicker' in target && typeof target.showPicker === 'function') {
                  setTimeout(() => {
                    try {
                      target.showPicker();
                    } catch (error) {
                      // Ignora erro se showPicker não estiver disponível
                    }
                  }, 100);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}