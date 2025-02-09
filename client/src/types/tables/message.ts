export interface Message {
    id: string;
    content: string;
    User?: {
        username: string;
    };
    createdAt: string;
}