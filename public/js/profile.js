function addDummyAwards(){
    if (Math.floor(Math.random() * 10 + 1) > 5){
        let newAwardElement = document.createElement("img");
        awardBody = document.getElementById('awardContainer');

        newAwardElement.setAttribute("class", "award");
        newAwardElement.setAttribute("id","test_award");
        
        newAwardElement.src = "trophy.jpg";
        
        awardBody.appendChild(newAwardElement);
        document.getElementById("noneMsg").remove();
    }
}

document.getElementById("editBtn").addEventListener("click", function() {
    document.getElementById("editPopup").style.display = "block";
});

// Close the edit popup when window clicked
window.onclick = function(event) {
    var popUp = document.getElementById("editPopup");
    if (event.target == popUp) {
        popUp.style.display = "none";
        document.getElementById("editForm").reset();
        document.getElementById("warningMsg").textContent = "";
    }
};

// Close the edit popup when close btn clicked
document.getElementById("closeBtn").addEventListener("click", function() {
    document.getElementById("editPopup").style.display = "none";
    document.getElementById("editForm").reset();
    document.getElementById("warningMsg").textContent = "";
});

//EDIT CHANGE AND VALIDATION CODE
document.getElementById("editForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent default form submission
    
    function validateField(field){
        console.log(field,"msg: ");
        if(!field.value.trim()){ //need to trim so "    " doesn't count as valid input
            return false;
        }
        return true;
    } 

    let isValid = false;

    isValid = validateField(document.getElementById("newUsername")) || isValid;
    nameChange = validateField(document.getElementById("newUsername"));
    console.log("Name change: ",nameChange);

    isValid = validateField(document.getElementById("newDescription")) || isValid;
    descChange = validateField(document.getElementById("newDescription"));
    console.log("Desc Change: ",descChange);

    const imgInput = document.getElementById("imgInput");
    const newImg = imgInput.files[0];

    if (isValid || newImg){
        document.getElementById("warningMsg").textContent = "";
        event.preventDefault();
        
        console.log("SAVED");
        if(nameChange){
            var newUsername = document.getElementById("newUsername").value;
            document.getElementById("username").textContent = newUsername;
            console.log("NAME CHANGED");
            // nameChange = false;
        }   
        if (descChange){
            var newDescription = document.getElementById("newDescription").value;
            document.getElementById("description").textContent = newDescription;
            console.log("DESC CHANGED");
            // descChange = false;
        }
        if (newImg){
            const reader = new FileReader();
            reader.onload = function(event){
                const imgUrl = event.target.result;
                const newImg = document.getElementById("pfp");
                newImg.src = imgUrl;
            };
            reader.readAsDataURL(newImg);
        }

        document.getElementById("editPopup").style.display = "none";
        document.getElementById("editForm").reset();             
        // isValid = false;
    }
        // alert("EDITS SAVED");
    else{            
        document.getElementById("warningMsg").textContent = "Please edit a field or profile picture";
    }
    
});