document.addEventListener("DOMContentLoaded",initialTimePickers)

document.querySelector("#submit").addEventListener("click",submit)

function initialTimePickers(){
    M.Timepicker.init(document.querySelector('#start-hour'));
    M.Timepicker.init(document.querySelector('#end-hour'));
}

function submit(){
    event.preventDefault()

    const title = document.querySelector("#title").value
    const description = document.querySelector("#description").value
    const country = M.FormSelect.init(document.querySelector("#country")).getSelectedValues()[0];
    const city = document.querySelector("#city").value
    const tags = M.FormSelect.init(document.querySelector("#tags")).getSelectedValues();
    const start_time = document.querySelector("#start-hour").value
    const end_time = document.querySelector("#end-hour").value
    const githubLink = document.querySelector("#github-account").value
    const linkedinLink = document.querySelector("#linkedin-account").value
    const twitterLink = document.querySelector("#twitter-account").value
    const social_links = [
        {"type": "github", "value":githubLink},
        {"type": "twitter", "value":twitterLink},
        {"type":"linkedin", "value":linkedinLink}
    ]    
    const configurationObject = { title, description, country, city, tags, start_time, end_time, social_links, "userID":"817369182" }
    
    db.collection("mentees").add(configurationObject)
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    alert("all done")
}
