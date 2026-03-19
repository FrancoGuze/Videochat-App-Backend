type User = [string, string]
export interface UserRepositoryInterface {
    add: (socketId: string, userId: string) => void
    remove: (socketId: string) => void
    findByUserId: (userId: string) => User | undefined
    findBySocketId: (socketId: string) => string | undefined
    listSocketIds: () => string[]
}

export interface UserServiceInterface {
    joinRoom: (socketId: string, userId: string) => void;
    findUserSocket: (userId: string) => User | undefined
    findUserIdBySocket: (socketId: string) => string | undefined
    removeBySocket: (socketId: string) => void
    listSocketIds: () => string[]
}
