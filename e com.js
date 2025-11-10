let product = null
fetch('product.json')
.then(response => response.json())
.then(data => {
    product = data
    console.log(product)
    addDataToHTML()
})


let listproduct = document.querySelector('.listproduct')
function addDataToHTML(){
    product.forEach(product => {
        let newproduct = document.createElement('a')    
        
        
        newproduct.href='/details.html?id=' + product.id
        newproduct.classList.add('item')
        newproduct.innerHTML=`
        <img src="${product.image_url}">
        <h2>${product.name}</h2>
        <div class="price">$${product.price}</div>
        
        `



        listproduct.appendChild(newproduct)
    });
}