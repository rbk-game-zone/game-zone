export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    age: number;
    address: string;
    sexe: 'male' | 'female' | 'other';
    role: 'admin' | 'player';
}