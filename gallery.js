let allProducts = []; // Store all products globally
let categories = new Set(); // Store unique categories

async function fetchProducts() {
    const baseId = "appmzLRsR8Rc9nNcq";
    const tableName = "Objects";
    const apiKey = "patBJVJpMILwwIelu.34021ead804fb87fe18593ab487d487bf3a07412abf29ac33581eb88d8ef88c4";
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error fetching data");
        }

        const data = await response.json();
        allProducts = data.records; // Save all products globally
        extractCategories(allProducts);
        displayCategories();
        displayProducts(allProducts); // Show all products initially
    } catch (error) {
        console.error("Error:", error);
    }
}

function extractCategories(records) {
    records.forEach(record => {
        const product = record.fields;
        if (product.Category) {
            product.Category.forEach(category => {
                categories.add(category); // Add each category to the Set
            });
        }
    });
}

function displayCategories() {
    const categoryTabs = document.getElementById("category-tabs");
    categoryTabs.innerHTML = ""; // Clear existing tabs

    const allTab = document.createElement("li");
    allTab.textContent = "All";
    allTab.classList.add("active");
    allTab.addEventListener("click", () => filterProductsByCategory("All"));
    categoryTabs.appendChild(allTab);

    categories.forEach(category => {
        const tab = document.createElement("li");
        tab.textContent = category;
        tab.addEventListener("click", () => filterProductsByCategory(category));
        categoryTabs.appendChild(tab);
    });
}

function filterProductsByCategory(category) {
    const categoryTabs = document.querySelectorAll("#category-tabs li");
    categoryTabs.forEach(tab => tab.classList.remove("active"));

    const activeTab = [...categoryTabs].find(tab => tab.textContent === category);
    if (activeTab) {
        activeTab.classList.add("active");
    }

    const filteredProducts = category === "All"
        ? allProducts
        : allProducts.filter(product => product.fields.Category && product.fields.Category.includes(category));
    displayProducts(filteredProducts);
}

function displayProducts(records) {
    const container = document.getElementById("product-container");
    container.innerHTML = ""; // Clear the container

    records.forEach(record => {
        const product = record.fields;
        const productElement = `
            <div class="product">
                <img src="${product.Image ? product.Image[0].url : ""}" alt="${product.Name}" />
                <div class="details">
                    <div>
                        <h3>${product['Display name']}</h3>
                        <p>${product.Designer}</p>
                    </div>
                    <div>
                        <a>Enquire</a>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productElement;
    });
}

// Call the function on page load
document.addEventListener("DOMContentLoaded", fetchProducts);
