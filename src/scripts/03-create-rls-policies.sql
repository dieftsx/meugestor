
-- =====================================================
-- POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendas ENABLE ROW LEVEL SECURITY;
ALTER TABLE venda_itens ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque_movimentacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_receber ENABLE ROW LEVEL SECURITY;
ALTER TABLE contas_pagar ENABLE ROW LEVEL SECURITY;
ALTER TABLE backups ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas para profiles
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Políticas para categorias
CREATE POLICY "Users can manage own categorias" ON categorias FOR ALL USING (auth.uid() = user_id);

-- Políticas para fornecedores
CREATE POLICY "Users can manage own fornecedores" ON fornecedores FOR ALL USING (auth.uid() = user_id);

-- Políticas para produtos
CREATE POLICY "Users can manage own produtos" ON produtos FOR ALL USING (auth.uid() = user_id);

-- Políticas para clientes
CREATE POLICY "Users can manage own clientes" ON clientes FOR ALL USING (auth.uid() = user_id);

-- Políticas para vendas
CREATE POLICY "Users can manage own vendas" ON vendas FOR ALL USING (auth.uid() = user_id);

-- Políticas para venda_itens
CREATE POLICY "Users can manage own venda_itens" ON venda_itens FOR ALL USING (
  EXISTS (SELECT 1 FROM vendas WHERE vendas.id = venda_itens.venda_id AND vendas.user_id = auth.uid())
);

-- Políticas para estoque_movimentacoes
CREATE POLICY "Users can manage own estoque_movimentacoes" ON estoque_movimentacoes FOR ALL USING (auth.uid() = user_id);

-- Políticas para contas_receber
CREATE POLICY "Users can manage own contas_receber" ON contas_receber FOR ALL USING (auth.uid() = user_id);

-- Políticas para contas_pagar
CREATE POLICY "Users can manage own contas_pagar" ON contas_pagar FOR ALL USING (auth.uid() = user_id);

-- Políticas para backups
CREATE POLICY "Users can manage own backups" ON backups FOR ALL USING (auth.uid() = user_id);

-- Políticas para configuracoes
CREATE POLICY "Users can manage own configuracoes" ON configuracoes FOR ALL USING (auth.uid() = user_id);

-- Políticas para audit_logs
CREATE POLICY "Users can view own audit_logs" ON audit_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert audit_logs" ON audit_logs FOR INSERT WITH CHECK (true);
