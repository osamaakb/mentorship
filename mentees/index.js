class APIService {
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

class Mentee {
    constructor(json) {
        this.title = json.title;
        this.location = json.location;
        this.phone = json.phone
        this.description = json.description
        this.tags = json.tags
    }
}

function app() {
    APIService.getMentees()
        .then(mentees => MenteesView.render(mentees))
}
document.addEventListener('DOMContentLoaded', app);