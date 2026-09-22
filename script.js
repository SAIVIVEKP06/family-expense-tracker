let expenses = JSON.parse(localStorage.getItem("familyExpenses")) || [];

const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");
const totalExpense = document.getElementById("totalExpense");
const monthlyExpense = document.getElementById("monthlyExpense");
const transactionCount = document.getElementById("transactionCount");
const filterCategory = document.getElementById("filterCategory");

expenseForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const expense = {
        id: Date.now(),
        name: document.getElementById("expenseName").value,
        amount: Number(document.getElementById("amount").value),
        member: document.getElementById("member").value,
        category: document.getElementById("category").value,
        date: document.getElementById("date").value
    };

    expenses.push(expense);

    saveExpenses();
    displayExpenses();

    expenseForm.reset();
});

function saveExpenses() {
    localStorage.setItem("familyExpenses", JSON.stringify(expenses));
}

function displayExpenses() {
    const selectedCategory = filterCategory.value;

    const filteredExpenses =
        selectedCategory === "All"
            ? expenses
            : expenses.filter(
                expense => expense.category === selectedCategory
            );

    if (filteredExpenses.length === 0) {
        expenseList.innerHTML =
            '<p class="empty-message">No expenses added yet.</p>';
    } else {
        expenseList.innerHTML = "";

        filteredExpenses.forEach(expense => {
            const expenseItem = document.createElement("div");

            expenseItem.className = "expense-item";

            expenseItem.innerHTML = `
                <div class="expense-info">
                    <h3>${expense.name}</h3>
                    <p>
                        ${expense.member} •
                        ${expense.category} •
                        ${expense.date}
                    </p>
                </div>

                <div>
                    <span class="expense-amount">
                        ₹${expense.amount}
                    </span>

                    <button
                        class="delete-btn"
                        onclick="deleteExpense(${expense.id})">
                        Delete
                    </button>
                </div>
            `;

            expenseList.appendChild(expenseItem);
        });
    }

    updateSummary();
}

function updateSummary() {
    const total = expenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
    );

    totalExpense.textContent = `₹${total}`;

    transactionCount.textContent = expenses.length;

    const currentMonth = new Date().toISOString().slice(0, 7);

    const monthlyTotal = expenses
        .filter(expense => expense.date.startsWith(currentMonth))
        .reduce(
            (sum, expense) => sum + expense.amount,
            0
        );

    monthlyExpense.textContent = `₹${monthlyTotal}`;
}

function deleteExpense(id) {
    expenses = expenses.filter(
        expense => expense.id !== id
    );

    saveExpenses();
    displayExpenses();
}

filterCategory.addEventListener("change", displayExpenses);

displayExpenses();
