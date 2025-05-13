export interface Order {
  name: string;
  surname: string;
  dni: string;
  total: number;
  pyment_id:string;
  payment_method: string;
  products: OrderedProduct[];
}

export interface OrderedProduct {
  product: number;         // ID del producto
  unit_price: number;      // Precio por unidad
  quantity: number;        // Cantidad del producto
}