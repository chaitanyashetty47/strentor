export interface Courses{
  id:number,
  title:string,
  imageUrl:string,
  description:string,
  openToEveryone:boolean,
  slug:string,
  
}

export interface Folders{
  id:number,
  type:string,
  title:string,
  hidden: boolean,
  description: string,
  thumbnail:string,
}