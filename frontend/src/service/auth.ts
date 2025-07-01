import {store} from "@/redux/store";
import {AxiosResponse} from "axios";
import {ACCESS_TOKEN} from "@/utils/constant";
import {loginUser, logoutUser} from "@/redux/userSlice";
import api from "@/service/api";
import {LoginDataType, RegisterDataType} from "@/utils/types";

export default async function authenticate(data: RegisterDataType | LoginDataType, type: 'login' | 'register') {
    try {
        const res: AxiosResponse = await api.post(`/${type}/`, data, {withCredentials: true});
        store.dispatch(loginUser(res.data.user));
        sessionStorage.setItem(ACCESS_TOKEN, res.data.token);
        return true
    } catch (err) {
        return err instanceof Error ? err.message : "Erreur lors de l'authentification"
    }
}

export async function logout() {
    // Remove token from localStorage
    await api.post('/logout/');
    sessionStorage.removeItem(ACCESS_TOKEN);
    // Dispatch logout action to clear user from Redux store
    store.dispatch(logoutUser());
}