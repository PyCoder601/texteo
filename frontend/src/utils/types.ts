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
    username: string;
    email: string;
    bio: string;
    avatar_url: string;
    last_seen: string;
}

export interface UserState {
    user: UserDataType | null
    token: string | null
}
