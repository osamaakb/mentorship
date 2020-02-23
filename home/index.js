class Mentee {
    constructor(json) {
        this.title = json.title;
        this.location = json.location;
        this.description = json.description
        this.tags = json.tags
    }
}

class FireBaseRequest {
    static getMentees() {
        let docRef = db.collection("mentees");
        return docRef.get().then(
            docs => docs.docs.map(doc => new Mentee(doc.data()))
        )
    }
}

class MenteesView {
    static menteesList = document.getElementById("menteesList");

    static renderMentee(mentee) {
        const tagList = mentee.tags.map(tag => `
        <li class="tag-item"><a href="">${tag}</a></li>
        `).join('')
        MenteesView.menteesList.insertAdjacentHTML('beforeend', `
            <li id="menteeItem" class="list-item">
                <div class="box-content red darken-1 z-depth-3">
                    <div class="row valign-wrapper conatinerMine">
                        <div class="col l10 m9 s12">
                            <h5 id="title">${mentee.title}</h5>
                            <div>
                                <i class="material-icons iconMine white-text">location_on</i>
                                <p id="location" class="location">${mentee.location}</p>
                            </div>
                            <span class="tagWord">Tags</span>
                            <ul id="tagsList" class="tagsList">
                            ${tagList}
                            </ul>                              
                        </div>
                        <div id="info" class="col l2 m3 s12 center-align infoButton">
                            <a class="waves-effect waves-light btn white black-text infoBtn btn-large">info</a>
                        </div>
                    </div>
                </div>
                <!-- /box-content -->
            </li>
        `)
    }

    static render(mentees) {
        mentees.forEach(mentee => {
            MenteesView.renderMentee(mentee);
        });
    }
}

function run() {
    FireBaseRequest.getMentees()
        .then(mentees => {
            MenteesView.render(mentees);

            let modal = document.querySelector('.modal')
            let infoButtons = document.getElementsByClassName('infoButton')
            for (let i = 0; i < infoButtons.length; i++) {
                infoButtons[i].addEventListener('click', function showModal() {
                    const tagList = mentees[i].tags.map(tag => `
                    <li class="tag-item"><a href="">${tag}</a></li>
                    `).join('')
                    modal.innerHTML = `
                            <div class="modal-content">
                                <h4>${mentees[i].title}</h4>
                                <div>
                                    <i class="material-icons iconMine red-text">location_on</i>
                                    <p id="location" class="location">${mentees[i].location}</p>
                                </div>
                                <h5>Description</h5>
                                <p>${mentees[i].description}</p>
                                <span class="tagWord">Tags</span>
                                <ul id="tagsList" class="tagsList">
                                    ${tagList}
                                </ul>
                                <div>                              
                                <img class="socialIcons"
                                    src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="">
                                </div>
                                <div class="center-align" id="workTo"> 
                                    <a  class="waves-effect waves-light btn red white-text infoBtn btn-large center-align">let's work together (:</a>
                                </div>
                            </div>
                    `
                    modalInstance.open()

                    // mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm //
                    const workTo=document.getElementById("workTo");
                    workTo.addEventListener('click',authToConnect);
                    // mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm //

                })
            }

        })


}

document.addEventListener("DOMContentLoaded", run);

// mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm //


 function authToConnect() {
        function newLoginHappened(user) {
            if(!user)// sign in ):
            {
                alert("You Should be Signed In to Connect with me")
                var provider = new firebase.auth.GoogleAuthProvider();
                firebase.auth().signInWithRedirect(provider);   
            }
            // user sighn in so connect with the destination
               alert(`${user.displayName} will connect directly with me (:` )
               connectWDistination(user);
        }
        firebase.auth().onAuthStateChanged(newLoginHappened);
    }

function connectWDistination(user){
modal.innerHTML = `
                            <div class="modal-content">
                                <h4>${user.email}</h4>
                            </div>
                    `
}

// mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm //

