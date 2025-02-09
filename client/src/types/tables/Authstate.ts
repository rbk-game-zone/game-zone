import {User} from "./user"
export interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    token: string | null;
    isAuthenticated: boolean;
}