import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail, Building, MapPin, Upload } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  SubmissionFormValues,
  submissionSchema,
  areasOptions,
  formatCPF,
} from '../utils/validators';
import {
  saveSubmission,
  uploadResume,
  supabase,
} from '../lib/supabase';
import {
  getEstados,
  getCidades,
  Estado,
  Cidade,
} from '../services/ibgeApi';
import FormInput from './FormInput';
import FormSelect from './FormSelect';
import FormCheckboxGroup from './FormCheckboxGroup';
import FormFileUpload from './FormFileUpload';
import SuccessMessage from './SuccessMessage';
import Auth from './Auth';

const SubmissionForm: React.FC = () => {
  const [estados, setEstados] = useState<Estado[]>([]);
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successCode, setSuccessCode] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<SubmissionFormValues>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      areas: [],
    },
  });

  const selectedEstado = watch('estado');

  useEffect(() => {
    checkAuth();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
  };

  useEffect(() => {
    const loadEstados = async () => {
      const data = await getEstados();
      setEstados(data);
    };
    loadEstados();
  }, []);

  useEffect(() => {
    const loadCidades = async () => {
      if (selectedEstado) {
        const estadoId = estados.find((e) => e.sigla === selectedEstado)?.id;
        if (estadoId) {
          const data = await getCidades(estadoId);
          setCidades(data);
        }
      } else {
        setCidades([]);
      }
    };
    loadCidades();
  }, [selectedEstado, estados]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const onSubmit = async (data: SubmissionFormValues) => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para enviar um resumo.');
      return;
    }

    try {
      setLoading(true);
      const fileName = `${data.cpf}_${Date.now()}.pdf`;
      const uploadUrl = await uploadResume(data.resumo, fileName);
      const code = await saveSubmission({
        nome: data.nome,
        cpf: data.cpf,
        estado: data.estado,
        cidade: data.cidade,
        instituicao: data.instituicao,
        email: data.email,
        areas: data.areas,
        pdf_url: uploadUrl,
      });
      setSuccessCode(code);
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Erro ao enviar o formulário. Por favor, tente novamente.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCPF(e.target.value);
    setValue('cpf', formattedValue);
  };

  const handleResetForm = () => {
    setSuccessCode(null);
    reset();
  };

  if (!isAuthenticated) {
    return <Auth />;
  }

  if (successCode) {
    return <SuccessMessage code={successCode} onReset={handleResetForm} />;
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={5000} />

      {/* Fundo com imagem fixa e overlay */}
      <div
        className="fixed inset-0 bg-cover bg-center z-0"
        style={{ backgroundImage: 'url("/background1.png")' }}
      >
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
      </div>

      {/* Container rolável */}
      <div className="relative z-10 max-w-3xl w-full h-[90vh] bg-white/90 backdrop-blur-md rounded-lg shadow-xl overflow-y-auto p-8">
        <div className="text-center mb-8">
          <img 
            src="/engBRASIL25.png" 
            alt="engBRASIL25 Logo" 
            className="w-64 mx-auto mb-6"
          />
          <h1 className="text-2xl font-bold text-red-600 sm:text-3xl mb-2">
            Módulo de Submissão de Resumo
          </h1>
          <p className="text-gray-600 mb-2">
            Preencha todos os campos abaixo para submeter seu resumo
          </p>
          <button
            onClick={handleLogout}
            className="text-sm text-red-600 hover:text-red-500 mt-2"
          >
            Sair
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-6">
          <FormInput
            label="Nome Completo"
            id="nome"
            type="text"
            placeholder="Digite seu nome completo"
            register={register}
            error={errors.nome}
            icon={<User size={18} />}
          />

          <FormInput
            label="CPF"
            id="cpf"
            type="text"
            placeholder="Apenas números (11 dígitos)"
            register={register}
            error={errors.cpf}
            onChange={handleCPFChange}
            maxLength={11}
          />

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <FormSelect
              label="Estado"
              id="estado"
              control={control}
              options={estados.map((estado) => ({
                value: estado.sigla,
                label: estado.nome,
              }))}
              placeholder="Selecione o estado"
              error={errors.estado}
              icon={<MapPin size={18} />}
            />

            <FormSelect
              label="Cidade"
              id="cidade"
              control={control}
              options={cidades.map((cidade) => ({
                value: cidade.nome,
                label: cidade.nome,
              }))}
              placeholder="Selecione a cidade"
              error={errors.cidade}
              disabled={!selectedEstado}
              icon={<MapPin size={18} />}
            />
          </div>

          <FormInput
            label="Instituição ou Empresa"
            id="instituicao"
            type="text"
            placeholder="Digite o nome da instituição"
            register={register}
            error={errors.instituicao}
            icon={<Building size={18} />}
          />

          <FormInput
            label="E-mail"
            id="email"
            type="email"
            placeholder="Digite seu e-mail"
            register={register}
            error={errors.email}
            icon={<Mail size={18} />}
          />

          <FormCheckboxGroup
            label="Selecione a área cobertura"
            id="areas"
            options={areasOptions}
            register={register}
            error={errors.areas}
          />

          <FormFileUpload
            label="Upload de Resumo"
            id="resumo"
            accept=".pdf"
            control={control}
            error={errors.resumo}
            progress={uploadProgress}
            icon={<Upload size={18} />}
          />

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-colors duration-200 disabled:opacity-70"
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Enviando...
                </span>
              ) : (
                'Enviar Resumo'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;