# HorseHub — Frontend

## Descrição

HorseHub é uma aplicação de gestão privada de portefólios de cavalos. Este
repositório é o frontend: uma SPA em **React 18 com Vite** empacotada com
**Capacitor** para correr como app nativa em **iOS e Android**, além da
versão web (que também pode ser instalada como PWA). A app é **gratuita**:
não há planos pagos nem pagamentos.

Comandos: `npm start` (Vite em http://localhost:3001), `npm test` (Vitest),
`npm run build` (gera `build/`, que é o que o Capacitor copia para as apps).

Funcionalidades centrais:
- Gestão do portefólio de cavalos do utilizador (criar, editar, árvore
  genealógica, media).
- **Partilha de cavalos por link de uso único** — um dono gera um link, que
  pode ser consumido uma vez por outro utilizador (autenticado ou não) para
  ganhar acesso de leitura ao cavalo.
- **Proteção contra screenshots** — deteção nativa de capturas de ecrã em
  cavalos partilhados, com revogação/aprovação de acesso pelo dono.

## Estrutura de pastas

```
src/
  pages/          Ecrãs — um componente por rota (DashboardPage, MyHorses,
                  ProfileHorse, SharedHorse, WelcomePage, ReceivedHorses, ...)
  components/     Componentes reutilizáveis usados pelas pages: molduras
                  (AppShell, AuthLayout, PublicPage), HorseForm, ShareHorse,
                  PedigreeTree, ScreenshotAlerts, ProtectedRoute, etc.
  components/ui/  Componentes base do shadcn/ui (button, dialog, input, tabs,
                  native-select, ...), em JS e com forwardRef (React 18)
  hooks/          Hooks partilhados (useLogin, useRegister,
                  useScreenshotProtection, usePushNotifications)
  lib/utils.js    cn() para juntar classes Tailwind
  ui.css          Tema do design (cores, fontes, raio) e reset do Tailwind
```

- O **routing é centralizado em `src/components/Content.jsx`** — todas as
  rotas da app (públicas e protegidas) vivem nesse ficheiro, dentro de um
  único `<Routes>`. Não criar routers secundários noutros pontos da app.
- Rotas protegidas passam pelo componente `ProtectedRoute`, que valida o
  `authToken` (JWT) guardado em `localStorage`.
- `src/App.jsx` é o ponto de entrada: monta o `Router`, o interceptor global
  de `fetch` (logout automático em 401) e o `DeepLinkHandler` (Universal
  Links do Capacitor).
- **Estilos: Tailwind 4 + shadcn/ui**, sem ficheiros `.css` por ecrã. As
  cores e fontes vêm dos tokens em `src/ui.css` (marfim, verde-oliva, couro;
  Cormorant Garamond nos títulos, Inter no texto). Usar as classes do tema
  (`bg-background`, `text-primary`, `font-serif`, ...) em vez de cores soltas.
- Os ecrãs usam uma de três molduras: `AppShell` (dentro da app: cabeçalho e,
  no telemóvel, barra de separadores em baixo), `AuthLayout` (login, registo,
  password, boas-vindas do link partilhado) ou `PublicPage` (suporte,
  política de privacidade). Todas aplicam a classe `hh-ui`, onde vive o reset.
- O preflight global do Tailwind está desligado: o reset só se aplica dentro de
  `.hh-ui`. O CSS que ainda existe fora disso (`index.css`, `InstallPrompt.css`)
  fica numa camada `legacy` (plugin no `vite.config.mjs`), abaixo do Tailwind.
- As variáveis de ambiente mantêm os nomes `REACT_APP_*` (definidas no
  `vite.config.mjs`).
- Chamadas à API usam `fetch` direto (sem camada de abstração) contra
  `process.env.REACT_APP_API_SERVER_URL`, com o `authToken` do
  `localStorage` no header `Authorization: Bearer`.

## Notas importantes

- **Não há pagamentos.** O Stripe e os planos pagos foram retirados do
  frontend. Se voltarem a existir, na app iOS nativa não pode haver
  pagamentos externos à Apple (regra da App Store). O backend ainda tem
  código do Stripe e limites de cavalos/partilhas por conta.
- O fluxo de partilha por link de uso único atravessa vários ficheiros:
  `ShareHorse.jsx` (gerar/enviar), `SharedHorse.jsx` (consumir o token),
  `WelcomePage.jsx` (landing pré-login/registo) e `ReceivedHorses.jsx`
  (destino final). Alterações a este fluxo têm impacto em cadeia — validar
  os vários pontos antes de mudar um isoladamente.
- A deteção de screenshots depende de plugins Capacitor locais
  (`capacitor-screen-guard`, `capacitor-screenshot-detector`, em
  `plugins/`) e do hook `useScreenshotProtection`; não tem equivalente puro
  em browser.
- **O backend do HorseHub vive num repositório separado.** Este frontend
  comunica com ele apenas por HTTP, contra `REACT_APP_API_SERVER_URL`. Não
  implementar lógica de servidor aqui — se uma tarefa exigir mudanças no
  backend, avisar em vez de simular esse comportamento no frontend.

## Regras de trabalho

- **Uma preocupação por pedido.** Resolver apenas o que foi pedido em cada
  interação, sem agrupar várias mudanças não relacionadas na mesma resposta.
- **Nunca mexer em código fora do âmbito sem avisar.** Se for necessário
  tocar em algo adicional para completar o pedido, avisar antes de o fazer
  e esperar confirmação.
- **Trabalhar sempre numa branch nova** para cada tarefa e **mostrar o
  diff antes de ser aceite** — não fazer commit/merge sem validação prévia.
- **Usar português europeu** em comentários de código e em mensagens
  dirigidas ao utilizador.
