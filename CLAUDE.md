# HorseHub — Frontend

## Descrição

HorseHub é uma aplicação de gestão privada de portefólios de cavalos. Este
repositório é o frontend: uma SPA em **React (Create React App)** empacotada
com **Capacitor** para correr como app nativa em **iOS e Android**, além da
versão web.

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
  pages/        Ecrãs — um componente por rota (DashboardPage, MyHorses,
                ProfileHorse, SharedHorse, WelcomePage, ReceivedHorses, ...)
  components/   Componentes reutilizáveis usados pelas pages (Layout,
                ProtectedRoute, ShareHorse, Deleteshares, ScreenshotAlerts,
                ScreenshotApprovals, uploaders, popups, etc.)
  hooks/        Hooks partilhados (useLogin, useRegister,
                useScreenshotProtection, usePushNotifications)
  utils/        Utilitários pequenos (ex.: isNative.js)
```

- O **routing é centralizado em `src/components/Content.jsx`** — todas as
  rotas da app (públicas e protegidas) vivem nesse ficheiro, dentro de um
  único `<Routes>`. Não criar routers secundários noutros pontos da app.
- Rotas protegidas passam pelo componente `ProtectedRoute`, que valida o
  `authToken` (JWT) guardado em `localStorage`.
- `src/App.js` é o ponto de entrada: monta o `Router`, o interceptor global
  de `fetch` (logout automático em 401) e o `DeepLinkHandler` (Universal
  Links do Capacitor).
- Cada `page`/`component` tende a ter o seu próprio `.css` junto ao `.jsx`
  (ex.: `MyHorses.jsx` + `MyHorses.css`).
- Chamadas à API usam `fetch` direto (sem camada de abstração) contra
  `process.env.REACT_APP_API_SERVER_URL`, com o `authToken` do
  `localStorage` no header `Authorization: Bearer`.

## Notas importantes

- **O Stripe está desativado em iOS nativo.** Em `src/App.js`,
  `stripePromise` só é criado quando `isNativeiOS()` é `false` — é uma
  exigência de compliance da App Store (não pode haver pagamentos externos
  à Apple dentro da app nativa). Qualquer alteração ao fluxo de pagamentos
  tem de respeitar esta condição.
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
