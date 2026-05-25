const metaMensalInput = document.getElementById('metaMensal');

const vendidosInputs = document.querySelectorAll('.vendido');

const resultado = document.getElementById('resultado');

let metasSemanais = [0,0,0,0];


// FORMATAR MOEDA
function formatar(valor) {

  return valor.toLocaleString('pt-BR', {

    style: 'currency',

    currency: 'BRL'
  });
}


// SALVAR DADOS
function salvarDados() {

  const dados = {

    metaMensal: metaMensalInput.value,

    vendidos: []
  };

  vendidosInputs.forEach(input => {
    dados.vendidos.push(input.value);
  });

  localStorage.setItem(
    'monitoramentoMeta',
    JSON.stringify(dados)
  );
}


// CARREGAR DADOS
function carregarDados() {

  const dados = JSON.parse(
    localStorage.getItem('monitoramentoMeta')
  );

  if (!dados) return;

  metaMensalInput.value = dados.metaMensal;

  vendidosInputs.forEach((input, index) => {
    input.value = dados.vendidos[index];
  });

  calcularMetas();
}


// CALCULAR METAS
function calcularMetas() {

  const metaMensal = Number(metaMensalInput.value);


// SE NÃO HOUVER META
if (!metaMensal) {

  resultado.innerHTML = `
    Aguardando informações...
  `;

  // ZERA METAS
  metasSemanais = [0,0,0,0];

  metasSemanais.forEach((meta, index) => {

    document.getElementById(
      `meta${index + 1}`
    ).innerText = formatar(meta);
  });


  // LIMPA INPUTS DE VENDIDO
  vendidosInputs.forEach(input => {
    input.value = '';
  });


  // LIMPA LOCALSTORAGE
  localStorage.removeItem('monitoramentoMeta');

  return;
}

  let totalVendido = 0;

  let semanasRestantes = [];

  let todosPreenchidos = true;

  vendidosInputs.forEach((input, index) => {

  // VERIFICA SE O CAMPO ESTÁ VAZIO
  if (input.value === '') {
    todosPreenchidos = false;
  }

  const valor = Number(input.value) || 0;

  totalVendido += valor;

  if (valor === 0) {
    semanasRestantes.push(index);
  }
});

  const restante = metaMensal - totalVendido;

  const novaMeta = semanasRestantes.length > 0
    ? restante / semanasRestantes.length
    : 0;


  metasSemanais = [];

  vendidosInputs.forEach((input, index) => {

    const valor = Number(input.value) || 0;

    if (valor > 0) {

      metasSemanais[index] = valor;

    } else {

      metasSemanais[index] = novaMeta;
    }
  });


  if (todosPreenchidos) {

  atualizarTabela(restante);

} else {

  resultado.innerHTML = `
    Aguardando informações...
  `;

  atualizarTabelaParcial();
}
  function atualizarTabelaParcial() {

  metasSemanais.forEach((meta, index) => {

    document.getElementById(
      `meta${index + 1}`
    ).innerText = formatar(meta);
  });
}

  salvarDados();
}


// ATUALIZAR TABELA
function atualizarTabela(restante) {

  metasSemanais.forEach((meta, index) => {

    document.getElementById(
      `meta${index + 1}`
    ).innerText = formatar(meta);
  });


  // META NÃO ALCANÇADA
  if (restante > 0) {

    resultado.innerHTML = `
      Meta não alcançada faltando
      <strong>-${formatar(restante)}</strong>.
    `;

  }

  // META ULTRAPASSADA
  else if (restante < 0) {

    resultado.innerHTML = `
      Meta atingida com sobra de
      <strong>+${formatar(Math.abs(restante))}</strong>.
    `;

  }

  // META EXATA
  else {

    resultado.innerHTML = `
      <strong>Meta atingida!</strong>
    `;
  }
}


// EVENTOS
metaMensalInput.addEventListener(
  'input',
  calcularMetas
);

vendidosInputs.forEach(input => {

  input.addEventListener(
    'input',
    calcularMetas
  );
});


// INICIAR
carregarDados();
