export interface UIType {
    darkMode: boolean;
    toShowOptions: number | null
    toShowReactions: number | null
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

export interface FriendType {
    id: number,
    username: string,
    avatar_url: string | null
}

export interface MessageType {
    id: number;
    sender_id: number;
    content: string;
    type: "text" | "photo";
    reaction: string | null;
    created_at: string;
}

export interface ConversationDataType {
    id: number;
    friend: FriendType;
    last_message: MessageType | null;
    last_message_at: string | null
}


export interface ConversationState {
    conversations: ConversationDataType[];
    currentConversation: ConversationDataType | null;
    messages: MessageType[];
}

