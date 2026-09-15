# Projeto Eva 55
"Cuidar de mim também faz parte."

Painel pessoal de organização de hábitos: alimentação, água, exercícios, leitura, sono, compras e progresso. **Não é um aplicativo médico** — não faz diagnóstico, prescrição clínica, cálculo de dieta terapêutica nem promessas de emagrecimento. Todos os dados ficam salvos apenas no seu dispositivo (localStorage), nada é enviado para servidores.

## Como testar agora mesmo

Não precisa instalar nada. Duas opções:

**Opção A — abrir direto:**
Dê duplo clique em `index.html`. Funciona no computador, mas para testar como PWA/instalação, use a Opção B.

**Opção B — servidor local (recomendado para testar no celular):**
```bash
cd eva55
python3 -m http.server 8000
```
Depois acesse `http://localhost:8000` no navegador do computador, ou `http://SEU-IP-LOCAL:8000` no celular (mesmo Wi-Fi).

## Como publicar gratuitamente (para usar no celular todos os dias)

Qualquer uma destas opções funciona bem, é gratuita e não exige backend:

- **Netlify Drop** — acesse app.netlify.com/drop e arraste a pasta `eva55` inteira. Gera um link em segundos.
- **Vercel** — crie um projeto novo e faça upload da pasta (ou conecte um repositório Git).
- **GitHub Pages** — suba os arquivos para um repositório e ative Pages nas configurações.
- **Cloudflare Pages** — arraste a pasta, similar ao Netlify.

Depois de publicado:
1. Abra o link no Safari (iPhone) ou Chrome (Android).
2. Toque em **Compartilhar** → **Adicionar à Tela de Início**.
3. O app abre em tela cheia, como um aplicativo instalado.

## Estrutura dos arquivos

```
eva55/
├── index.html      → estrutura da página
├── styles.css       → todo o visual (paleta, tipografia, componentes)
├── app.js           → toda a lógica: estado, telas, persistência
├── manifest.json    → configuração do PWA (nome, ícone, cor)
├── sw.js            → service worker (funcionamento offline)
├── icons/           → ícones do app (192px e 512px)
└── README.md
```

## O que já funciona nesta primeira versão

- Tela **Hoje**: saudação, frase do dia, progresso do dia (tarefas concluídas), card "agora/próximo", checklist completo por horário, tudo persistido por data.
- **Água**: registro rápido (+250ml/+500ml), visual de progresso, meta configurável.
- **Check-in da noite**: alimentação, água, movimento, doces, sono, humor e um campo livre — sem linguagem de culpa.
- **Cardápio**: semana completa editável, com opção de "trocar refeição" reaproveitando opções já cadastradas.
- **Compras**: lista por categoria com checkboxes, contagem de itens, adição de novos itens, e checklist de preparo de sábado.
- **Progresso**: peso inicial/objetivo/último registro, gráfico de evolução, painel de constância (água, movimento, leitura, sono, alimentação) e conquistas simples.
- **Histórico**: consulta de qualquer dia anterior pelo calendário.
- **Mais**: editar horários da rotina, programação de exercícios por dia da semana, meta de água, número de pessoas para compras, exportar/importar backup em JSON, apagar dados.
- Tudo funciona offline depois do primeiro carregamento (service worker) e pode ser adicionado à tela inicial do iPhone.

## Simplificações desta primeira versão (fáceis de evoluir depois)

- A lista de compras é editável manualmente; ela ainda não é *gerada automaticamente* a partir do cardápio da semana — isso pode ser uma próxima etapa.
- A quantidade por pessoa (1–5) é salva como preferência, mas as quantidades dos itens não são multiplicadas automaticamente ainda.
- O gráfico de progresso é um SVG simples e leve (sem biblioteca externa), para manter o app rápido e sem dependências.
- A programação de exercícios é editada como texto livre por dia da semana, e não como uma agenda com blocos.

Qualquer um desses pontos pode ser ajustado — é só pedir.
