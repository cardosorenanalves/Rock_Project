# 🪨 Rock Project - Números Perfeitos

Bem-vindo ao **Rock Project**, uma aplicação web moderna desenvolvida para explorar e verificar **Números Perfeitos**. Este projeto demonstra o uso de algoritmos matemáticos eficientes, processamento em background com Web Workers e uma interface reativa construída com Next.js.

## 🧠 O que é um Número Perfeito?

Na matemática, um **número perfeito** é um número inteiro positivo que é igual à soma de seus divisores positivos próprios (excluindo ele mesmo).

Exemplo: **28**
Divisores de 28: 1, 2, 4, 7, 14.
Soma: 1 + 2 + 4 + 7 + 14 = **28**.

Este projeto utiliza a relação entre números perfeitos e **Primos de Mersenne**. Todo número perfeito par pode ser gerado pela fórmula:
$$ 2^{p-1} \times (2^p - 1) $$
Onde $p$ é um primo de Mersenne.

---

## 🚀 Funcionalidades

### 1. Verificar Número (`VerifyNumber`)
Permite que o usuário insira um número (de qualquer tamanho) e verifique instantaneamente se ele é um número perfeito.
- **Validação Exata:** Para números "pequenos" (até ~150.000 dígitos), o sistema realiza uma comparação exata utilizando `BigInt`.
- **Validação Híbrida:** Para números astronômicos, utilizamos uma heurística matemática que compara a quantidade de dígitos, o prefixo e o sufixo do número, garantindo precisão sem estourar a memória.

### 2. Encontrar Números (`FindNumber`)
Busca todos os números perfeitos dentro de um intervalo definido pelo usuário.
- **Web Workers:** A busca é executada em uma thread separada (Web Worker) para garantir que a interface do usuário nunca trave, mesmo durante cálculos pesados.
- **Suporte a BigInt:** Capaz de buscar e comparar números muito maiores que o limite padrão de inteiros do JavaScript (`2^53 - 1`).

---

## 🛠️ Tecnologias Utilizadas

- **Core:** [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Testes:** [Jest](https://jestjs.io/), [React Testing Library](https://testing-library.com/)
- **Performance:** Web Workers API para processamento paralelo

---

## 📂 Estrutura do Projeto

```
src/
├── app/                 # Rotas e layouts do Next.js (App Router)
├── components/          # Componentes React reutilizáveis
│   ├── home/            # Componentes específicos da Home (Verify/Find)
│   └── forms/           # Componentes de formulário (Button, TextArea)
├── hooks/               # Custom Hooks para lógica de estado (useVerifyNumber, etc.)
├── utils/               # Funções matemáticas auxiliares (Mersenne, Digits, Format)
├── workers/             # Web Workers para processamento em background
├── backend/             # Lógica de negócio (Use Cases e Services)
└── ...
```

---

## 🏁 Como Rodar o Projeto

### Pré-requisitos
- Node.js (v18 ou superior recomendado)
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/rock-project.git
cd rock-project
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

---

## 🧪 Testes

O projeto possui uma suíte de testes unitários robusta cobrindo utilitários matemáticos, hooks e componentes.

Para executar os testes:

```bash
npm test
```

### Cobertura de Testes
- **Utils:** Garante que cálculos de dígitos, exponenciação modular e formatação estejam corretos.
- **Hooks:** Testa a lógica de estado, carregamento e tratamento de erros dos formulários.
- **Componentes:** Verifica a renderização, interação do usuário e feedback visual (loading/erros).

---

## 📐 Detalhes Matemáticos (Under the Hood)

### Algoritmo de Verificação
O verificador não testa divisores um por um (o que seria impossível para números grandes). Em vez disso:
1. Verifica se o número candidato tem a mesma quantidade de dígitos de um número perfeito gerado por um primo de Mersenne conhecido.
2. Se a contagem de dígitos bater, ele gera o número perfeito esperado.
3. Compara o número gerado com a entrada do usuário.

### Otimizações
- **Logaritmos:** Usados para calcular o número de dígitos instantaneamente: $\lfloor (2p - 1) \times \log_{10}(2) \rfloor + 1$.
- **Aritmética Modular:** Usada para calcular sufixos de números gigantes sem gerar o número inteiro.

---

Desenvolvido por Renan Alves Cardoso
