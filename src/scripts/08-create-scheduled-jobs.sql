
-- =====================================================
-- JOBS AGENDADOS PARA MANUTENÇÃO AUTOMÁTICA
-- =====================================================

-- Nota: Estes comandos devem ser executados como superuser
-- ou configurados via pg_cron extension se disponível

-- Job para atualizar contas vencidas (diário às 6h)
-- SELECT cron.schedule('update-overdue-accounts', '0 6 * * *', 'SELECT update_contas_vencidas();');

-- Job para processar assinaturas vencidas (diário às 7h)
-- SELECT cron.schedule('process-expired-subs', '0 7 * * *', 'SELECT process_expired_subscriptions();');

-- Job para limpeza de dados antigos (semanal, domingo às 2h)
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * 0', 'SELECT cleanup_old_data();');

-- Job para backup do sistema (diário às 3h)
-- SELECT cron.schedule('system-backup', '0 3 * * *', 'SELECT create_system_backup();');

-- Função para configurar jobs manualmente (caso pg_cron não esteja disponível)
CREATE OR REPLACE FUNCTION setup_maintenance_jobs()
RETURNS TEXT AS $$
BEGIN
  -- Esta função pode ser chamada periodicamente por um serviço externo
  -- ou configurada via cron do sistema operacional
  
  PERFORM update_contas_vencidas();
  PERFORM process_expired_subscriptions();
  
  -- Executar limpeza apenas uma vez por semana
  IF EXTRACT(dow FROM NOW()) = 0 THEN -- Domingo
    PERFORM cleanup_old_data();
  END IF;
  
  RETURN 'Maintenance jobs executed successfully at ' || NOW()::TEXT;
END;
$$ LANGUAGE plpgsql;
