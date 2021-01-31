let thingsToDo = [];

let identification = 0;

window.onload = async function () {
    const response = await fetch("http://localhost:3000/getList");
    thingsToDo = await response.json();
    if (thingsToDo.length > 0) {
        identification = thingsToDo[thingsToDo.length - 1].id + 1;
        writeList();
    }
}



document.getElementById("bttn").addEventListener("click", function () {
    if (document.getElementById("textInput").value.match(/^[ a-zA-Z0-9_]{1,20}$/)) {
        addItem(document.getElementById("textInput").value);
        writeList();
    }
})

document.getElementById("textInput").addEventListener("keyup", event => {
    if (event.code == "Enter" && document.getElementById("textInput").value.match(/^[ a-zA-Z0-9_]{1,20}$/)) {
        addItem(document.getElementById("textInput").value)
        writeList();
    }
})

async function addItem(item) {
    let data = {
        text: item,
        id: identification
    }
    thingsToDo.push(data);
    document.getElementById("textInput").value = "";

    const response = await fetch("http://localhost:3000/addItem", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    identification++;
}

async function deleteItem(e) {
    let buttonID = e.target.dataset.identification;
    thingsToDo = thingsToDo.filter(item => item.id != buttonID);
    const response = await fetch("http://localhost:3000/deleteItem", {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: buttonID })

    })
    writeList();
}

function writeList() {
    document.querySelector("#list").innerHTML = "";
    for (let i = 0; i < thingsToDo.length; i++) {
        document.querySelector("#list").innerHTML += thingsToDo[i].text + '<input id="deleteBttn" type="button" value="X"> <br>';
    }
    document.querySelectorAll("#deleteBttn").forEach((button, i) => {
        button.setAttribute("data-identification", thingsToDo[i].id);
        button.addEventListener("click", deleteItem);
    })
}