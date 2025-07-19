
-- =====================================================
-- FUNÇÕES ADMINISTRATIVAS PARA PRODUÇÃO
-- =====================================================

-- Função para estatísticas gerais do sistema (apenas para admins)
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS TABLE (
  total_users BIGINT,
  active_subscriptions BIGINT,
  trial_users BIGINT,
  total_revenue DECIMAL,
  monthly_revenue DECIMAL,
  total_sales BIGINT,
  avg_sales_per_user DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    (SELECT COUNT(*) FROM profiles)::BIGINT,
    (SELECT COUNT(*) FROM profiles WHERE subscription_status = 'active')::BIGINT,
    (SELECT COUNT(*) FROM profiles WHERE subscription_status = 'trial')::BIGINT,
    (SELECT COALESCE(SUM(total), 0) FROM vendas WHERE status = 'finalizada')::DECIMAL,
    (SELECT COALESCE(SUM(total), 0) FROM vendas WHERE status = 'finalizada' AND created_at >= DATE_TRUNC('month', CURRENT_DATE))::DECIMAL,
    (SELECT COUNT(*) FROM vendas WHERE status = 'finalizada')::BIGINT,
    (SELECT COALESCE(AVG(user_sales.total_sales), 0) FROM (
      SELECT user_id, COUNT(*) as total_sales 
      FROM vendas 
      WHERE status = 'finalizada' 
      GROUP BY user_id
    ) user_sales)::DECIMAL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para processar assinaturas vencidas
CREATE OR REPLACE FUNCTION process_expired_subscriptions()
RETURNS INTEGER AS $$
DECLARE
  expired_count INTEGER := 0;
BEGIN
  -- Marcar assinaturas trial vencidas
  UPDATE profiles 
  SET subscription_status = 'canceled'
  WHERE subscription_status = 'trial' 
    AND trial_ends_at < NOW();
  
  GET DIAGNOSTICS expired_count = ROW_COUNT;
  
  -- Log da operação
  INSERT INTO audit_logs (acao, tabela, dados_novos)
  VALUES ('process_expired_subscriptions', 'profiles', jsonb_build_object('expired_count', expired_count));
  
  RETURN expired_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para backup de todos os usuários (admin)
CREATE OR REPLACE FUNCTION create_system_backup()
RETURNS UUID AS $$
DECLARE
  backup_id UUID;
  system_data JSONB;
BEGIN
  -- Coletar estatísticas do sistema
  SELECT jsonb_build_object(
    'timestamp', NOW(),
    'total_users', (SELECT COUNT(*) FROM profiles),
    'active_subscriptions', (SELECT COUNT(*) FROM profiles WHERE subscription_status = 'active'),
    'total_sales', (SELECT COUNT(*) FROM vendas WHERE status = 'finalizada'),
    'total_revenue', (SELECT COALESCE(SUM(total), 0) FROM vendas WHERE status = 'finalizada'),
    'backup_type', 'system_stats'
  ) INTO system_data;
  
  -- Inserir backup do sistema
  INSERT INTO backups (user_id, backup_data, tipo, tamanho_bytes)
  VALUES (
    '00000000-0000-0000-0000-000000000000'::UUID, -- UUID especial para backups do sistema
    system_data,
    'automatico',
    length(system_data::text)
  )
  RETURNING id INTO backup_id;
  
  RETURN backup_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para monitoramento de performance
CREATE OR REPLACE FUNCTION get_performance_metrics()
RETURNS TABLE (
  metric_name TEXT,
  metric_value DECIMAL,
  metric_unit TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    'avg_response_time'::TEXT,
    0.0::DECIMAL, -- Placeholder - seria implementado com métricas reais
    'ms'::TEXT
  UNION ALL
  SELECT 
    'active_connections'::TEXT,
    (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active')::DECIMAL,
    'connections'::TEXT
  UNION ALL
  SELECT 
    'database_size'::TEXT,
    (SELECT pg_database_size(current_database()) / 1024 / 1024)::DECIMAL,
    'MB'::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
