import { User } from "../hooks/useVacationManager";
import { UserItem } from "./UserItem";
import { Skeleton } from "./ui/skeleton";

interface UserListProps {
  users: User[];
  loading: boolean;
  onToggleUser: (userId: string) => void;
  onUpdateUserDate: (userId: string, date: string) => void;
}

export function UserList({ users, loading, onToggleUser, onUpdateUserDate }: UserListProps) {
  if (loading && users.length === 0) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-12 ml-3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Nenhum usuário encontrado.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3" style={{ paddingBottom: '170px' }}>
      {users.map((user) => (
        <UserItem
          key={user.id}
          user={user}
          onToggle={onToggleUser}
          onDateChange={onUpdateUserDate}
          disabled={loading}
        />
      ))}
    </div>
  );
}