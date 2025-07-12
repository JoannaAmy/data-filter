const table = document.querySelector(".table");
const tableData = document.querySelector(".table-body");
const search = document.querySelector("#search-bar");
const selectStatus = document.querySelector("#select-status");
const sortName = document.querySelector("#sort");
const errorMsg = document.querySelector(".error-message");
const clear = document.querySelector(".clear");
const sortDate = document.querySelector("#sort-date");
const sortAmount = document.querySelector("#sort-amount");
let tableArray = [];

const parseFloat = (str) => Number(str.replace(/,/g, ""));

function renderTable(data) {
  tableData.innerHTML = "";
  data.forEach((user) => {
    const tableRow = `
        <tr class="table-rows">
        <td>${user.name}</td>
        <td>${user.email} </td>
        <td>${user.transactionStatus} </td>
        <td>${user.amountPaid} </td>
        <td>${user.dateOfPayment} </td>
        </tr>
        `;
    tableData.innerHTML += tableRow;
  });
}

fetch("./data.json")
  .then((res) => res.json())
  .then((data) => {
    tableArray = data;
    renderTable(data);

    errorMsg.style.display = "none";

    const lastSearch = sessionStorage.getItem("lastSearch");
    if (lastSearch) {
      search.value = lastSearch;
      activeFilters();
    }
  });

function activeFilters() {
  let data = [...tableArray];

  const searchValue = search.value.trim().toLowerCase();
  const nameSort = sortName.value;
  const dateSort = sortDate.value;
  const amountSort = sortAmount.value;
  const statusValue = selectStatus.value;

  if (searchValue) {
    data = data.filter((user) => user.name.toLowerCase().includes(searchValue));
  }

  if (statusValue !== "All") {
    data = data.filter((user) => user.transactionStatus === statusValue);
  }

  if (nameSort === "ascending") {
    data = data.filter((a, b) => a.name.localeCompare(b.name));
  }
  if (nameSort === "descending") {
    data = data.filter((a, b) => b.name.localeCompare(a.name));
  }

  if (amountSort === "highest") {
    data = data.filter(
      (a, b) => parseFloat(b.amountPaid) - parseFloat(a.amountPaid)
    );
  }
  if (amountSort === "lowest") {
    data = data.filter(
      (a, b) => parseFloat(a.amountPaid) - parseFloat(b.amountPaid)
    );
  }

  if (dateSort === "newest") {
    data = data.filter(
      (a, b) => new Date(b.amountPaid) - new Date(a.amountPaid)
    );
  }
  if (dateSort === "oldest") {
    data = data.filter(
      (a, b) => new Date(a.amountPaid) - new Date(b.amountPaid)
    );
  }

  if (data.length === 0) {
    errorMsg.style.display = "block";
    table.style.display = "none";
  } else {
    errorMsg.style.display = "none";
    table.style.display = "block";
    renderTable(data);
  }
}

sortName.addEventListener("change", activeFilters);

sortDate.addEventListener("change", activeFilters);

sortAmount.addEventListener("change", activeFilters);

selectStatus.addEventListener("change", activeFilters);

search.addEventListener("input", () => {
  sessionStorage.setItem("lastSearch", search.value.toLowerCase());
  activeFilters();
});

clear.addEventListener("click", () => {
  search.value = "";
  sortName.value = "All";
  selectStatus.value = "All";
  sortDate.value = "All";
  sortAmount.value = "All";

  sessionStorage.removeItem("lastSearch");

  errorMsg.style.display = "none";

  activeFilters();
});
