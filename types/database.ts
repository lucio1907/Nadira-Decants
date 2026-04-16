export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      configuracion: {
        Row: {
          created_at: string
          id: string
          mp_access_token: string | null
          mp_public_key: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          mp_access_token?: string | null
          mp_public_key?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          mp_access_token?: string | null
          mp_public_key?: string | null
        }
        Relationships: []
      }
      cupones: {
        Row: {
          activo: boolean | null
          codigo: string
          created_at: string
          expiracion: string | null
          id: string
          minimo_compra: number | null
          tipo: string
          usos_actuales: number | null
          usos_maximos: number | null
          valor: number
        }
        Insert: {
          activo?: boolean | null
          codigo: string
          created_at?: string
          expiracion?: string | null
          id?: string
          minimo_compra?: number | null
          tipo: string
          usos_actuales?: number | null
          usos_maximos?: number | null
          valor: number
        }
        Update: {
          activo?: boolean | null
          codigo?: string
          created_at?: string
          expiracion?: string | null
          id?: string
          minimo_compra?: number | null
          tipo?: string
          usos_actuales?: number | null
          usos_maximos?: number | null
          valor?: number
        }
        Relationships: []
      }
      ordenes: {
        Row: {
          cliente_apellido: string | null
          cliente_nombre: string | null
          cliente_telefono: string | null
          created_at: string
          cupon_id: string | null
          descuento: number | null
          direccion_envio: Json | null
          email_sent: boolean | null
          id: string
          items: Json
          metodo_entrega: string | null
          mp_payment_id: string | null
          nro_seguimiento: string | null
          payer_email: string | null
          shipping_cost: number | null
          status: string | null
          total: number
          label_url: string | null
          envia_shipment_id: string | null
          envia_carrier: string | null
          envia_service: string | null
          updated_at: string | null
        }
        Insert: {
          cliente_apellido?: string | null
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          created_at?: string
          cupon_id?: string | null
          descuento?: number | null
          direccion_envio?: Json | null
          email_sent?: boolean | null
          id?: string
          items: Json
          metodo_entrega?: string | null
          mp_payment_id?: string | null
          nro_seguimiento?: string | null
          payer_email?: string | null
          shipping_cost?: number | null
          status?: string | null
          total: number
          label_url?: string | null
          envia_shipment_id?: string | null
          envia_carrier?: string | null
          envia_service?: string | null
          updated_at?: string | null
        }
        Update: {
          cliente_apellido?: string | null
          cliente_nombre?: string | null
          cliente_telefono?: string | null
          created_at?: string
          cupon_id?: string | null
          descuento?: number | null
          direccion_envio?: Json | null
          email_sent?: boolean | null
          id?: string
          items?: Json
          metodo_entrega?: string | null
          mp_payment_id?: string | null
          nro_seguimiento?: string | null
          payer_email?: string | null
          shipping_cost?: number | null
          status?: string | null
          total?: number
          label_url?: string | null
          envia_shipment_id?: string | null
          envia_carrier?: string | null
          envia_service?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ordenes_cupon_id_fkey"
            columns: ["cupon_id"]
            isOneToOne: false
            referencedRelation: "cupones"
            referencedColumns: ["id"]
          },
        ]
      }
      productos: {
        Row: {
          created_at: string | null
          descripcion: string | null
          genero: string | null
          id: string
          imagenes: string[] | null
          marca: string
          ml_totales_botella: number | null
          nombre: string
          notas: Json | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          descripcion?: string | null
          genero?: string | null
          id?: string
          imagenes?: string[] | null
          marca: string
          ml_totales_botella?: number | null
          nombre: string
          notas?: Json | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          descripcion?: string | null
          genero?: string | null
          id?: string
          imagenes?: string[] | null
          marca?: string
          ml_totales_botella?: number | null
          nombre?: string
          notas?: Json | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      variantes: {
        Row: {
          costo: number | null
          created_at: string | null
          id: string
          ml: number
          precio: number
          producto_id: string
          stock: number | null
        }
        Insert: {
          costo?: number | null
          created_at?: string | null
          id?: string
          ml: number
          precio: number
          producto_id: string
          stock?: number | null
        }
        Update: {
          costo?: number | null
          created_at?: string | null
          id?: string
          ml?: number
          precio?: number
          producto_id?: string
          stock?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "variantes_producto_id_fkey"
            columns: ["producto_id"]
            isOneToOne: false
            referencedRelation: "productos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicSchemaNameOrOptions extends
    | keyof Database
    | { schema: keyof Database },
  EnumName extends PublicSchemaNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicSchemaNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicSchemaNameOrOptions extends { schema: keyof Database }
  ? Database[PublicSchemaNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicSchemaNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicSchemaNameOrOptions]
    : never

export type CompositeTypes<
  PublicSchemaNameOrOptions extends
    | keyof Database
    | { schema: keyof Database },
  CompositeTypeName extends PublicSchemaNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicSchemaNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicSchemaNameOrOptions extends { schema: keyof Database }
  ? Database[PublicSchemaNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicSchemaNameOrOptions extends keyof Database["public"]["CompositeTypes"]
    ? Database["public"]["CompositeTypes"][PublicSchemaNameOrOptions]
    : never
