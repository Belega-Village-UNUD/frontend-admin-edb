import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface AdminState {
  isLogged: boolean,
  setLogged: () => void,
  role: string,
  setRole: (role: string) => void,
  avatarPreview: string | null,
  // handleGetStoreProfile: () => Promise<void>,
}

export const useAdmin = create<AdminState>()(
  (set) => ({
    avatarPreview: null,
    isLogged: false,
    setLogged: () => {
      const logged = localStorage.getItem('is_login')
      if(!logged || logged === 'false') return false
      set({ isLogged: true })
    },
    role: '',
    // handleGetStoreProfile: async () => {
    //   try {
    //     const token = usePersistedAdmin.getState().token;
    //     if(!token) return;
  
    //     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/store`, {
    //       method: 'GET',
    //       headers: {
    //         'Authorization': `Bearer ${token}`,
    //         'Content-Type': 'application/json'
    //       }
    //     });
  
    //     const responseJson = await response.json();
    //     console.log(responseJson)
    //     if (responseJson.success === true) {
    //       set({avatarPreview: responseJson.data.avatar_link})
    //       usePersistedAdmin.getState().setName(responseJson.data.name)
    //     } else {
    //       console.log(responseJson.message)
    //     }
  
    //   } catch (error: any) {
    //     console.error(error.message);
    //   }
    // },
    setRole: (role: string) => set({ role: role }),
}),
)

interface PersistedAdmin {
  name: string,
  setName: (name: string) => void,
  token: string,
  setToken: (token: string) => void,
  role: string,
  setRole: (role: string) => void,
  is_logged: boolean,
  setLogged: (is_logged: boolean) => void,
}

export const usePersistedAdmin = create<PersistedAdmin>()(
  devtools(
    persist(
      (set) => ({
        name: '',
        setName: (name: string) => set({ name }),
        token: '',
        setToken: (token: string) => set({ token }),
        role: '',
        setRole: (role: string) => set({ role }),
        is_logged: false,
        setLogged: (is_logged: boolean) => set({ is_logged: is_logged}),
      }),
      { name: 'admin-storage' }
    )
  )
)