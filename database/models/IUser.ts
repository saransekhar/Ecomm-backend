export interface IUser {
    _id?: string;
    username?: string;
    email: string;
    password: string;
    imageUrl: string;
    isAdmin?: boolean;
    isSuperAdmin?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}