
-- =====================================================
-- FUNÇÕES E TRIGGERS PARA AUTOMAÇÃO
-- =====================================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categorias_updated_at BEFORE UPDATE ON categorias FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fornecedores_updated_at BEFORE UPDATE ON fornecedores FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON clientes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vendas_updated_at BEFORE UPDATE ON vendas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contas_receber_updated_at BEFORE UPDATE ON contas_receber FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contas_pagar_updated_at BEFORE UPDATE ON contas_pagar FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_configuracoes_updated_at BEFORE UPDATE ON configuracoes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Função para criar perfil automaticamente quando usuário se registra
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_completo, created_at, updated_at)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'nome_completo', new.email), 
    now(), 
    now()
  );
  
  -- Criar configurações padrão
  INSERT INTO public.configuracoes (user_id, created_at, updated_at)
  VALUES (new.id, now(), now());
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para criar perfil automaticamente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Função para atualizar estoque após venda
CREATE OR REPLACE FUNCTION update_estoque_after_venda()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Reduzir estoque
    UPDATE produtos 
    SET estoque_atual = estoque_atual - NEW.quantidade
    WHERE id = NEW.produto_id;
    
    -- Registrar movimentação
    INSERT INTO estoque_movimentacoes (
      user_id, produto_id, venda_id, tipo, 
      quantidade_anterior, quantidade, quantidade_nova, motivo
    )
    SELECT 
      p.user_id, p.id, NEW.venda_id, 'saida',
      p.estoque_atual + NEW.quantidade, -NEW.quantidade, p.estoque_atual,
      'Venda #' || v.numero_venda
    FROM produtos p
    JOIN vendas v ON v.id = NEW.venda_id
    WHERE p.id = NEW.produto_id;
    
  ELSIF TG_OP = 'DELETE' THEN
    -- Devolver estoque
    UPDATE produtos 
    SET estoque_atual = estoque_atual + OLD.quantidade
    WHERE id = OLD.produto_id;
    
    -- Registrar movimentação
    INSERT INTO estoque_movimentacoes (
      user_id, produto_id, venda_id, tipo, 
      quantidade_anterior, quantidade, quantidade_nova, motivo
    )
    SELECT 
      p.user_id, p.id, OLD.venda_id, 'entrada',
      p.estoque_atual - OLD.quantidade, OLD.quantidade, p.estoque_atual,
      'Cancelamento venda #' || v.numero_venda
    FROM produtos p
    JOIN vendas v ON v.id = OLD.venda_id
    WHERE p.id = OLD.produto_id;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar estoque
CREATE TRIGGER trigger_update_estoque_after_venda
  AFTER INSERT OR DELETE ON venda_itens
  FOR EACH ROW EXECUTE FUNCTION update_estoque_after_venda();

-- Função para calcular totais da venda
CREATE OR REPLACE FUNCTION calculate_venda_totals()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE vendas 
  SET 
    subtotal = (
      SELECT COALESCE(SUM(quantidade * preco_unitario - desconto_item), 0)
      FROM venda_itens 
      WHERE venda_id = NEW.venda_id
    ),
    total = (
      SELECT COALESCE(SUM(quantidade * preco_unitario - desconto_item), 0) - COALESCE(desconto, 0) + COALESCE(acrescimo, 0)
      FROM venda_itens 
      WHERE venda_id = NEW.venda_id
    )
  WHERE id = NEW.venda_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para calcular totais
CREATE TRIGGER trigger_calculate_venda_totals
  AFTER INSERT OR UPDATE OR DELETE ON venda_itens
  FOR EACH ROW EXECUTE FUNCTION calculate_venda_totals();

-- Função para atualizar status de contas vencidas
CREATE OR REPLACE FUNCTION update_contas_vencidas()
RETURNS void AS $$
BEGIN
  -- Atualizar contas a receber vencidas
  UPDATE contas_receber 
  SET status = 'vencido'
  WHERE status = 'pendente' 
    AND data_vencimento < CURRENT_DATE;
  
  -- Atualizar contas a pagar vencidas
  UPDATE contas_pagar 
  SET status = 'vencido'
  WHERE status = 'pendente' 
    AND data_vencimento < CURRENT_DATE;
END;
$$ LANGUAGE plpgsql;

-- Função para backup automático
CREATE OR REPLACE FUNCTION create_automatic_backup(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
  backup_id UUID;
  backup_data JSONB;
BEGIN
  -- Coletar dados do usuário
  SELECT jsonb_build_object(
    'timestamp', NOW(),
    'user_id', user_uuid,
    'produtos', (SELECT jsonb_agg(to_jsonb(p)) FROM produtos p WHERE p.user_id = user_uuid),
    'vendas', (SELECT jsonb_agg(to_jsonb(v)) FROM vendas v WHERE v.user_id = user_uuid AND v.created_at >= NOW() - INTERVAL '30 days'),
    'clientes', (SELECT jsonb_agg(to_jsonb(c)) FROM clientes c WHERE c.user_id = user_uuid),
    'categorias', (SELECT jsonb_agg(to_jsonb(cat)) FROM categorias cat WHERE cat.user_id = user_uuid),
    'fornecedores', (SELECT jsonb_agg(to_jsonb(f)) FROM fornecedores f WHERE f.user_id = user_uuid)
  ) INTO backup_data;
  
  -- Inserir backup
  INSERT INTO backups (user_id, backup_data, tipo, tamanho_bytes)
  VALUES (
    user_uuid, 
    backup_data, 
    'automatico',
    length(backup_data::text)
  )
  RETURNING id INTO backup_id;
  
  RETURN backup_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para limpar dados antigos
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
  -- Remover backups antigos (mais de 90 dias)
  DELETE FROM backups 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Remover logs de auditoria antigos (mais de 1 ano)
  DELETE FROM audit_logs 
  WHERE created_at < NOW() - INTERVAL '1 year';
  
  -- Arquivar vendas muito antigas (mais de 2 anos) - apenas marcar como arquivadas
  -- UPDATE vendas SET status = 'arquivada' WHERE created_at < NOW() - INTERVAL '2 years';
END;
$$ LANGUAGE plpgsql;
