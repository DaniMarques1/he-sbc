# 🎓 Gerador de Histórico Escolar (SBC)

Aplicativo web completo e automatizado para emissão ágil e padronizada de Históricos Escolares. A plataforma permite desde a geração simplificada de registros individuais até o preenchimento em lote (Mala Direta) contínuo para turmas inteiras, eliminando gargalos da produção manual e prevenindo graves desvios ortográficos corporativos e operacionais.

---

## 🚀 Funcionalidades Principais

### 1. Geração Automática em Formato Nativo da Microsoft (.docx)
* **Docxtemplater Engine:** A tecnologia embarcada usa uma camada engenhosa de mapeamento XML que processa *templates base* criados diretamente no Microsoft Word, preenchendo todos os dados respeitando absolutamente as réguas, estilos de tipografia (Arial/Times), e margens legais predefinidas pelo layout original.
* **Preservação de Layout Exato:** Arquivos com imagens de cabeçalhos e tabelas rigorosamente delineadas saem sem quebras estranhas. O pacote de base é interpretado integralmente e clonado no motor.

### 2. Mala Direta Ilimitada: Lotes de até 200 Alunos de uma Vez!
* Módulo dedicado para emissão rápida de grandes volumes de Históricos de uma vez só.
* **Copiar e Colar Inteligente:** A tabela interativa aceita colar blocos copiado direto da sua planilha do **Microsoft Excel** usando apenas "Ctrl+V". O Front-end decodificará as colunas de "RM, Nome Completo, Naturalidade, Nacionalidade, UF..." instantaneamente.
* **Documento Único Contínuo:** No servidor `Vercel`, as dezenas de páginas são entrelaçadas dinamicamente na raiz XML em uma espiral de apenas 1 arquivo com Quebras de Página contínuas (`<w:br w:type="page"/>`), o que resulta em um peso muito baixo do arquivo e facilita a impressão da Diretoria ou Secretaria com **apenas 1 clique de impressão**.

### 3. Programa "Educar Mais" Embutido
* Regras automatizadas para anos englobados dentro do espectro do Projeto Municipal "Educar Mais". Quando a flag é ativada em anos específicos, o motor aplica a _Resolução SE nº 21/2017 – Programa Educar Mais_.

### 4. Inteligência Avançada no Percurso Acadêmico e Transferências
* **Transferências Intra-Ano:** Tratamento de aluno que teve histórico contínuo (Prosseguimento) vs. Transferência na metade do calendário – com supressões automáticas de linhas por listras diagonais geradas diretamente na raiz das tabelas docx, ou apontamento nativo de resoluções de abandono nos campos formatados da nota.
* **Auto-Avanço dos Anos:** Identificação orgânica para preenchimento de `(2023, 2024, 2025..)` de retroação baseando-se no que for sinalizado.

### 5. Gestão de Perfis & Templates no Banco de Dados Nuvem
* **Autenticação:** Baseada em contas Supabase usando criptografia de sessão JWT.
* **Biblioteca de Templates:** O usuário logado monta um layout padrão cheio de detalhes estáticos que ele digitaria todas as vezes, clica em "Salvar Template", e o nosso sistema congela 100% dos botões redondos e campos form do momento para a nuvem. Depois ele clica num botão e a tela se reconstruirá instantaneamente como estava sem perda de dados.
* **Registro Contínuo (Logs de Auditoria Silenciosa):** O Back-End envia os lotes anonimizados da Mala Direta para uma base Relacional da Nuvem como auditoria assíncrona, de modo a nunca prejudicar o motor renderizador principal por falta de latência.

### 6. Design Moderno "Glass"
* Criado na filosofia **Neumorphism** e com **High Visual Purity** com a cor vibrante de identidade.
* Abas Expansivas autoestruturais adaptadas ao Celular e Telas de Monitores longos.

---

## 🛠️ Stack Tecnológica

O back-end do sistema funciona a frio (Serverless):

- [Next.js 14](https://nextjs.org/) na configuração `app/router` usando SSR.
- [React](https://reactjs.org/) (Formulários híbridos não controlados vs Context).
- **TailwindCSS** e pacotes do Material U UI para Estilização responsiva pesada.
- **Supabase SDK:** Usado como Plataforma de Nuvem Postgres, Auth, e Server Actions.
- **PizZip** & **Docxtemplater** na vanguarda do fluxo Serverless (API Actions). Manipula a estrutura de buffer de bytes com um Parser focado na DOM das bibliotecas MS-Office. 

---

## Instruções Básicas (Rodar Localmente)

1. Faça Clone na Máquina
2. Execute o NPM / PNPM Package Install: 
   ```bash
   pnpm install
   ```
3. Defina as Chaves de `.env` atrelando o Frontend ao Banco de Dados Relacional Supabase local da Rede para Autenticação. 
   `NEXT_PUBLIC_SUPABASE_URL=` e `NEXT_PUBLIC_SUPABASE_ANON_KEY=`
4. Inicie o Servidor de Desenvolvimento: 
   ```bash
   pnpm dev
   ```
5. Você poderá emitir documentos via http://localhost:3000

*Feito primorosamente por um Humano guiado por uma IA.*
