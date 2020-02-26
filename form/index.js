document.addEventListener("DOMContentLoaded", initialMaterializeElements)

document.querySelector("form").addEventListener("submit", submit)

function initialMaterializeElements() {
    const formTitle = document.getElementById('form-title')
    const urlParams = new URLSearchParams(window.location.search);
    const memberType = urlParams.get('type');

    if (memberType === 'mentees') {
        formTitle.innerText = 'Mentee Form'
    } else {
        formTitle.innerText = 'Mentor Form'
    }

    M.Timepicker.init(document.querySelector('#start-hour'));
    M.Timepicker.init(document.querySelector('#end-hour'));
}

function showErrorModal(errorType) {
    document.querySelector("#form-modal").innerHTML = `
    <div class="modal-content">
        <h5>Please check the ${errorType} field</h5>
    </div>      
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-blue btn-flat">OK</a>
    </div>
    `

    let modalInstance = M.Modal.init(document.getElementById('form-modal'));
    modalInstance.open()
}

function showProgress(state, error = null) {
    let modal = document.querySelector("#form-modal")
    modal.innerHTML = `
    <div class="modal-content center">
        
    </div>      
    `
    if (state === "loading") {
        document.querySelector("#form-modal .modal-content").innerHTML = `
        <div class="preloader-wrapper big active">
        <div class="spinner-layer spinner-red-only">
          <div class="circle-clipper left">
            <div class="circle"></div>
          </div><div class="gap-patch">
            <div class="circle"></div>
          </div><div class="circle-clipper right">
            <div class="circle"></div>
          </div>
        </div>
      </div>
      <div>
      <h5>Sending information...</h5>
      </div>
        `
    } else if (state === "success") {
        document.querySelector("#form-modal .modal-content").innerHTML = `
        <div class="modal-content">
        <h5>Sent successfully</h5>
    </div>      
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-blue btn-flat">OK</a>
    </div>
        `
    } else {
        document.querySelector("#form-modal .modal-content").innerHTML = `
        <div class="modal-content">
        <h5>Something Went wrong</h5>
        <h5>Error ${error}</h5>
    </div>      
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-blue big btn-flat">OK</a>
    </div>
        `
    }

}

function checkTheValidation(tags, country, startTime, endTime) {
    if (!country) {
        showErrorModal("Country")
        return false
    } else if (tags.length == 0) {
        showErrorModal("Tags")
        return false
    } else if (!startTime) {
        showErrorModal("Start Time")
        return false
    } else if (!endTime) {
        showErrorModal("End Time")
        return false
    }
    return true

}

function sendPostRequest(configurationObject) {
    showProgress("loading")
    let modalInstance = M.Modal.init(document.getElementById('form-modal'));
    modalInstance.open()
    db.collection("mentors").add(configurationObject)
        .then(function (docRef) {
            console.log("Document written with ID: ", docRef.id);
            showProgress("success")
            window.location = "../home/index.html"
        })
        .catch(function (error) {
            console.error("Error adding document: ", error);
            showProgress("error", error)
        });
}


async function submit() {
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
        { "type": "github", "value": githubLink },
        { "type": "twitter", "value": twitterLink },
        { "type": "linkedin", "value": linkedinLink }
    ]
    let user = await Auth.getUser()
    const user_name = user.displayName;
    const user_email = user.email;

    if (checkTheValidation(tags, country, start_time, end_time)) {
        const configurationObject = { title, description, country, city, tags, start_time, end_time, social_links, user_email, user_name }
        sendPostRequest(configurationObject)
    }


}