// Members class to identify mentees and mentors properties
class Members {
    constructor(json) {
        this.title = json.title;
        this.id = json.userID;
        this.description = json.description;
        this.country = json.country;
        this.city = json.city;
        this.endHour = json.end_time;
        this.startHour = json.start_time;
        this.tags = json.tags;
        this.socialIconLinks = json.social_links;
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
                // console.log(doc.data())

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
    const pageTitle = document.getElementById("pageTitle");

    // If user click mentee gets data from mentees collection, for mentors gets from mentors db collection.
    if (isMentee == 'true') {
        memberRef = db.collection("mentees");
    } else {
        memberRef = db.collection("mentors");
        pageTitle.innerText = "Mentors"
    }

    Auth.checkUser()

    NavAuthButtons()

    firebase.auth().getRedirectResult()
        .then(function (result) {
            if (result.user) { window.location = '../form/index.html' }
        })


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

                    modal.innerHTML = `

                             <div class="modal-content">
                                  <h4>${members[i].title}</h4>
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
                                  <p><span class="tagWord">Avaliable Hours: </span>${members[i].startHour} - ${members[i].endHour} </p>
                                  <div class="social">
                                     <p class="tagWord">Social Links:</p>
                                    </div>
                                    <div class="center-align">
                                       <a class="waves-effect waves-light btn red white-text infoBtn btn-large center-align">let's work
                                               together (:</a>
                                    </div>
                             </div>  `


                    let social = document.querySelector("#memberInfoModal > div > div.social")

                    const socialLinkObeject = members[i].socialIconLinks.map(links => links);

                    // This part organizes social icons. if member has only github account, the only github icon is rendered on the modal.

                    socialLinkObeject.forEach(socialIcon => {

                        if (socialIcon.value != "") {
                            if (socialIcon.type == "github") {
                                social.insertAdjacentHTML('beforeend', `<a href="${socialIcon.value}"><img class="socialIcons"
                                         src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt=""> </a>`);
                            } if (socialIcon.type == "linkedin") {
                                social.insertAdjacentHTML('beforeend', `<a href="${socialIcon.value}"><img class="socialIcons"
                                         src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg" alt=""> </a>`);
                            } if (socialIcon.type == "twitter") {
                                social.insertAdjacentHTML('beforeend', `<a href="${socialIcon.value}"><img class="socialIcons"
                                         src="https://pngimage.net/wp-content/uploads/2018/06/official-twitter-logo-png-3.png" alt=""> </a>`
                                )
                            }
                        }
                    })


                    memberInfoModalInstance.open()


                })

            }
        })
}

class Auth {
    static isLoggedIn = false;
    static li = document.getElementsByClassName('outLi');
    static checkUser() {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                // if user signed in already                
                for (let i = 0; i < Auth.li.length; i++) {
                    Auth.li[i].classList.remove('hidden')
                }
                Auth.isLoggedIn = true;
            } else {
                Auth.isLoggedIn = false;
            }
        });
    }

    static openFormModal() {
        if (Auth.isLoggedIn) {
            window.location = '../form/index.html'
        } else {
            signInModalInstance.open()
        }
    }

    static directToFirebase() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithRedirect(provider);
    }

    static signOut() {
        firebase.auth().signOut()
            .then(() => { //alert("You have been Signed Out")
                for (let i = 0; i < Auth.li.length; i++) {
                    Auth.li[i].classList.add('hidden')
                }
            })
        signOutModalInstance.open();
    }
}

function NavAuthButtons() {
    let beMember = document.querySelectorAll('.member-btn')
    beMember.forEach(btn =>
        btn.addEventListener('click', Auth.openFormModal))

    let signInBtn = document.getElementById('signInBtn');
    signInBtn.addEventListener("click", Auth.directToFirebase);

    let showSignOutBtn = document.querySelectorAll('.signOutBtn')
    showSignOutBtn.forEach(btn =>
        btn.addEventListener('click', Auth.signOut))

}

document.addEventListener("DOMContentLoaded", run);
