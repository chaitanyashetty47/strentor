export interface Courses{
  id:number,
  title:string,
  imageUrl:string,
  description:string,
  duration:string,
  level:string,
  createdById:number
}

export interface User{
  name:string,
  aboutMe:string,
  avatarUrl:string,
  bio:string
}

export interface Folders{
  id:number,
  type:string,
  title:string,
  hidden: boolean,
  description: string,
  thumbnail:string,
}