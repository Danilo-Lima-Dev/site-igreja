# Site da Paróquia Nossa Senhora Aparecida

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
│   ├── galeria.json        → legendas e caminho das fotos da galeria
│   └── santo-do-dia.json   → nome, resumo e imagem do santo do dia
└── img/
    ├── logo/                → logotipo/brasão da paróquia
    ├── fotos-comunidade/     → fotos reais de eventos (festa, quermesse, etc.)
    ├── santos/               → imagem do santo do dia
    └── icones/               → ícones pequenos (opcional)
```

A ideia é que **quem cuida do site no dia a dia só precise editar os
arquivos dentro de `data/`** (e trocar fotos dentro de `img/`), sem
precisar mexer em HTML, CSS ou JavaScript.

## Como abrir e editar no VS Code

1. Abra o VS Code e escolha **Arquivo → Abrir Pasta...** e selecione a
   pasta `paroquia-site`.
2. Instale a extensão gratuita **"Live Server"** (ícone de extensões na
   lateral esquerda → buscar "Live Server" → Instalar).
3. Clique com o botão direito no arquivo `index.html` e escolha
   **"Open with Live Server"**. Isso abre o site no navegador em um
   endereço como `http://127.0.0.1:5500`.

⚠️ **Importante:** o site busca os arquivos dentro de `data/*.json`
automaticamente (avisos, pastorais, galeria, etc). Isso só funciona
quando o site é aberto por um servidor local, como o Live Server acima.
Se você apenas clicar duas vezes no `index.html` para abrir direto no
navegador (endereço começando com `file://`), essas seções aparecerão
vazias — é assim que o navegador funciona por segurança, e é por isso
que o Live Server é recomendado.

## Como atualizar o conteúdo toda semana

- **Avisos da semana:** edite `data/avisos.json`. Cada aviso tem
  `tipo` (`urgente`, `evento` ou `comum` — muda a cor da barrinha),
  `data`, `titulo` e `texto`.
- **Horários:** edite `data/horarios.json`.
- **Pastorais:** edite `data/pastorais.json`.
- **Fotos da galeria:** salve a foto dentro de `img/fotos-comunidade/`
  e adicione uma entrada em `data/galeria.json` com a `legenda` e o
  caminho do `arquivo`.
- **Santo do dia:** edite `data/santo-do-dia.json` e troque a imagem
  em `img/santos/`.

Todos esses arquivos são `.json` — um formato de texto simples. Tome
cuidado para manter as aspas `"..."` e vírgulas `,` exatamente como
estão nos exemplos; um erro de digitação pode fazer a seção parar de
aparecer (nesse caso, o navegador simplesmente mostra a seção vazia,
sem quebrar o resto do site).

## Sobre a responsividade (celular)

O site foi construído "mobile-first": o visual base já é pensado para
telas de celular (menu em painel deslizante, botões grandes e fáceis
de tocar, uma coluna por vez) e os ajustes para tablet e computador
ficam nos blocos `@media (min-width: 640px)` e
`@media (min-width: 900px)` dentro de `css/estilo.css`. Não é preciso
mexer nisso a não ser que queira mudar o próprio layout.

## Antes de publicar, não esqueça de:

1. Trocar todos os textos entre colchetes `[assim]` (nome do pároco,
   telefones, endereço, chave PIX).
2. Colocar fotos reais nas pastas dentro de `img/` (veja o arquivo
   `LEIA-ME.txt` de cada pasta).
3. Trocar o link do Google Maps e o número do WhatsApp (`wa.me/55...`)
   no `index.html`.
4. Ligar o Mural de Intenções (formulário) a um serviço real, como o
   [Formspree](https://formspree.io) (gratuito para poucos envios por
   mês) ou um Google Forms incorporado — hoje ele só mostra uma
   mensagem de confirmação, sem enviar de fato a intenção a ninguém.

## Como publicar o site (hospedagem gratuita)

Depois de pronto, você pode subir a pasta inteira em serviços
gratuitos como **Netlify**, **Vercel** ou **GitHub Pages** — todos
aceitam sites feitos só de HTML/CSS/JS como este, sem custo.
