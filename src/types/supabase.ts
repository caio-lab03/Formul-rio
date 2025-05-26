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
      submissoes: {
        Row: {
          id: string
          nome: string
          cpf: string
          estado: string
          cidade: string
          instituicao: string
          email: string
          areas: string[]
          pdf_url: string
          codigo_submissao: string
          data_envio: string
        }
        Insert: {
          id?: string
          nome: string
          cpf: string
          estado: string
          cidade: string
          instituicao: string
          email: string
          areas: string[]
          pdf_url: string
          codigo_submissao?: string
          data_envio?: string
        }
        Update: {
          id?: string
          nome?: string
          cpf?: string
          estado?: string
          cidade?: string
          instituicao?: string
          email?: string
          areas?: string[]
          pdf_url?: string
          codigo_submissao?: string
          data_envio?: string
        }
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
  }
}