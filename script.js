// Busca livros na Google Books API
async function buscarLivros() {
  const query = document.getElementById("searchInput").value;
  const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    query
  )}`;

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
