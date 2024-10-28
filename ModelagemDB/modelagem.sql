--Modelagem
-- Tabela para armazenar as vagas disponíveis e seu status
CREATE TABLE parking_slots (
    id SERIAL PRIMARY KEY,                 -- Identificador único da vaga
    slot_number VARCHAR(10) NOT NULL,      -- Número ou código da vaga
    status VARCHAR(10) NOT NULL CHECK (status IN ('AVAILABLE', 'OCCUPIED')) DEFAULT 'AVAILABLE'  -- Status da vaga (Disponível ou Ocupada)
);

-- Tabela para registrar as entradas e saídas dos veículos
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,                 -- Identificador único da transação
    plate VARCHAR(10) NOT NULL,            -- Placa do veículo
    vehicle_type SMALLINT NOT NULL CHECK (vehicle_type IN (0, 1, 2)),  -- Tipo do veículo: 0 para Moto, 1 para Carro, 2 para Caminhão e Outros
    slot_id INT NOT NULL,                  -- Relaciona com a vaga do veículo (chave estrangeira)
    entry_time TIMESTAMP NOT NULL,         -- Hora de entrada do veículo
    exit_time TIMESTAMP,                   -- Hora de saída do veículo (NULL enquanto o veículo não sair)
    fee DECIMAL(10, 2),                    -- Valor cobrado, calculado na saída
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id) -- Chave estrangeira para a vaga
);

-- Tabela para definir as configurações de tarifas, caso queira parametrizar os valores
CREATE TABLE fee_configuration (
    id SERIAL PRIMARY KEY,                 -- Identificador único da configuração
    base_rate DECIMAL(10, 2) NOT NULL,     -- Valor padrão para a primeira hora
    additional_rate DECIMAL(10, 2) NOT NULL -- Valor adicional por hora extra
);

-- Insere valores padrão na tabela de configuração de tarifas
INSERT INTO fee_configuration (base_rate, additional_rate) VALUES (15.00, 10.00);

--Consultas

Consulta de Vagas Disponíveis por Categoria:

SELECT v.codigo, cv.nome AS categoria
FROM Vaga v
JOIN Categoria_Veiculo cv ON v.categoria_id = cv.id
WHERE v.disponivel = true;

Cadastro de Entrada de Veículo e Alocação de Vaga: Antes de registrar a entrada, verificar as vagas disponíveis para a categoria do veículo:

SELECT id FROM Vaga 
WHERE categoria_id = ? AND disponivel = true 
LIMIT 1;

Após identificar a vaga, insira a movimentação e atualize o status da vaga:

INSERT INTO Movimentacao (placa, categoria_id, hora_entrada, vaga_id)
VALUES (?, ?, ?, ?);

UPDATE Vaga SET disponivel = false WHERE id = ?;

Registro de Saída e Liberação de Vaga: No momento da saída, calcule o valor_pago e libere a vaga:

UPDATE Movimentacao
SET hora_saida = ?, valor_pago = ?
WHERE id = ?;

UPDATE Vaga SET disponivel = true WHERE id = ?;
