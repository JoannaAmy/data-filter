const table = document.querySelector(".table");
const tableData = document.querySelector(".table-body");
const search = document.querySelector("#search-bar");
const select = document.querySelector("#select-status");
const sort = document.querySelector("#sort");
const errorMsg = document.querySelector(".error-message");
let tableArray = [];

function renderTable(data) {
  tableData.innerHTML = "";
  data.forEach((user) => {
    const tableRow = `
        <tr class="table-rows">
        
        <td>${user.name}</td>
        <td>${user.email} </td>
        <td>${user.transactionStatus} </td>
        <td>${user.dateOfPayment} </td>
        <td>${user.amountPaid} </td>
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
      const filteredData = tableArray.filter(
        (user) =>
          user.name.toLowerCase().includes(lastSearch) ||
          user.name.toLowerCase().includes(lastSearch)
      );
      renderTable(filteredData);
    }
  });

sort.addEventListener("change", (e) => {
  const sortedData = e.target.value;

  if (sortedData === "ascending") {
    const sortedAscendingData = [...tableArray].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    renderTable(sortedAscendingData);
  } else if (sortedData === "descending") {
    const sortedDescendingData = [...tableArray].sort((a, b) =>
      b.name.localeCompare(a.name)
    );
    renderTable(sortedDescendingData);
  } else {
    renderTable(tableArray);
  }
});

select.addEventListener("change", (e) => {
  const selectedStatus = e.target.value;

  let filteredStatus = tableArray;

  if (selectedStatus !== "All") {
    filteredStatus = tableArray.filter(
      (user) => user.transactionStatus === selectedStatus
    );
  }

  renderTable(filteredStatus);
});

search.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();

  const filteredData = tableArray.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchValue) ||
      user.name.toLowerCase().includes(searchValue)
    );
  });
  sessionStorage.setItem("lastSearch", searchValue);

  if (filteredData.length === 0) {
    errorMsg.style.display = "block";
    table.style.display = "none";
  } else {
    errorMsg.style.display = "none";
    table.style.display = "block";
  }

  renderTable(filteredData);
});
