export interface Dog {
    id: number;
    name: string;
    breed: string;
    price: number;
    imageUrl: string;
    description:string
}

export interface DogsCart extends Dog{
    quantity?:number;
}