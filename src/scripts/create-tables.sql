-- Tabela de perfis de usuários
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  nome_completo TEXT,
  nome_empresa TEXT,
  tipo_negocio TEXT,
  telefone TEXT,
  cidade TEXT,
  stripe_customer_id TEXT,
  subscription_status TEXT DEFAULT 'trial',
  subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Tabela de produtos
CREATE TABLE produtos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  nome TEXT NOT NULL,
  categoria TEXT,
  preco DECIMAL(10,2),
  estoque_atual INTEGER DEFAULT 0,
  estoque_minimo INTEGER DEFAULT 0,
  codigo_barras TEXT,
  fornecedor TEXT,
  data_vencimento DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de vendas
CREATE TABLE vendas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  total DECIMAL(10,2) NOT NULL,
  desconto DECIMAL(10,2) DEFAULT 0,
  forma_pagamento TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens da venda
CREATE TABLE venda_itens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  venda_id UUID REFERENCES vendas ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos ON DELETE CASCADE,
  quantidade INTEGER NOT NULL,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de clientes
CREATE TABLE clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  endereco TEXT,
  data_nascimento DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de backups
CREATE TABLE backups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  backup_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de movimentações de estoque
CREATE TABLE estoque_movimentacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  produto_id UUID REFERENCES produtos ON DELETE CASCADE,
  tipo TEXT NOT NULL, -- 'entrada', 'saida', 'ajuste'
  quantidade INTEGER NOT NULL,
  motivo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE venda_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_movimentacoes ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own produtos" ON produtos FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own vendas" ON vendas FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own venda_itens" ON venda_itens FOR ALL USING (
  EXISTS (SELECT 1 FROM vendas WHERE vendas.id = venda_itens.venda_id AND vendas.user_id = auth.uid())
);
CREATE POLICY "Users can manage own clientes" ON clientes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own backups" ON backups FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own estoque_movimentacoes" ON estoque_movimentacoes FOR ALL USING (auth.uid() = user_id);

-- Função para criar perfil automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, created_at, updated_at)
  VALUES (new.id, new.raw_user_meta_data->>'nome_completo', now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
