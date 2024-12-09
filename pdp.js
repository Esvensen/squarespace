document.addEventListener("DOMContentLoaded", async () => {
    // Get the 'id' parameter from the URL query string
    const urlParams = new URLSearchParams(window.location.search);
    const recordId = urlParams.get('id'); // Extract 'id' from the URL

    // If no Record ID is provided, show an error
    if (!recordId) {
        document.getElementById('product-detail').innerHTML = "<p>Product not found.</p>";
        return;
    }

    // Fetch product data from Airtable using Record ID
    const baseId = "appmzLRsR8Rc9nNcq";
    const tableName = "Objects";
    const apiKey = "patBJVJpMILwwIelu.34021ead804fb87fe18593ab487d487bf3a07412abf29ac33581eb88d8ef88c4";
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}/${recordId}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error("Error fetching product details.");
        }

        const data = await response.json();
        const product = data.fields;
        document.getElementById('product-image').innerHTML = `
            <img class="product-image" src="${product.Image ? product.Image[0].url : ""}" alt="${product['Display name']}">
        `;
        
        document.getElementById('product-detail').innerHTML = `
            <h2>${product.Designer}</h2>
            <h3>${product['Display name']}</h3>
            <div class="divider"></div>
            <p>${product.Description || "No description available."}</p>
            <div class="divider"></div>
            <a href="mailto:info@example.com?subject=Enquiry about ${product['Display name']}">Enquire Now</a>
        `;
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('product-detail').innerHTML = "<p>Error loading product.</p>";
    }
});