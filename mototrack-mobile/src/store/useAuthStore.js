import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
  userToken: null,
  isLoggedIn: false,
  
  login: async (token) => {
    await AsyncStorage.setItem('token', token);
    set({ userToken: token, isLoggedIn: true });
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ userToken: null, isLoggedIn: false });
  },
  
  checkAuth: async () => {
    const token = await AsyncStorage.getItem('token');
    if (token) set({ userToken: token, isLoggedIn: true });
  }
}));