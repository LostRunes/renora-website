const API = "http://localhost:5000";

// Upload Product

document.getElementById("addForm").addEventListener("submit", async (e) => {

e.preventDefault();

const formData = new FormData();

formData.append("name", document.getElementById("name").value);
formData.append("price", document.getElementById("price").value);
formData.append("type", document.getElementById("type").value);
formData.append("material", document.getElementById("material").value);
formData.append("description", document.getElementById("description").value);

const image = document.getElementById("image").files[0];

if(image){
formData.append("image", image);
}

try{

const response = await fetch(`${API}/add-product`,{
method:"POST",
body:formData
});

const data = await response.json();

console.log(data);

alert("Product Uploaded Successfully");

}catch(error){

console.error(error);

alert("Upload Failed");

}

});



// Delete Product

async function deleteProduct(){
const id = document.getElementById("deleteId").value;
await fetch(`${API}/delete-product/${id}`,{
method:"DELETE"
});
alert("Product Deleted");
}



// Update Product

async function updateProduct(){

const id = document.getElementById("updateId").value;

const formData = new FormData();

formData.append("name", document.getElementById("updateName").value);
formData.append("price", document.getElementById("updatePrice").value);
formData.append("type", document.getElementById("updateType").value);
formData.append("material", document.getElementById("updateMaterial").value);
formData.append("description", document.getElementById("updateDescription").value);

const imageFile = document.getElementById("updateImage").files[0];

if(imageFile){
formData.append("image", imageFile);
}

await fetch(`http://localhost:5000/update-product/${id}`,{
method:"PUT",
body:formData
});

alert("Product Updated");

}