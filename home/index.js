
// Members class to identify mentees and mentors properties
class Members {
    constructor(json) {
        this.title = json.title;
        this.description = json.description;
        this.country = json.country;
        this.city = json.city;
        this.start_hour = json.start_hour;
        this.end_hour = json.end_hour;
        this.tags = json.tags;
        this.social_links = json.social_links;
        this.user_email = json.user_email;
    }
}
// Firebase request class to fetch data for any members and map it
class FireBaseRequest {
    static getMembers(docRef) {
        return docRef.get().then(
            docs => docs.docs.map(doc => new Members(doc.data()))
        )
    }
}

// MembersView class renders data comes from Firebase.
// Return data has same view structure, only texts change
class MembersView {
    static membersList = document.getElementById("membersList");


    static renderMembers(member) {
        const tagList = member.tags.map(tag => `
        <li class="tag-item"><a href="">${tag}</a></li>
        `).join('')
        MembersView.membersList.insertAdjacentHTML('beforeend', `
            <li id="memberItem" class="list-item">
                <div class="box-content red darken-1 z-depth-3">
                    <div class="row valign-wrapper conatinerMine">
                        <div class="col l10 m9 s12">
                            <h5 id="title">${member.title}</h5>
                            <div>
                                <i class="material-icons iconMine white-text">location_on</i>
                                <p id="location" class="location">${member.location}</p>
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

    static render(members) {
        members.forEach(member => {
            MembersView.renderMembers(member);
        });
    }
}

function run() {

    const value = localStorage.getItem("mentee");


    let valClick;

    // If user click mentee gets data from mentees collection, for mentors gets from mentors db collection.
    if (value == 'true') {
        let docRef = db.collection("mentees");
        valClick = FireBaseRequest.getMembers(docRef)
    } else {
        let docRef = db.collection("mentors");
        valClick = FireBaseRequest.getMembers(docRef)
    }



    // This shows rendered members in the cards.
    valClick.then(members => {
        MembersView.render(members);

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
                                <div class="center-align">
                                    <a class="waves-effect waves-light btn red white-text infoBtn btn-large center-align">let's work together (:</a>
                                </div>
                            </div>
                      
                    `
                modalInstance.open()
            })

        }
    })
}
document.addEventListener("DOMContentLoaded", run);
