-- Inserir dados de demonstração para o usuário demo
-- Primeiro, vamos criar o usuário demo (isso seria feito via Supabase Auth normalmente)

-- Inserir produtos de exemplo
INSERT INTO produtos (user_id, nome, categoria, preco, estoque_atual, estoque_minimo, fornecedor) VALUES
-- Assumindo que o user_id do demo é conhecido
('demo-user-id', 'Pão Francês', 'Panificação', 2.00, 150, 50, 'Produção própria'),
('demo-user-id', 'Pão de Açúcar', 'Panificação', 2.50, 80, 30, 'Produção própria'),
('demo-user-id', 'Café com Leite', 'Bebidas', 4.00, 200, 20, 'Café Central'),
('demo-user-id', 'Sonho de Valsa', 'Doces', 3.00, 45, 20, 'Produção própria'),
('demo-user-id', 'Refrigerante Lata', 'Bebidas', 4.00, 120, 30, 'Coca-Cola RO'),
('demo-user-id', 'Água Mineral', 'Bebidas', 2.50, 200, 50, 'Água Crystal'),
('demo-user-id', 'Farinha de Trigo', 'Ingredientes', 4.50, 2, 10, 'Distribuidora ABC'),
('demo-user-id', 'Ovos', 'Ingredientes', 8.00, 3, 5, 'Granja São João'),
('demo-user-id', 'Leite Integral', 'Laticínios', 4.20, 8, 15, 'Laticínios RO'),
('demo-user-id', 'Açúcar Cristal', 'Ingredientes', 3.80, 15, 8, 'Distribuidora ABC');

-- Inserir vendas de exemplo (últimos 7 dias)
INSERT INTO vendas (user_id, total, forma_pagamento, created_at) VALUES
('demo-user-id', 18.00, 'Dinheiro', NOW() - INTERVAL '1 hour'),
('demo-user-id', 13.00, 'PIX', NOW() - INTERVAL '2 hours'),
('demo-user-id', 15.00, 'Cartão', NOW() - INTERVAL '3 hours'),
('demo-user-id', 22.00, 'Dinheiro', NOW() - INTERVAL '4 hours'),
('demo-user-id', 1247.80, 'Misto', NOW() - INTERVAL '1 day'),
('demo-user-id', 1450.00, 'Misto', NOW() - INTERVAL '2 days'),
('demo-user-id', 1100.00, 'Misto', NOW() - INTERVAL '3 days'),
('demo-user-id', 1650.00, 'Misto', NOW() - INTERVAL '4 days'),
('demo-user-id', 1380.00, 'Misto', NOW() - INTERVAL '5 days'),
('demo-user-id', 1520.00, 'Misto', NOW() - INTERVAL '6 days'),
('demo-user-id', 1750.00, 'Misto', NOW() - INTERVAL '7 days');

-- Inserir clientes de exemplo
INSERT INTO clientes (user_id, nome, telefone, endereco) VALUES
('demo-user-id', 'Maria Silva', '(69) 99999-1111', 'Rua das Flores, 123'),
('demo-user-id', 'João Santos', '(69) 99999-2222', 'Av. Brasil, 456'),
('demo-user-id', 'Ana Costa', '(69) 99999-3333', 'Rua Central, 789'),
('demo-user-id', 'Pedro Oliveira', '(69) 99999-4444', 'Rua do Comércio, 321'),
('demo-user-id', 'Lucia Ferreira', '(69) 99999-5555', 'Av. Principal, 654');

-- Inserir movimentações de estoque
INSERT INTO estoque_movimentacoes (user_id, produto_id, tipo, quantidade, motivo) VALUES
('demo-user-id', (SELECT id FROM produtos WHERE nome = 'Pão Francês' LIMIT 1), 'saida', -67, 'Venda do dia'),
('demo-user-id', (SELECT id FROM produtos WHERE nome = 'Café com Leite' LIMIT 1), 'saida', -43, 'Venda do dia'),
('demo-user-id', (SELECT id FROM produtos WHERE nome = 'Sonho de Valsa' LIMIT 1), 'saida', -28, 'Venda do dia'),
('demo-user-id', (SELECT id FROM produtos WHERE nome = 'Refrigerante Lata' LIMIT 1), 'saida', -31, 'Venda do dia'),
('demo-user-id', (SELECT id FROM produtos WHERE nome = 'Farinha de Trigo' LIMIT 1), 'entrada', 50, 'Compra para estoque'),
('demo-user-id', (SELECT id FROM produtos WHERE nome = 'Ovos' LIMIT 1), 'entrada', 20, 'Compra para estoque');
