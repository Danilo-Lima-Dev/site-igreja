# Site da Paróquia Santa Maria de Jesus

Site simples, feito em HTML/CSS/JavaScript puro (sem instalação de nada),
organizado em pastas para ser fácil de editar no VS Code.

## Estrutura de pastas

```
paroquia-site/
├── index.html              → a página do site
├── css/
│   └── estilo.css          → todo o visual (cores, fontes, responsividade)
├── js/
│   └── principal.js        → menu, acordeão, formulário e carregamento dos dados
├── data/                   → CONTEÚDO que muda com frequência (edite aqui!)
│   ├── horarios.json       → missas, confissões, secretaria, endereço
│   ├── avisos.json         → avisos da semana / eventos
│   ├── pastorais.json      → pastorais e movimentos
│   └── galeria.json        → legendas e caminho das fotos da galeria
└── img/
    ├── logo/                → logotipo/brasão da paróquia
    ├── fotos-comunidade/     → fotos reais de eventos (festa, quermesse, etc.)
    └── icones/               → ícones pequenos (logo, redes sociais, etc.)
```

A ideia é que **quem cuida do site no dia a dia só precise editar os
arquivos dentro de `data/`** (e trocar fotos dentro de `img/`), sem
precisar mexer em HTML, CSS ou JavaScript.

> **Nota:** a seção "Liturgia Diária" (leituras do dia) e o "Santo do
> Dia" **não** vêm de arquivos locais — eles são buscados
> automaticamente todos os dias em uma API externa
> ([liturgia.up.railway.app](https://liturgia.up.railway.app/v2/)).
> Não há nada para editar manualmente nessas duas seções; elas se
> atualizam sozinhas. Se um dia essa API sair do ar, as duas seções
> mostram uma mensagem de aviso em vez de quebrar o resto do site.

## Como abrir e editar no VS Code

1. Abra o VS Code e escolha **Arquivo → Abrir Pasta...** e selecione a
   pasta `paroquia-site`.
2. Instale a extensão gratuita **"Live Server"** (ícone de extensões na
   lateral esquerda → buscar "Live Server" → Instalar).
3. Clique com o botão direito no arquivo `index.html` e escolha
   **"Open with Live Server"**. Isso abre o site no navegador em um
   endereço como `http://127.0.0.1:5500`.

⚠️ **Importante:** o site busca os arquivos dentro de `data/*.json`
automaticamente (avisos, pastorais, galeria, horários). Isso só
funciona quando o site é aberto por um servidor local, como o Live
Server acima. Se você apenas clicar duas vezes no `index.html` para
abrir direto no navegador (endereço começando com `file://`), essas
seções aparecerão vazias — é assim que o navegador funciona por
segurança, e é por isso que o Live Server é recomendado.

## Como atualizar o conteúdo toda semana

- **Avisos da semana:** edite `data/avisos.json`. Cada aviso tem
  `tipo` (`urgente`, `evento` ou `comum` — muda a cor da barrinha),
  `data`, `titulo` e `texto`.
- **Horários:** edite `data/horarios.json` (missas, confissões,
  secretaria e endereço, que aparecem na faixa de horários do
  rodapé).
- **Pastorais:** edite `data/pastorais.json`.
- **Fotos da galeria:** salve a foto dentro de `img/fotos-comunidade/`
  e adicione uma entrada em `data/galeria.json` com a `legenda` e o
  caminho do `arquivo`.

Todos esses arquivos são `.json` — um formato de texto simples. Tome
cuidado para manter as aspas `"..."` e vírgulas `,` exatamente como
estão nos exemplos; um erro de digitação pode fazer a seção parar de
aparecer (nesse caso, o navegador simplesmente mostra a seção vazia,
sem quebrar o resto do site).

## Sobre a responsividade (celular)

O site foi construído "mobile-first": o visual base já é pensado para
telas de celular (botões grandes e fáceis de tocar, uma coluna por
vez) e os ajustes para tablet e computador ficam nos blocos
`@media (min-width: 640px)` e `@media (min-width: 900px)` dentro de
`css/estilo.css`. Não é preciso mexer nisso a não ser que queira mudar
o próprio layout.

## Navegação por ícones (celular) x menu de texto (computador)

- **No celular/tablet** (tela menor que 900px), a navegação aparece
  como uma **trilha de círculos coloridos com ícones**, fixa na
  lateral direita da tela, um para cada seção do site (Início,
  Liturgia/Leituras, Avisos, Sacramentos, Pastorais, Horários e
  Contato). É a `<nav class="trilha-icones">` no `index.html`.
- **No computador** (tela a partir de 900px), essa trilha some e volta
  o menu de texto tradicional no cabeçalho.
- Os ícones são desenhados em SVG direto no `index.html` (não
  dependem de nenhuma biblioteca externa de ícones, então funcionam
  mesmo sem internet). Cada `<a>` tem um `aria-label` — é o texto que
  leitores de tela (para pessoas com deficiência visual) usam para
  anunciar o que aquele ícone representa, já que visualmente só o
  ícone aparece.
- Para adicionar uma nova seção à trilha: copie um dos blocos
  `<a href="#..." class="icone-nav cor-...">` dentro da
  `<nav class="trilha-icones">`, troque o `href`, o `aria-label`, o
  SVG do ícone e crie uma nova classe de cor (ex.: `.cor-galeria`) em
  `css/estilo.css`, junto das já existentes (`.cor-inicio`,
  `.cor-horarios`, etc).

## Mural de Intenções

O formulário do Mural de Intenções já está funcionando: ao enviar,
o `js/principal.js` manda o nome e a intenção para um Google Apps
Script cadastrado no próprio código (dentro de `configurarMural()`).
Não é preciso conectar nada a mais para ele funcionar.

Se um dia precisar trocar para outro serviço (Formspree, Google
Forms, etc.), basta substituir a URL dentro da função
`configurarMural()` em `js/principal.js`.

## Antes de publicar, não esqueça de:

1. Trocar os textos e números que ainda estão como exemplo: a chave
   PIX/CNPJ e o número da secretaria em `data/horarios.json` (o
   WhatsApp do rodapé já está preenchido).
2. Conferir se todas as fotos reais estão nas pastas dentro de
   `img/` (logo, fotos da comunidade e ícones das redes sociais).
3. Conferir o link do Google Maps embutido no rodapé e o link do
   "Ver no mapa / Waze" (ambos em `index.html` / `data/horarios.json`).
4. Trocar o QR Code de exemplo da seção de dízimo por um QR Code PIX
   real.

## Como publicar o site (hospedagem gratuita)

Depois de pronto, você pode subir a pasta inteira em serviços
gratuitos como **Netlify**, **Vercel** ou **GitHub Pages** — todos
aceitam sites feitos só de HTML/CSS/JS como este, sem custo.
