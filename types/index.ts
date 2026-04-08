export interface Variante {
  ml: number;
  precio: number;
  stock: number;
  costo?: number;
}

export interface Producto {
  id: string;
  slug: string;
  nombre: string;
  marca: string;
  descripcion: string;
  notas: {
    salida: string[];
    corazon: string[];
    fondo: string[];
  };
  imagenes: string[];
  variantes: Variante[];
  mlTotalesBotella?: number;
}

export interface CartItem {
  id: string;
  slug: string;
  nombre: string;
  marca: string;
  imagen: string;
  variante: Variante;
  quantity: number;
}

export interface ShippingInfo {
  metodo: "retiro" | "envio";
  nombre?: string;
  apellido?: string;
  telefono?: string;
  email?: string;
  calle?: string;
  numero?: string;
  piso?: string;
  depto?: string;
  provincia?: string;
  ciudad?: string;
  codigoPostal?: string;
  notas?: string;
}

export interface Coupon {
  id: string;
  codigo: string;
  tipo: "porcentaje" | "fijo";
  valor: number;
  minimo_compra?: number;
  expiracion?: Date;
  usos_maximos?: number;
  usos_actuales: number;
  activo: boolean;
  created_at: Date;
}

export interface Order {
  id?: string;
  items: CartItem[];
  total: number;
  status: "pending" | "approved" | "rejected" | "in_process" | "shipped" | "delivered";
  mpPaymentId?: string;
  payerEmail?: string;
  metodoEntrega?: "retiro" | "envio";
  clienteNombre?: string;
  clienteApellido?: string;
  clienteTelefono?: string;
  direccionEnvio?: Partial<ShippingInfo>;
  shippingCost?: number;
  cupon_id?: string;
  descuento?: number;
  createdAt: Date;
  updatedAt?: Date;
  trackingNumber?: string;
}

