/* ============================================================
   PARÓQUIA NOSSA SENHORA APARECIDA — SCRIPT PRINCIPAL
   Este arquivo:
   1) Busca os dados em /data/*.json e monta as seções da página
   2) Controla o menu mobile, o acordeão de sacramentos e o mural
   ============================================================
   IMPORTANTE: o "fetch" de arquivos .json só funciona quando a
   página é aberta através de um servidor local (ex.: a extensão
   "Live Server" do VS Code), não abrindo o index.html direto no
   navegador (file://). Veja o README.md para o passo a passo.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  configurarMural();
  carregarHorarios();
  carregarAvisos();
  carregarPastorais();
  carregarGaleria(); 
  carregarSantoDoDia();
  carregarLiturgiaDiaria();
});

/* ---------- ACORDEÃO DE SACRAMENTOS ---------- */
function alternarAcordeao(botao){
  const item = botao.parentElement;
  const jaAberto = item.classList.contains('aberto');
  item.parentElement.querySelectorAll('.item-acordeao').forEach(el => el.classList.remove('aberto'));
  if(!jaAberto) item.classList.add('aberto');
}
window.alternarAcordeao = alternarAcordeao; // usado no atributo onclick do HTML

/* ---------- MURAL DE INTENÇÕES ---------- */
function configurarMural(){
  const form = document.getElementById('formMural');
  if(!form) return;

  form.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const nome = form.querySelector('input[type="text"]').value;
    const intencao = form.querySelector('textarea').value;

    try {
      await fetch('https://script.google.com/macros/s/AKfycby7LaQP04gTmw0_9TuMp9YJcIumaPkusLObKlJGvV9LmHzv2Oi19s5GIERwvqZzWJKm/exec', {
        method: 'POST',
        mode: 'no-cors', // necessário para Apps Script; a resposta não pode ser lida, mas o envio funciona
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ nome, intencao })
      });

      document.getElementById('avisoIntencao').style.display = 'block';
      form.reset();
    } catch (erro) {
      console.warn('Não foi possível enviar a intenção agora.', erro);
      alert('Não foi possível enviar agora. Tente novamente em instantes.');
    }
  });
}

/* ---------- FUNÇÕES DE CARREGAMENTO DE DADOS ---------- */

async function buscarJSON(caminho){
  try{
    const resposta = await fetch(caminho);
    if(!resposta.ok) throw new Error('Falha ao buscar ' + caminho);
    return await resposta.json();
  }catch(erro){
    console.warn('Não foi possível carregar', caminho, '— confira se está usando um servidor local (Live Server).', erro);
    return null;
  }
}

async function carregarHorarios(){
  const dados = await buscarJSON('data/horarios.json');
  if(!dados) return;
  document.getElementById('listaMissas').innerHTML = dados.missas.map(l => `<strong>${l}</strong>`).join('');
  document.getElementById('listaConfissoes').innerHTML = dados.confissoes.map(l => `<strong>${l}</strong>`).join('');
  document.getElementById('listaSecretaria').innerHTML = dados.secretaria.map(l => `<strong>${l}</strong>`).join('');
  document.getElementById('enderecoLinha1').textContent = dados.endereco.linha1;
  document.getElementById('linkMapa').href = dados.endereco.link_mapa;
}

async function carregarAvisos(){
  const dados = await buscarJSON('data/avisos.json');
  const alvo = document.getElementById('gradeAvisos');
  if(!dados || !alvo) return;
  alvo.innerHTML = dados.map(a => `
    <div class="cartao-aviso tipo-${a.tipo}">
      <div class="data">${a.data}</div>
      <h3>${a.titulo}</h3>
      <p>${a.texto}</p>
    </div>
  `).join('');
}

async function carregarPastorais(){
  const dados = await buscarJSON('data/pastorais.json');
  const alvo = document.getElementById('gradePastorais');
  if(!dados || !alvo) return;
  alvo.innerHTML = dados.map(p => `
    <div class="cartao-pastoral">
      <div>
        <h3>${p.nome}</h3>
        <p>${p.horario} — Coord. ${p.coordenador} ${p.telefone}</p>
      </div>
      <a href="#" class="botao botao-contorno botao-pequeno">Saiba como participar</a>
    </div>
  `).join('');
}

async function carregarGaleria(){
  const dados = await buscarJSON('data/galeria.json');
  const alvo = document.getElementById('gradeGaleria');
  if(!dados || !alvo) return;
  alvo.innerHTML = dados.map(f => `
    <div class="foto-galeria">
      <img src="${f.arquivo}" alt="${f.legenda}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
      <span style="display:none;">[${f.legenda}]</span>
    </div>
  `).join('');
}

async function carregarSantoDoDia() {
  try {
    // Endpoint direto para o dia de hoje
    const resposta = await fetch('https://liturgia.up.railway.app/');
    if (!resposta.ok) throw new Error('Falha ao buscar a liturgia do dia');
    
    const dados = await resposta.json();
    
    // A estrutura desta API devolve o campo "santo"
    const santoNome = dados.santo || 'Santo do Dia';
    const textoLimpo = (dados.liturgia || 'Sem informações adicionais').replace(/\s+/g, ' ').trim();

    const resumo = textoLimpo.length > 260
      ? textoLimpo.slice(0, 260).replace(/\s+\S*$/, '') + '…'
      : textoLimpo;

    document.getElementById('nomeSanto').textContent = santoNome;
    document.getElementById('resumoSanto').textContent = resumo;
    document.getElementById('textoCompletoSanto').textContent = textoLimpo;
    document.getElementById('detalhesSanto').hidden = false;

  } catch (erro) {
    console.warn('Não foi possível carregar o santo do dia automaticamente.', erro);
    document.getElementById('resumoSanto').textContent = 'Não foi possível carregar agora. Tente novamente mais tarde.';
  }
}
/* ---------- LITURGIA DIÁRIA (busca automática, todo dia) ---------- */
async function carregarLiturgiaDiaria(){
  const cores = {
    'Verde': 'var(--cor-verde)',
    'Vermelho': 'var(--cor-vinho)',
    'Roxo': '#5B3A73',
    'Rosa': '#C97B94',
    'Branco': '#FBF7EE'
  };

  try{
    const resposta = await fetch('https://liturgia.up.railway.app/v2/');
    if(!resposta.ok) throw new Error('Falha ao buscar a liturgia do dia');
    const dados = await resposta.json();

    document.getElementById('nomeLiturgia').textContent = dados.liturgia;
    document.getElementById('dataLiturgia').textContent = `${dados.data} · Cor litúrgica: ${dados.cor}`;
    document.getElementById('corLiturgica').style.background = cores[dados.cor] || 'var(--cor-fundo-alt)';

    const secoes = [
      { chave: 'primeiraLeitura', rotulo: 'Primeira Leitura' },
      { chave: 'salmo',           rotulo: 'Salmo Responsorial' },
      { chave: 'segundaLeitura',  rotulo: 'Segunda Leitura' },
      { chave: 'evangelho',       rotulo: 'Evangelho' }
    ];

    let html = '';
    let ehAPrimeira = true;
    secoes.forEach((secao) => {
      const leituras = dados.leituras[secao.chave] || [];
      leituras.forEach((leitura) => {
        const textoExtra = leitura.refrao ? `<p><em>${leitura.refrao}</em></p>` : '';
        html += `
          <div class="item-acordeao${ehAPrimeira ? ' aberto' : ''}">
            <button class="pergunta" onclick="alternarAcordeao(this)">
              ${secao.rotulo} — ${leitura.referencia} <span class="sinal">+</span>
            </button>
            <div class="resposta">
              ${textoExtra}
              <p>${leitura.texto}</p>
            </div>
          </div>
        `;
        ehAPrimeira = false;
      });
    });

    document.getElementById('acordeaoLeituras').innerHTML = html;

  }catch(erro){
    console.warn('Não foi possível carregar a liturgia diária automaticamente.', erro);
    document.getElementById('nomeLiturgia').textContent = 'Não foi possível carregar a liturgia de hoje agora';
    document.getElementById('dataLiturgia').textContent = 'Tente novamente mais tarde, ou acesse pelo link da fonte abaixo.';
  }
}