export interface CreateUserDto {
  username: string
  password: string
  nickname?: string
  avatar?: string
}

export interface LoginUserDto {
  username: string
  password: string
}
