document.addEventListener("DOMContentLoaded", run);

document.querySelector("form").addEventListener("submit", submit);

const urlParams = new URLSearchParams(window.location.search);
const memberType = urlParams.get("type");

function run() {
    const formTitle = document.getElementById("form-title");

    if (memberType === "mentees") {
        formTitle.innerText = "Mentee Form";
    } else {
        formTitle.innerText = "Mentor Form";
    }

    M.Timepicker.init(document.querySelector("#start-hour"));
    M.Timepicker.init(document.querySelector("#end-hour"));
}

if (localStorage.getItem("changeForm") === "true") {
    const user = JSON.parse(localStorage.getItem("user"));

    console.log(user.tags[0]);
    console.log(user);

    const github = user.socialIconLinks.find(el => el.type === 'github').value
    const twitter = user.socialIconLinks.find(el => el.type === 'twitter').value
    const linkedin = user.socialIconLinks.find(el => el.type === 'linkedin').value

    document.querySelector("#title").value = user.title
    document.querySelector("#country").value = user.country
    document.querySelector("#description").value = user.description
    document.querySelector("#city").value = user.city
        // document.querySelector("#tags").value = user.tags
    document.querySelector("#start-hour").value = user.startHour
    document.querySelector("#end-hour").value = user.endHour
    document.querySelector("#github-account").value = github
    document.querySelector("#linkedin-account").value = twitter
    document.querySelector("#twitter-account").value = linkedin
}

function showErrorModal(errorType) {
    document.querySelector("#form-modal").innerHTML = `
    <div class="modal-content">
        <h5>Please check the ${errorType} field</h5>
    </div>      
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-blue btn-flat">OK</a>
    </div>
    `;

    let modalInstance = M.Modal.init(document.getElementById("form-modal"));
    modalInstance.open();
}

function showProgress(state, error = null) {
    let modal = document.querySelector("#form-modal");
    modal.innerHTML = `
    <div class="modal-content center">
        
    </div>      
    `;
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
        `;
    } else if (state === "success") {
        document.querySelector("#form-modal .modal-content").innerHTML = `
        <div class="modal-content">
        <h5>Sent successfully</h5>
    </div>      
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-blue btn-flat">OK</a>
    </div>
        `;
    } else {
        document.querySelector("#form-modal .modal-content").innerHTML = `
        <div class="modal-content">
        <h5>Something Went wrong</h5>
        <h5>Error ${error}</h5>
    </div>      
    <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-blue big btn-flat">OK</a>
    </div>
        `;
    }
}


function checkTheValidation(tags, country, startTime, endTime) {
    if (!country) {
        showErrorModal("Country");
        return false;
    } else if (tags.length == 0) {
        showErrorModal("Tags");
        return false;
    } else if (!startTime) {
        showErrorModal("Start Time");
        return false;
    } else if (!endTime) {
        showErrorModal("End Time");
        return false;
    }
    return true;
}

function sendUpdateRequest(configurationObject) {
    const user = JSON.parse(localStorage.getItem("user"));

    showProgress("loading");
    let modalInstance = M.Modal.init(document.getElementById("form-modal"));
    modalInstance.open();

    db.collection(memberType)
        .doc(user.doc_id)
        .set(configurationObject)
        .then(function(docRef) {
            showProgress("success");
            window.location = `../home/index.html?type=${memberType}`;
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            showProgress("error", error);
        });
}

function sendPostRequest(configurationObject) {
    showProgress("loading");
    let modalInstance = M.Modal.init(document.getElementById("form-modal"));
    modalInstance.open();
    db.collection(memberType)
        .add(configurationObject)
        .then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
            showProgress("success");
            window.location = `../home/index.html?type=${memberType}`;
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
            showProgress("error", error);
        });
}

async function submit() {
    event.preventDefault();

    const title = document.querySelector("#title").value;
    const description = document.querySelector("#description").value;
    const country = M.FormSelect.init(
        document.querySelector("#country")
    ).getSelectedValues()[0];
    const city = document.querySelector("#city").value;
    const tags = M.FormSelect.init(
        document.querySelector("#tags")
    ).getSelectedValues();
    const start_time = document.querySelector("#start-hour").value;
    const end_time = document.querySelector("#end-hour").value;
    const githubLink = document.querySelector("#github-account").value;
    const linkedinLink = document.querySelector("#linkedin-account").value;
    const twitterLink = document.querySelector("#twitter-account").value;
    const social_links = [
        { type: "github", value: githubLink },
        { type: "twitter", value: twitterLink },
        { type: "linkedin", value: linkedinLink }
    ];
    let user = await Auth.getUser();
    const user_name = user.displayName;
    const user_email = user.email;

    if (checkTheValidation(tags, country, start_time, end_time)) {
        const configurationObject = {
            title,
            description,
            country,
            city,
            tags,
            start_time,
            end_time,
            social_links,
            user_email,
            user_name
        };
        if (localStorage.getItem("changeForm") === "true") {
            sendUpdateRequest(configurationObject);
        } else {
            sendPostRequest(configurationObject);
        }
    }
}