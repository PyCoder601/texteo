export interface UIType {
    darkMode: boolean;
}

export interface LoginDataType {
    username: string;
    password: string;
}

export interface RegisterDataType extends LoginDataType {
    email: string;
}

export interface UserDataType {
    id: number;
    username: string;
    email: string;
    bio: string;
    avatar_url: string;
    last_seen: string | null;
    created_at: string;
}

export interface UserState {
    user: UserDataType | null
}
