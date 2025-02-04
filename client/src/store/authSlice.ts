import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
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

interface AuthState {
    user: User | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null, // Initialize user as null
    status: 'idle',
    error: null,
    token: null
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ username,email, password }: { username: string, email: string, password: string }) => {
        const response = await  axios.post('http://localhost:8000/api/user/login', { username, email ,password });
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

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;