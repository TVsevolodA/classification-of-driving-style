export enum Role {
    USER = "user",
    ADMIN = "admin"
}

export type User = {
    id: number
    username: string
    full_name: string
    role: Role
    phone: string
    address: string
}