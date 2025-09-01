export interface userData {
    name: string,
    email: string,
    password: string,
}
export interface Error {
    message: string,
    code: number
}

export interface Session {
    user: {
      id: string
      name: string
      email: string
      role: string
    } 
}