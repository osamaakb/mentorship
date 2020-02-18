// class Tag {
//     constructor(tag) {
//         this.id = tag.id;
//         this.title = tag.title;
//     }
// }

class Mentee {
    constructor(json) {
        this.id = json.id;
        this.title = json.title;
        this.location = json.location;
        this.phone = json.phone
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

// class TagsView {
//     static renderTag(tag) { }

//     static render(tags) {
//         tags.forEach(tag => {
//             TagsView.renderTag(tag);
//         });
//     }
// }

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
                    // alert(mentees[i].title)
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
                                    <a class="waves-effect waves-light btn red white-text infoBtn btn-large center-align">let's work
                                        together (:</a>
                                </div>
                            </div>
                      
                    `
                    modalInstance.open()
                })

            }
        })
}
document.addEventListener("DOMContentLoaded", run);
