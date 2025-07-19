
-- =====================================================
-- PERMISSÕES E SEGURANÇA FINAL
-- =====================================================

-- Garantir que authenticated users podem acessar as tabelas
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Permitir que authenticated users executem as funções necessárias
GRANT EXECUTE ON FUNCTION update_updated_at_column() TO authenticated;
GRANT EXECUTE ON FUNCTION create_automatic_backup(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION create_default_data_for_user(UUID) TO authenticated;

-- Funções administrativas apenas para service_role
GRANT EXECUTE ON FUNCTION get_system_stats() TO service_role;
GRANT EXECUTE ON FUNCTION process_expired_subscriptions() TO service_role;
GRANT EXECUTE ON FUNCTION create_system_backup() TO service_role;
GRANT EXECUTE ON FUNCTION get_performance_metrics() TO service_role;
GRANT EXECUTE ON FUNCTION setup_maintenance_jobs() TO service_role;

-- Revogar permissões desnecessárias
REVOKE ALL ON audit_logs FROM authenticated;
GRANT SELECT ON audit_logs TO authenticated;

-- Garantir que apenas o próprio usuário pode ver seus dados
-- (já implementado via RLS, mas reforçando)
