import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { User } from '../types/tables/user';
import { AuthState } from "../types/tables/Authstate"

const API_URL = import.meta.env.VITE_API_URL;

const initialState: AuthState = {
    user: JSON.parse(localStorage.getItem("user") as string) as User  || null, // Initialize user as null
    status: 'idle',
    error: null,
    token: localStorage.getItem("token")|| null,
    isAuthenticated: false
};

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, username, password }: { email: string; username: string; password: string }, thunkAPI) => {
        try {
            const response = await axios.post(`${API_URL}/api/user/login`, { email, username, password });
            return response.data;
        } catch (error:any) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);;

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData: object,thunkAPI) => {
        try{
            const response = await axios.post(`${API_URL}/api/user/register`, userData);
            console.log(response.data);
            return response.data;
        }catch(error:any){
            return thunkAPI.rejectWithValue(error.response.data);
        }
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
            console.log("Updating user in Redux:", action.payload); // Debugging log
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