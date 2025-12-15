async function loadAnalytics() {
    try {
        const response = await fetch('/api/analytics/revenue');
        const data = await response.json();
        const tbody = document.querySelector('#analyticsTable tbody');
        tbody.innerHTML = '';
        
        data.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${row.category_name}</td>
                <td>${row.total_items_sold}</td>
                <td>$${row.total_revenue.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });
    } catch (e) {
        console.error(e);
        alert("Network Error: " + e.message);
    }
}

async function loadProducts() {
    try {
        const response = await fetch('/api/products?categoryId=1&page=1');
        const data = await response.json();
        const list = document.getElementById('productList');
        list.innerHTML = '';

        data.forEach(p => {
            const li = document.createElement('li');
            li.textContent = `${p.name} - $${p.currentprice}`;
            list.appendChild(li);
        });
    } catch (e) {
        console.error(e);
    }
}