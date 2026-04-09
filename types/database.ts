export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      productos: {
        Row: {
          id: string
          slug: string
          nombre: string
          marca: string
          descripcion: string
          notas: Json
          imagenes: string[]
          ml_totales_botella: number
          created_at: string
        }
        Insert: {
          id?: string
          slug: string
          nombre: string
          marca: string
          descripcion: string
          notas?: Json
          imagenes?: string[]
          ml_totales_botella?: number
          created_at?: string
        }
        Update: {
          id?: string
          slug?: string
          nombre?: string
          marca?: string
          descripcion?: string
          notas?: Json
          imagenes?: string[]
          ml_totales_botella?: number
          created_at?: string
        }
      }
      variantes: {
        Row: {
          id: string
          producto_id: string
          ml: number
          precio: number
          stock: number
          costo: number | null
          created_at: string
        }
        Insert: {
          id?: string
          producto_id: string
          ml: number
          precio: number
          stock?: number
          costo?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          producto_id?: string
          ml?: number
          precio?: number
          stock?: number
          costo?: number | null
          created_at?: string
        }
      }
      ordenes: {
        Row: {
          id: string
          items: Json
          total: number
          status: string
          mp_payment_id: string | null
          payer_email: string | null
          metodo_entrega: string
          cliente_nombre: string
          cliente_apellido: string
          cliente_telefono: string
          direccion_envio: Json | null
          shipping_cost: number
          nro_seguimiento: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          items: Json
          total: number
          status?: string
          mp_payment_id?: string | null
          payer_email?: string | null
          metodo_entrega: string
          cliente_nombre: string
          cliente_apellido: string
          cliente_telefono: string
          direccion_envio?: Json | null
          shipping_cost?: number
          nro_seguimiento?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          items?: Json
          total?: number
          status?: string
          mp_payment_id?: string | null
          payer_email?: string | null
          metodo_entrega?: string
          cliente_nombre?: string
          cliente_apellido?: string
          cliente_telefono?: string
          direccion_envio?: Json | null
          shipping_cost?: number
          nro_seguimiento?: string | null
          created_at?: string
          updated_at?: string | null
        }
      }
      cupones: {
        Row: {
          id: string
          codigo: string
          valor: number
          tipo: string
          activo: boolean
          expiracion: string | null
          minimo_compra: number | null
          usos_maximos: number | null
          usos_actuales: number
          created_at: string
        }
        Insert: {
          id?: string
          codigo: string
          valor: number
          tipo: string
          activo?: boolean
          expiracion?: string | null
          minimo_compra?: number | null
          usos_maximos?: number | null
          usos_actuales?: number
          created_at?: string
        }
        Update: {
          id?: string
          codigo?: string
          valor?: number
          tipo?: string
          activo?: boolean
          expiracion?: string | null
          minimo_compra?: number | null
          usos_maximos?: number | null
          usos_actuales?: number
          created_at?: string
        }
      }
    }
  }
}
