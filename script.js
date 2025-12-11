const form = document.getElementById("expenseForm");
const tableBody = document.querySelector("#expenseTable tbody");
const exportBtn = document.getElementById("exportBtn");

// Load expenses from localStorage or start empty
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

function saveExpenses() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderTable() {
  tableBody.innerHTML = "";
  expenses.forEach((exp, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${exp.date}</td>
      <td>${exp.category}</td>
      <td>${exp.description}</td>
      <td>${exp.net.toFixed(2)}</td>
      <td>${exp.vat.toFixed(2)}</td>
      <td>${exp.total.toFixed(2)}</td>
      <td>${exp.receipt}</td>
      <td><button class="deleteBtn" onclick="deleteExpense(${index})">Delete</button></td>
    `;
    tableBody.appendChild(row);
  });
}

// Delete an expense
function deleteExpense(index) {
  if(confirm("Are you sure you want to delete this entry?")) {
    expenses.splice(index, 1);
    saveExpenses();
    renderTable();
  }
}

// Add new expense
form.addEventListener("submit", function(e){
  e.preventDefault();

  const date = document.getElementById("date").value;
  const category = document.getElementById("category").value;
  const description = document.getElementById("description").value;
  const net = parseFloat(document.getElementById("net").value);
  const vat = parseFloat(document.getElementById("vat").value);
  const total = net + vat;
  const receipt = document.getElementById("receipt").value;

  const expense = {date, category, description, net, vat, total, receipt};
  expenses.push(expense);
  saveExpenses();
  renderTable();
  form.reset();
});

// Export to CSV
exportBtn.addEventListener("click", function(){
  if(expenses.length === 0){
    alert("No expenses to export!");
    return;
  }

  let csv = "Date,Category,Description,Net (£),VAT (£),Total (£),Receipt\n";
  expenses.forEach(exp => {
    csv += `${exp.date},${exp.category},${exp.description},${exp.net.toFixed(2)},${exp.vat.toFixed(2)},${exp.total.toFixed(2)},${exp.receipt}\n`;
  });

  const blob = new Blob([csv], {type: 'text/csv'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "expenses.csv";
  a.click();
  URL.revokeObjectURL(url);
});

// Render table on page load
renderTable();