import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { supabase } from '../lib/supabase';
import FormInput from './FormInput';

const authSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

type AuthFormValues = z.infer<typeof authSchema>;

const Auth: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const handleAuth = async (data: AuthFormValues) => {
    setLoading(true);
    try {
      if (isRegistering) {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
        toast.success('Cadastro realizado com sucesso! Você já pode fazer login.');
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });
        if (error) throw error;
      }
      reset();
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar sua solicitação');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Imagem de fundo com blur e escurecimento */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url('/background.png')` }}
      />
      <div className="fixed inset-0 z-0 bg-black bg-opacity-10 backdrop-blur-sm" />

      {/* Formulário com rolagem */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 overflow-auto">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-md rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <img
              src="/engBRASIL25.png"
              alt="engBRASIL25 Logo"
              className="w-64 mx-auto mb-6"
            />
            <h2 className="text-2xl font-bold text-red-600">
              {isRegistering ? 'Criar Conta' : 'Fazer Login'}
            </h2>
            <p className="text-gray-600 mt-2">
              {isRegistering
                ? 'Preencha os dados para criar sua conta'
                : 'Entre com suas credenciais'}
            </p>
          </div>

          <form onSubmit={handleSubmit(handleAuth)} className="space-y-6">
            <FormInput
              label="E-mail"
              id="email"
              type="email"
              placeholder="Digite seu e-mail"
              register={register}
              error={errors.email}
              icon={<Mail size={18} />}
            />

            <FormInput
              label="Senha"
              id="password"
              type="password"
              placeholder="Digite sua senha"
              register={register}
              error={errors.password}
              icon={<Lock size={18} />}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 disabled:opacity-50"
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
                  Processando...
                </span>
              ) : isRegistering ? (
                'Cadastrar'
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-sm text-red-600 hover:text-red-500"
            >
              {isRegistering
                ? 'Já tem uma conta? Faça login'
                : 'Não tem uma conta? Cadastre-se'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
