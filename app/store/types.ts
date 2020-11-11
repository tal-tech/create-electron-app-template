export interface IUserInfo{
  id: string
  name: string
  age: number
}

export interface IStore {
  token: string
  userInfo: IUserInfo
}
