export interface Dog {
    _id:string;
    name: string;
    breed: string;
    price: number;
    imageUrl: string;
    description:string;
}

export interface DogsCart extends Dog{
    quantity?:number;
}