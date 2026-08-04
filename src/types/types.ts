
export type AuthenticationData = {
   id: string;
   role: string;
 };


 export type AllProducts = {
  id: string;
  name: string;
  description: string;
  price:string;
  created: string;
  category: string;
  folder: string;
}

export type AllImages = {
  id: string;
  photos: string;
}

export type AllSizes = {
  id: string;
  sizes: string;
}


export type Users ={
  id: string;
  name: string;
  email: string;
  data:string;
  cpf: string;
  password: string;
  role: string;
}

export type GetAllAdresses ={
  id: string;
  cep: string;
  street: string;
  city:string;
  complement: string;
  number: number;  
  state: string;
  user_id: string;
}

export type AllOrderByUser = {
  id: string;
  name: string;
  folder: string;
  size: string;
  price:string;
  userId: string;
}
