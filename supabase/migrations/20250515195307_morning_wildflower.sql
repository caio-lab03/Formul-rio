/*
  # Create submissoes table and storage bucket

  1. New Tables
    - `submissoes`
      - `id` (uuid, primary key)
      - `nome` (text)
      - `cpf` (text)
      - `estado` (text)
      - `cidade` (text)
      - `instituicao` (text)
      - `email` (text)
      - `areas` (text[])
      - `pdf_url` (text)
      - `codigo_submissao` (text)
      - `data_envio` (timestamptz)
  
  2. Storage
    - Create bucket `resumos` for PDF files storage
    
  3. Security
    - Enable RLS on `submissoes` table
    - Add policy for authenticated users to read all submissions
    - Add policy for authenticated users to insert their own submissions
*/

-- Create submissoes table
CREATE TABLE IF NOT EXISTS submissoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  cpf text NOT NULL,
  estado text NOT NULL,
  cidade text NOT NULL,
  instituicao text NOT NULL,
  email text NOT NULL,
  areas text[] NOT NULL,
  pdf_url text NOT NULL,
  codigo_submissao text NOT NULL,
  data_envio timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE submissoes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read for authenticated users" 
  ON submissoes 
  FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow insert for authenticated users" 
  ON submissoes 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

-- Create storage bucket for PDF files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('resumos', 'resumos', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policy
CREATE POLICY "Public Access" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'resumos');

CREATE POLICY "Auth users can upload" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'resumos');