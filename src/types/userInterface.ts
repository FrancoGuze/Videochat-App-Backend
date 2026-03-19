type User = [string, string]
export interface UserRepositoryInterface {
    add: (socketId: string, userId: string) => void
    remove: (socketId: string) => void
    findByUserId: (userId: string) => User | undefined
}

export interface UserServiceInterface {
    joinRoom: (socketId: string, userId: string) => void;
    findUserSocket: (userId: string) => User | undefined
}