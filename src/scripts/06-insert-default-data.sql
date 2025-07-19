
-- =====================================================
-- DADOS PADRÃO PARA PRODUÇÃO
-- =====================================================

-- Inserir categorias padrão (serão criadas para cada usuário via trigger)
-- Estas são apenas referências, cada usuário terá suas próprias categorias

-- Função para criar dados padrão para novo usuário
CREATE OR REPLACE FUNCTION create_default_data_for_user(user_uuid UUID)
RETURNS void AS $$
BEGIN
  -- Inserir categorias padrão
  INSERT INTO categorias (user_id, nome, descricao, cor) VALUES
  (user_uuid, 'Panificação', 'Pães, bolos e produtos de panificação', '#F59E0B'),
  (user_uuid, 'Bebidas', 'Refrigerantes, sucos, água e bebidas em geral', '#3B82F6'),
  (user_uuid, 'Doces', 'Doces, chocolates e sobremesas', '#EC4899'),
  (user_uuid, 'Ingredientes', 'Matérias-primas e ingredientes', '#10B981'),
  (user_uuid, 'Laticínios', 'Leite, queijos e derivados', '#8B5CF6'),
  (user_uuid, 'Carnes', 'Carnes bovinas, suínas, aves e peixes', '#EF4444'),
  (user_uuid, 'Higiene', 'Produtos de limpeza e higiene', '#06B6D4'),
  (user_uuid, 'Diversos', 'Outros produtos', '#6B7280');
  
  -- Inserir fornecedores padrão
  INSERT INTO fornecedores (user_id, nome, contato, telefone) VALUES
  (user_uuid, 'Distribuidora Local', 'João Silva', '(69) 3333-1111'),
  (user_uuid, 'Atacadão RO', 'Maria Santos', '(69) 3333-2222'),
  (user_uuid, 'Fornecedor Regional', 'Pedro Costa', '(69) 3333-3333');
  
  -- Inserir configurações específicas do usuário (se não existir)
  INSERT INTO configuracoes (user_id)
  SELECT user_uuid
  WHERE NOT EXISTS (SELECT 1 FROM configuracoes WHERE user_id = user_uuid);
  
END;
$$ LANGUAGE plpgsql;

-- Atualizar a função handle_new_user para incluir dados padrão
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
  
  -- Criar dados padrão
  PERFORM create_default_data_for_user(new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
