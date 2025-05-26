const BASE_URL = 'https://servicodados.ibge.gov.br/api/v1';

export interface Estado {
  id: number;
  sigla: string;
  nome: string;
}

export interface Cidade {
  id: number;
  nome: string;
}

export async function getEstados(): Promise<Estado[]> {
  try {
    const response = await fetch(`${BASE_URL}/localidades/estados?orderBy=nome`);
    if (!response.ok) {
      throw new Error('Falha ao carregar estados');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    return [];
  }
}

export async function getCidades(estadoId: number): Promise<Cidade[]> {
  if (!estadoId) return [];
  
  try {
    const response = await fetch(`${BASE_URL}/localidades/estados/${estadoId}/municipios?orderBy=nome`);
    if (!response.ok) {
      throw new Error('Falha ao carregar cidades');
    }
    return response.json();
  } catch (error) {
    console.error('Erro ao buscar cidades:', error);
    return [];
  }
}