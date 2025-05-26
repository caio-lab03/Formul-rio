import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function getNextSubmissionCode(): Promise<string> {
  const { count } = await supabase
    .from('submissoes')
    .select('*', { count: 'exact', head: true });
  
  const nextNumber = (count || 0) + 1;
  return `ENG${nextNumber.toString().padStart(4, '0')}`;
}

export async function uploadResume(file: File, fileName: string): Promise<string> {
  const { data, error } = await supabase.storage
    .from('resumos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    throw error;
  }

  const { data: publicURL } = supabase.storage
    .from('resumos')
    .getPublicUrl(data.path);

  return publicURL.publicUrl;
}

export async function saveSubmission(submissionData: any): Promise<string> {
  const submissionCode = await getNextSubmissionCode();
  
  const { error } = await supabase.from('submissoes').insert([
    { 
      ...submissionData,
      codigo_submissao: submissionCode,
      data_envio: new Date().toISOString()
    }
  ]);

  if (error) {
    throw error;
  }

  return submissionCode;
}