
-- =====================================================
-- VIEWS PARA RELATÓRIOS E DASHBOARDS
-- =====================================================

-- View para dashboard principal
CREATE OR REPLACE VIEW dashboard_stats AS
SELECT 
  v.user_id,
  DATE(v.created_at) as data,
  COUNT(*) as total_vendas,
  SUM(v.total) as receita_total,
  AVG(v.total) as ticket_medio,
  SUM(vi.quantidade) as produtos_vendidos,
  COUNT(DISTINCT v.cliente_id) as clientes_unicos
FROM vendas v
JOIN venda_itens vi ON vi.venda_id = v.id
WHERE v.status = 'finalizada'
  AND v.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY v.user_id, DATE(v.created_at);

-- View para produtos mais vendidos
CREATE OR REPLACE VIEW produtos_mais_vendidos AS
SELECT 
  p.user_id,
  p.id as produto_id,
  p.nome,
  p.preco_venda,
  SUM(vi.quantidade) as total_vendido,
  SUM(vi.subtotal) as receita_total,
  COUNT(DISTINCT vi.venda_id) as numero_vendas,
  AVG(vi.quantidade) as media_por_venda
FROM produtos p
JOIN venda_itens vi ON vi.produto_id = p.id
JOIN vendas v ON v.id = vi.venda_id
WHERE v.status = 'finalizada'
  AND v.created_at >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY p.user_id, p.id, p.nome, p.preco_venda
ORDER BY total_vendido DESC;

-- View para estoque baixo
CREATE OR REPLACE VIEW estoque_baixo AS
SELECT 
  user_id,
  id as produto_id,
  nome,
  estoque_atual,
  estoque_minimo,
  (estoque_atual::float / NULLIF(estoque_minimo, 0)) as percentual_estoque,
  CASE 
    WHEN estoque_atual = 0 THEN 'sem_estoque'
    WHEN estoque_atual <= estoque_minimo * 0.5 THEN 'critico'
    WHEN estoque_atual <= estoque_minimo THEN 'baixo'
    ELSE 'ok'
  END as status_estoque
FROM produtos
WHERE ativo = true
  AND estoque_atual <= estoque_minimo;

-- View para vendas por período
CREATE OR REPLACE VIEW vendas_por_periodo AS
SELECT 
  user_id,
  DATE_TRUNC('hour', created_at) as periodo,
  EXTRACT(hour FROM created_at) as hora,
  EXTRACT(dow FROM created_at) as dia_semana,
  COUNT(*) as total_vendas,
  SUM(total) as receita,
  AVG(total) as ticket_medio
FROM vendas
WHERE status = 'finalizada'
  AND created_at >= CURRENT_DATE - INTERVAL '90 days'
GROUP BY user_id, DATE_TRUNC('hour', created_at), EXTRACT(hour FROM created_at), EXTRACT(dow FROM created_at);

-- View para contas em aberto
CREATE OR REPLACE VIEW contas_em_aberto AS
SELECT 
  'receber' as tipo,
  user_id,
  id,
  valor_pendente as valor,
  data_vencimento,
  CASE 
    WHEN data_vencimento < CURRENT_DATE THEN 'vencido'
    WHEN data_vencimento = CURRENT_DATE THEN 'vence_hoje'
    WHEN data_vencimento <= CURRENT_DATE + INTERVAL '7 days' THEN 'vence_semana'
    ELSE 'futuro'
  END as situacao
FROM contas_receber
WHERE status IN ('pendente', 'vencido')

UNION ALL

SELECT 
  'pagar' as tipo,
  user_id,
  id,
  valor_pendente as valor,
  data_vencimento,
  CASE 
    WHEN data_vencimento < CURRENT_DATE THEN 'vencido'
    WHEN data_vencimento = CURRENT_DATE THEN 'vence_hoje'
    WHEN data_vencimento <= CURRENT_DATE + INTERVAL '7 days' THEN 'vence_semana'
    ELSE 'futuro'
  END as situacao
FROM contas_pagar
WHERE status IN ('pendente', 'vencido');

-- View para análise de margem
CREATE OR REPLACE VIEW analise_margem AS
SELECT 
  p.user_id,
  p.id as produto_id,
  p.nome,
  p.preco_custo,
  p.preco_venda,
  p.margem_lucro,
  COALESCE(SUM(vi.quantidade), 0) as total_vendido,
  COALESCE(SUM(vi.subtotal), 0) as receita_total,
  COALESCE(SUM(vi.quantidade * p.preco_custo), 0) as custo_total,
  COALESCE(SUM(vi.subtotal) - SUM(vi.quantidade * p.preco_custo), 0) as lucro_total
FROM produtos p
LEFT JOIN venda_itens vi ON vi.produto_id = p.id
LEFT JOIN vendas v ON v.id = vi.venda_id AND v.status = 'finalizada' AND v.created_at >= CURRENT_DATE - INTERVAL '30 days'
WHERE p.ativo = true
GROUP BY p.user_id, p.id, p.nome, p.preco_custo, p.preco_venda, p.margem_lucro;
