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
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    // Para funcionar de verdade, troque este trecho por uma chamada a um
    // serviço como Formspree, Google Forms, ou uma automação de WhatsApp.
    document.getElementById('avisoIntencao').style.display = 'block';
    form.reset();
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

async function carregarSantoDoDia(){
  const dados = await buscarJSON('data/santo-do-dia.json');
  if(!dados) return;
  const moldura = document.getElementById('molduraSanto');
  moldura.innerHTML = `
    <img src="${dados.imagem}" alt="${dados.nome}"
         onerror="this.remove();">
  `;
  document.getElementById('resumoSanto').textContent = dados.resumo;
}
