import { create } from 'zustand';
import { mountStoreDevtool } from 'simple-zustand-devtools';

// Create a custom Zustand store named 'useAuthStore' using the 'create' function.
const useAuthStore = create((set, get) => ({
    // Define the 'user' object to store user-related data directly.
    user: {
        user_id: null,
        username: null,
    },

    // Define the 'loading' state variable and initialize it to false.
    loading: false,

    // Define a function 'setUser' that allows setting the 'user' state.
    setUser: (user) => set({ user }), // Set 'user' directly

    // Define a function 'setLoading' that allows setting the 'loading' state.
    setLoading: (loading) => set({ loading }),

    // Define a function 'isLoggedIn' that checks if 'user' has an ID.
    isLoggedIn: () => get().user?.user_id !== null,
}));

// Conditionally attach the DevTools only in a development environment.
if (import.meta.env.DEV) {
    mountStoreDevtool('Store', useAuthStore);
}

// Export the 'useAuthStore' for use in other parts of the application.
export { useAuthStore };
