// Members class to identify mentees and mentors properties
class Members {
    constructor(json) {
        this.title = json.title;
        this.description = json.description;
        this.country = json.country;
        this.city = json.city;
        this.startHour = json.start_hour;
        this.endHour = json.end_hour;
        this.tags = json.tags;
        this.socialIconLinks = json.social_links.map(link => new SocialLink(link))
        this.user_email = json.user_email;
    }
}



class SocialLink {
    constructor(link) {
        this.type = link.type;
        this.value = link.value;
    }
}


// Firebase request class to fetch data for any members and map it
class FireBaseRequest {
    static getMembers(memberRef) {

        return memberRef.get().then(
            docs => docs.docs.map(doc =>
                new Members(doc.data())
            )
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
                                <p id="location" class="location">${member.city}, ${member.country}</p>
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

    const isMentee = localStorage.getItem("mentee");




    // If user click mentee gets data from mentees collection, for mentors gets from mentors db collection.
    if (isMentee == 'true') {
        memberRef = db.collection("mentees");
    } else {
        memberRef = db.collection("mentors");
    }

    memberRef = db.collection("mentees");

    // This shows rendered member in the modal card.
    FireBaseRequest.getMembers(memberRef).
        then(members => {
            MembersView.render(members);



            let modal = document.querySelector('.modal')
            let infoButtons = document.getElementsByClassName('infoButton')
            for (let i = 0; i < infoButtons.length; i++) {
                infoButtons[i].addEventListener('click', function showModal() {
                    const tagList = members[i].tags.map(tag => `
                    <li class="tag-item"><a href="">${tag}</a></li>
                    `).join('')


                    const socialLink = members[i].socialIconLinks.map(sLink => `
                    <li class="tag-item"><a href="">${sLink}</a></li>
                    `).join('')
                  

                    modal.innerHTML = `
                             <div class="modal-content">
                                  <h4>starting with JavaScript${members[i].title}</h4>
                                  <div>
                                  <i class="material-icons iconMine red-text">location_on</i>
                                  <p id="location" class="location">${members[i].city}, ${members[i].country}</p>
                                  </div>
                                  <h5>Description</h5>
                                  <p> ${members[i].description}</p>
                                  <span class="tagWord">Tags</span>
                                  <ul id="tagsList" class="tagsList">
                                     ${tagList}
                                  </ul>
                                  <p><span class="tagWord">Avaliable Hours:</span>${members[i].startHour} - ${members[i].endHour} </p>
                                  <div class="social">
                                     <p class="tagWord">Social Links:</p>
                                     <a href="${socialLink}"><img class="socialIcons"
                                     src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt=""> </a>
                                     <a href="${socialLink}"> <img class="socialIcons"
                                     src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg"
                                     alt=""></a>
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
