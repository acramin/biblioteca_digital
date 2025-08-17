let paginaAtual = 1;
const resultadosPorPagina = 10;
let ultimaBusca = "";

// Função de busca
async function buscarLivros(pagina = 1) {
  const query = document.getElementById("searchInput").value || ultimaBusca;
  if (!query) return;

  ultimaBusca = query; // salva para usar ao trocar de página
  paginaAtual = pagina;

  const startIndex = (paginaAtual - 1) * resultadosPorPagina;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}&maxResults=${resultadosPorPagina}&startIndex=${startIndex}`;

  const res = await fetch(url);
  const data = await res.json();

  const resultadosDiv = document.getElementById("resultados");
  resultadosDiv.innerHTML = "";

  if (data.items) {
    data.items.forEach((item) => {
      const info = item.volumeInfo;
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <img src="${info.imageLinks?.thumbnail || ""}" alt="Capa">
        <h4>${info.title}</h4>
        <p>${info.authors ? info.authors.join(", ") : "Autor desconhecido"}</p>
        <button onclick='adicionarLivro(${JSON.stringify(info).replace(
          /'/g,
          "&apos;"
        )})'>Adicionar</button>
      `;
      resultadosDiv.appendChild(card);
    });
  }

  mostrarPaginacao(data.totalItems || 0);
}

// Função para exibir botões de paginação
function mostrarPaginacao(totalResultados) {
  const totalPaginas = Math.ceil(totalResultados / resultadosPorPagina);
  const container = document.getElementById("paginacao");
  const contador = document.getElementById("contadorPagina");

  container.innerHTML = "";

  if (paginaAtual > 1) {
    const btnPrev = document.createElement("button");
    btnPrev.textContent = "⬅ Anterior";
    btnPrev.onclick = () => buscarLivros(paginaAtual - 1);
    container.appendChild(btnPrev);
  }

  if (paginaAtual < totalPaginas) {
    const btnNext = document.createElement("button");
    btnNext.textContent = "Próxima ➡";
    btnNext.onclick = () => buscarLivros(paginaAtual + 1);
    container.appendChild(btnNext);
  }

  // Exibe contador de páginas
  contador.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
}

// Adiciona livro à biblioteca (salvando em localStorage)
function adicionarLivro(info) {
  let biblioteca = JSON.parse(localStorage.getItem("biblioteca")) || [];
  biblioteca.push(info);
  localStorage.setItem("biblioteca", JSON.stringify(biblioteca));
  mostrarBiblioteca();
}

// Mostra livros salvos
function mostrarBiblioteca() {
  const biblioteca = JSON.parse(localStorage.getItem("biblioteca")) || [];
  const minhaDiv = document.getElementById("minhaBiblioteca");
  minhaDiv.innerHTML = "";

  biblioteca.forEach((info) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${info.imageLinks?.thumbnail || ""}" alt="Capa">
      <h4>${info.title}</h4>
      <p>${info.authors ? info.authors.join(", ") : "Autor desconhecido"}</p>
    `;
    minhaDiv.appendChild(card);
  });
}

// Carrega a biblioteca ao abrir a página
mostrarBiblioteca();
