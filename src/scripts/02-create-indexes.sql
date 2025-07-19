
-- =====================================================
-- ÍNDICES PARA PERFORMANCE EM PRODUÇÃO
-- =====================================================

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_subscription_status ON profiles(subscription_status);
CREATE INDEX IF NOT EXISTS idx_profiles_trial_ends_at ON profiles(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);

-- Índices para produtos
CREATE INDEX IF NOT EXISTS idx_produtos_user_id ON produtos(user_id);
CREATE INDEX IF NOT EXISTS idx_produtos_categoria_id ON produtos(categoria_id);
CREATE INDEX IF NOT EXISTS idx_produtos_ativo ON produtos(ativo);
CREATE INDEX IF NOT EXISTS idx_produtos_estoque_baixo ON produtos(user_id, estoque_atual, estoque_minimo) WHERE estoque_atual <= estoque_minimo;
CREATE INDEX IF NOT EXISTS idx_produtos_nome_search ON produtos USING gin(to_tsvector('portuguese', nome));
CREATE INDEX IF NOT EXISTS idx_produtos_codigo_barras ON produtos(codigo_barras) WHERE codigo_barras IS NOT NULL;

-- Índices para vendas
CREATE INDEX IF NOT EXISTS idx_vendas_user_id ON vendas(user_id);
CREATE INDEX IF NOT EXISTS idx_vendas_cliente_id ON vendas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_vendas_created_at ON vendas(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendas_status ON vendas(status);
CREATE INDEX IF NOT EXISTS idx_vendas_data_mes ON vendas(user_id, date_trunc('month', created_at));

-- Índices para venda_itens
CREATE INDEX IF NOT EXISTS idx_venda_itens_venda_id ON venda_itens(venda_id);
CREATE INDEX IF NOT EXISTS idx_venda_itens_produto_id ON venda_itens(produto_id);

-- Índices para estoque_movimentacoes
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_produto_id ON estoque_movimentacoes(produto_id);
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_user_id ON estoque_movimentacoes(user_id);
CREATE INDEX IF NOT EXISTS idx_estoque_movimentacoes_created_at ON estoque_movimentacoes(created_at DESC);

-- Índices para clientes
CREATE INDEX IF NOT EXISTS idx_clientes_user_id ON clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_clientes_ativo ON clientes(ativo);
CREATE INDEX IF NOT EXISTS idx_clientes_nome_search ON clientes USING gin(to_tsvector('portuguese', nome));

-- Índices para contas a receber
CREATE INDEX IF NOT EXISTS idx_contas_receber_user_id ON contas_receber(user_id);
CREATE INDEX IF NOT EXISTS idx_contas_receber_vencimento ON contas_receber(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_contas_receber_status ON contas_receber(status);

-- Índices para contas a pagar
CREATE INDEX IF NOT EXISTS idx_contas_pagar_user_id ON contas_pagar(user_id);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_vencimento ON contas_pagar(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_contas_pagar_status ON contas_pagar(status);

-- Índices para audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tabela ON audit_logs(tabela);
