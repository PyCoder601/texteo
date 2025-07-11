import {store} from "@/redux/store";
import axios, {AxiosResponse} from "axios";
import {ACCESS_TOKEN} from "@/utils/constant";
import {setUser, logoutUser} from "@/redux/userSlice";
import api from "@/service/api";
import {LoginDataType, RegisterDataType} from "@/utils/types";
import {fetchConversations} from "@/redux/conversationSlice";

export default async function authenticate(data: RegisterDataType | LoginDataType, type: 'login' | 'register') {
    try {
        const res: AxiosResponse = await api.post(`/${type}/`, data, {withCredentials: true});
        store.dispatch(setUser(res.data.user));
        sessionStorage.setItem(ACCESS_TOKEN, res.data.token);
        store.dispatch(fetchConversations());
        return true
    } catch (err) {
        if (axios.isAxiosError(err)) {
            return err.response?.data?.detail || "Erreur inconnue"
        } else {
            return "Erreur réseau ou serveur";
        }
    }
}

export async function logout() {
    await api.post('/logout/');
    sessionStorage.removeItem(ACCESS_TOKEN);
    store.dispatch(logoutUser());
}