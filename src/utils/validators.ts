import { z } from 'zod';

export const submissionSchema = z.object({
  nome: z.string().min(3, 'Nome completo é obrigatório'),
  cpf: z.string()
    .length(11, 'CPF deve ter 11 dígitos')
    .regex(/^\d+$/, 'CPF deve conter apenas números'),
  estado: z.string().min(1, 'Estado é obrigatório'),
  cidade: z.string().min(1, 'Cidade é obrigatória'),
  instituicao: z.string().min(1, 'Instituição ou Empresa é obrigatória'),
  email: z.string().email('E-mail inválido'),
  areas: z.array(z.string()).min(1, 'Selecione pelo menos uma área'),
  resumo: z
    .instanceof(File, { message: 'Arquivo de resumo é obrigatório' })
    .refine((file) => file.size <= 10 * 1024 * 1024, {
      message: 'O arquivo deve ter no máximo 10MB',
    })
    .refine((file) => file.type === 'application/pdf', {
      message: 'O arquivo deve ser um PDF',
    }),
});

export type SubmissionFormValues = z.infer<typeof submissionSchema>;

export const areasOptions = [
  'Processos de Fabricação',
  'Corrosão',
  'Metalurgia Física',
  'Mecânica da Fratura e Análise de Falha',
  'END e Inspeção',
  'Tribologia / Engenharia de Superfícies',
  'Metalurgia Extrativa / Siderurgia',
  'Seleção de Materiais e Técnicas de Caracterização',
  'Indústria 4.0',
  'Educação em Engenharia',
  'Outras'
];

export function formatCPF(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 11);
}