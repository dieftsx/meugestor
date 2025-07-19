
-- =====================================================
-- ESTRUTURA COMPLETA DO BANCO DE DADOS PARA PRODUÇÃO
-- Sistema de Gestão para Pequenos Negócios - GestãoRO
-- =====================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- TABELAS PRINCIPAIS
-- =====================================================

-- Tabela de perfis de usuários (estende auth.users)
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
  subscription_status TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled', 'incomplete')),
  subscription_id TEXT,
  current_period_end TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '15 days'),
  
  -- Configurações
  timezone TEXT DEFAULT 'America/Porto_Velho',
  currency TEXT DEFAULT 'BRL',
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Índices para performance
  CONSTRAINT valid_email CHECK (id IS NOT NULL)
);

-- Tabela de categorias de produtos
CREATE TABLE IF NOT EXISTS categorias (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  cor TEXT DEFAULT '#3B82F6',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, nome)
);

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  contato TEXT,
  telefone TEXT,
  email TEXT,
  endereco TEXT,
  cnpj TEXT,
  observacoes TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de produtos
CREATE TABLE IF NOT EXISTS produtos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  categoria_id UUID REFERENCES categorias(id) ON DELETE SET NULL,
  fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
  
  -- Informações básicas
  nome TEXT NOT NULL,
  descricao TEXT,
  codigo_barras TEXT,
  sku TEXT,
  
  -- Preços e custos
  preco_venda DECIMAL(10,2) NOT NULL DEFAULT 0,
  preco_custo DECIMAL(10,2) DEFAULT 0,
  margem_lucro DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
      WHEN preco_custo > 0 THEN ((preco_venda - preco_custo) / preco_custo * 100)
      ELSE 0 
    END
  ) STORED,
  
  -- Estoque
  estoque_atual INTEGER DEFAULT 0,
  estoque_minimo INTEGER DEFAULT 0,
  estoque_maximo INTEGER DEFAULT 1000,
  unidade_medida TEXT DEFAULT 'un',
  
  -- Controle de validade
  controla_validade BOOLEAN DEFAULT false,
  dias_vencimento INTEGER,
  
  -- Status e configurações
  ativo BOOLEAN DEFAULT true,
  destaque BOOLEAN DEFAULT false,
  permite_venda_sem_estoque BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para performance
  CONSTRAINT produtos_preco_positivo CHECK (preco_venda >= 0),
  CONSTRAINT produtos_estoque_positivo CHECK (estoque_atual >= 0)
);

-- Tabela de clientes
CREATE TABLE IF NOT EXISTS clientes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Informações pessoais
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf_cnpj TEXT,
  data_nascimento DATE,
  
  -- Endereço
  endereco TEXT,
  cidade TEXT,
  estado TEXT DEFAULT 'RO',
  cep TEXT,
  
  -- Informações comerciais
  limite_credito DECIMAL(10,2) DEFAULT 0,
  saldo_devedor DECIMAL(10,2) DEFAULT 0,
  
  -- Configurações
  ativo BOOLEAN DEFAULT true,
  observacoes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ultima_compra TIMESTAMP WITH TIME ZONE
);

-- Tabela de vendas
CREATE TABLE IF NOT EXISTS vendas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE SET NULL,
  
  -- Numeração
  numero_venda SERIAL,
  
  -- Valores
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  desconto DECIMAL(10,2) DEFAULT 0,
  acrescimo DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  
  -- Pagamento
  forma_pagamento TEXT NOT NULL DEFAULT 'dinheiro' CHECK (forma_pagamento IN ('dinheiro', 'cartao_debito', 'cartao_credito', 'pix', 'transferencia', 'cheque', 'crediario', 'misto')),
  status_pagamento TEXT DEFAULT 'pago' CHECK (status_pagamento IN ('pendente', 'pago', 'parcial', 'cancelado')),
  
  -- Status da venda
  status TEXT DEFAULT 'finalizada' CHECK (status IN ('orcamento', 'finalizada', 'cancelada')),
  
  -- Observações
  observacoes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Índices para performance
  CONSTRAINT vendas_total_positivo CHECK (total >= 0)
);

-- Tabela de itens da venda
CREATE TABLE IF NOT EXISTS venda_itens (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  venda_id UUID REFERENCES vendas(id) ON DELETE CASCADE NOT NULL,
  produto_id UUID REFERENCES produtos(id) ON DELETE RESTRICT NOT NULL,
  
  -- Quantidades e preços
  quantidade DECIMAL(10,3) NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL,
  desconto_item DECIMAL(10,2) DEFAULT 0,
  subtotal DECIMAL(10,2) GENERATED ALWAYS AS (quantidade * preco_unitario - desconto_item) STORED,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT venda_itens_quantidade_positiva CHECK (quantidade > 0),
  CONSTRAINT venda_itens_preco_positivo CHECK (preco_unitario >= 0)
);

-- Tabela de movimentações de estoque
CREATE TABLE IF NOT EXISTS estoque_movimentacoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE NOT NULL,
  venda_id UUID REFERENCES vendas(id) ON DELETE SET NULL,
  
  -- Movimentação
  tipo TEXT NOT NULL CHECK (tipo IN ('entrada', 'saida', 'ajuste', 'perda', 'transferencia')),
  quantidade_anterior INTEGER NOT NULL,
  quantidade INTEGER NOT NULL,
  quantidade_nova INTEGER NOT NULL,
  
  -- Detalhes
  motivo TEXT,
  observacoes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabela de contas a receber
CREATE TABLE IF NOT EXISTS contas_receber (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES clientes(id) ON DELETE CASCADE NOT NULL,
  venda_id UUID REFERENCES vendas(id) ON DELETE SET NULL,
  
  -- Valores
  valor_original DECIMAL(10,2) NOT NULL,
  valor_pago DECIMAL(10,2) DEFAULT 0,
  valor_pendente DECIMAL(10,2) GENERATED ALWAYS AS (valor_original - valor_pago) STORED,
  
  -- Datas
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  
  -- Status
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado')),
  
  -- Observações
  observacoes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de contas a pagar
CREATE TABLE IF NOT EXISTS contas_pagar (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  fornecedor_id UUID REFERENCES fornecedores(id) ON DELETE SET NULL,
  
  -- Informações básicas
  descricao TEXT NOT NULL,
  categoria TEXT DEFAULT 'fornecedor',
  
  -- Valores
  valor_original DECIMAL(10,2) NOT NULL,
  valor_pago DECIMAL(10,2) DEFAULT 0,
  valor_pendente DECIMAL(10,2) GENERATED ALWAYS AS (valor_original - valor_pago) STORED,
  
  -- Datas
  data_vencimento DATE NOT NULL,
  data_pagamento DATE,
  
  -- Status
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'vencido', 'cancelado')),
  
  -- Observações
  observacoes TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de backups
CREATE TABLE IF NOT EXISTS backups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Dados do backup
  backup_data JSONB NOT NULL,
  tamanho_bytes BIGINT,
  
  -- Tipo e status
  tipo TEXT DEFAULT 'manual' CHECK (tipo IN ('manual', 'automatico', 'agendado')),
  status TEXT DEFAULT 'concluido' CHECK (status IN ('processando', 'concluido', 'erro')),
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '90 days')
);

-- Tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS configuracoes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Configurações gerais
  nome_empresa TEXT,
  logo_url TEXT,
  tema TEXT DEFAULT 'light' CHECK (tema IN ('light', 'dark', 'auto')),
  
  -- Configurações de vendas
  permitir_venda_sem_estoque BOOLEAN DEFAULT false,
  solicitar_cliente_venda BOOLEAN DEFAULT false,
  imprimir_cupom_automatico BOOLEAN DEFAULT true,
  
  -- Configurações de estoque
  alerta_estoque_baixo BOOLEAN DEFAULT true,
  alerta_produto_vencimento BOOLEAN DEFAULT true,
  dias_alerta_vencimento INTEGER DEFAULT 7,
  
  -- Configurações de backup
  backup_automatico BOOLEAN DEFAULT true,
  frequencia_backup TEXT DEFAULT 'diario' CHECK (frequencia_backup IN ('diario', 'semanal', 'mensal')),
  
  -- Notificações
  notificacoes_email BOOLEAN DEFAULT true,
  notificacoes_whatsapp BOOLEAN DEFAULT false,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- Tabela de logs de auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Ação realizada
  acao TEXT NOT NULL,
  tabela TEXT NOT NULL,
  registro_id UUID,
  
  -- Dados da alteração
  dados_anteriores JSONB,
  dados_novos JSONB,
  
  -- Contexto
  ip_address INET,
  user_agent TEXT,
  
  -- Metadados
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
