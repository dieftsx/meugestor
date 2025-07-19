
-- =====================================================
-- OTIMIZAÇÕES FINAIS PARA PRODUÇÃO
-- =====================================================

-- Configurações de performance para PostgreSQL
-- Nota: Estas configurações devem ser aplicadas no postgresql.conf

/*
# Configurações recomendadas para produção:

# Memory
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Checkpoints
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100

# Logging
log_min_duration_statement = 1000
log_checkpoints = on
log_connections = on
log_disconnections = on
log_lock_waits = on

# Autovacuum
autovacuum = on
autovacuum_max_workers = 3
autovacuum_naptime = 1min
*/

-- Analisar todas as tabelas para otimizar o planner
ANALYZE;

-- Criar estatísticas estendidas para queries complexas
CREATE STATISTICS IF NOT EXISTS vendas_stats ON user_id, created_at, status FROM vendas;
CREATE STATISTICS IF NOT EXISTS produtos_stats ON user_id, categoria_id, ativo FROM produtos;

-- Vacuum completo para otimizar espaço
-- VACUUM FULL; -- Executar apenas durante manutenção

-- Verificar integridade das constraints
-- SELECT conname, conrelid::regclass FROM pg_constraint WHERE NOT convalidated;

-- Log de conclusão
DO $$
BEGIN
  RAISE NOTICE 'Database setup completed successfully at %', NOW();
  RAISE NOTICE 'Total tables created: %', (SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public');
  RAISE NOTICE 'Total indexes created: %', (SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public');
  RAISE NOTICE 'Total functions created: %', (SELECT COUNT(*) FROM information_schema.routines WHERE routine_schema = 'public');
END $$;
