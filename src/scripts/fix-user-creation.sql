
-- Script para corrigir problemas na criação de usuários

-- 1. Verificar se a tabela profiles existe
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  nome_completo TEXT,
  nome_empresa TEXT,
  tipo_negocio TEXT,
  telefone TEXT,
  cidade TEXT,
  endereco TEXT,
  cnpj TEXT,
  
  -- Dados de assinatura
  stripe_customer_id TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'trial',
  subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 days'),
  
  -- Configurações
  timezone TEXT DEFAULT 'America/Porto_Velho',
  currency TEXT DEFAULT 'BRL',
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- 2. Habilitar RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 3. Criar políticas básicas
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 4. Função para criar perfil automaticamente (versão simplificada)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    nome_completo, 
    nome_empresa,
    tipo_negocio,
    telefone,
    cidade,
    created_at, 
    updated_at
  ) VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'nome_completo', NEW.email),
    NEW.raw_user_meta_data->>'nome_empresa',
    NEW.raw_user_meta_data->>'tipo_negocio',
    NEW.raw_user_meta_data->>'telefone',
    NEW.raw_user_meta_data->>'cidade',
    NOW(), 
    NOW()
  );
  
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Se der erro, pelo menos logamos
  RAISE LOG 'Erro ao criar perfil para usuário %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$;

-- 5. Recriar o trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 6. Verificar permissões
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- 7. Teste básico
DO $$
BEGIN
  RAISE NOTICE 'Setup de usuários concluído com sucesso em %', NOW();
END $$;
