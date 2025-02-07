import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types/tables/user';
// interface User {
//     id: number;
//     username: string;
//     email: string;
//     first_name: string;
//     last_name: string;
//     age: number;
//     address: string;
//     sexe: 'male' | 'female' | 'other';
//     role: 'admin' | 'player';
// }

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    token: string | null;
    isAuthenticated: boolean;
}
const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("user") as string) as User  || null, // Initialize user as null
    status: 'idle',
    error: null,
    token: localStorage.getItem("token")|| null,
    isAuthenticated: false
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, username, password,role,first_name,last_name,age,address,sexe }: { email: string, username: string, password: string,role:string,first_name:string,last_name:string,age:number,address:string,sexe:string }) => {
        const response = await axios.post('http://localhost:8000/api/user/login', { email, username, password,role,first_name,last_name,age,address,sexe });
        return response.data;
    }

);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: object) => {
        const response = await axios.post('http://localhost:8000/api/user/register', userData);
        console.log(response.data);
        return response.data;
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            state.token = action.payload.token;
            if (action.payload.user) {
                state.user = action.payload.user;
            }
        },
        updateUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
            state.isAuthenticated = true;
            state.token = localStorage.getItem('token');
        },
        deleteUser: (state, action) => {
            state.user=action.payload
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
                localStorage.setItem('user', JSON.stringify(action.payload.user));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Login failed';
            })
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Registration failed';
            })
            
            
    }
});

export const { setCredentials, updateUser } = authSlice.actions;

export default authSlice.reducer;