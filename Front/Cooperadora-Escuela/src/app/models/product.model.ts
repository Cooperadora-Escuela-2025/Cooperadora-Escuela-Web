export interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
    quantity?: number; // Propiedad opcional para la cantidad
}