class FireBaseRequest {
  static getMembers(memberRef) {
    return memberRef
      .get()
      .then(docs => docs.docs.map(doc => new Member(doc.data(), doc.id)));
  }
}

class MembersView {
  static renderMembers(member) {
    let membersList = document.getElementById("membersList");
    const tagList = member.tags
      .map(tag =>
        `<li class="tag-item"><a href="">${tag}</a></li>`)
      .join("");

    membersList.insertAdjacentHTML(
      "beforeend",
      `
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
        `
    );
  }

  static render(members) {
    localStorage.setItem("updateForm", false);

    members.forEach(member => {
      MembersView.renderMembers(member);
    });
  }

  static renderInfoModal(members) {
    let infoButtons = document.getElementsByClassName("infoButton");

    for (let i = 0; i < infoButtons.length; i++) {
      infoButtons[i].addEventListener("click", () =>
        MembersView.showModal(members[i])
      );
    }
  }

  static showModal(member) {
    let modal = document.querySelector("#memberInfoModal");
    const tagList = member.tags.map(tag =>
      `<li class="tag-item"><a href="">${tag}</a></li>`).join("");

    modal.innerHTML = `
                  <div class="modal-content">
                      <h4>${member.title}
                      <span id='iconSpan'>
                      <i class="edit-Icons penIcon hidden material-icons">mode_edit</i> 
                      <i class="edit-Icons trashIcon hidden fas fa-trash"></i></span>
                      </h4>
                  <div>
                      <i class="material-icons iconMine red-text">location_on</i>
                      <p id="location" class="location">${member.city}, ${member.country}</p>
                  </div>
                  <h5>Description</h5>
                  <p> ${member.description}</p>
                  <span class="tagWord">Tags</span>
                  <ul id="tagsList" class="tagsList">
                      ${tagList}
                  </ul>
                  <p><span class="tagWord">Avaliable Hours: </span>${member.startHour} - ${member.endHour} </p>
                  <div class="social">
                      <p class="tagWord">Social Links:</p>
                  </div>
                  <div class="center-align">
                      <a id="mail-btn" class="waves-effect waves-light btn red white-text infoBtn btn-large center-align">let's work together (:</a>
                  </div>
              </div> `;

    let trash = document.querySelector(".trashIcon");
    trash.addEventListener("click", MembersView.deleteMember)

    let mailBtn = document.querySelector("#mail-btn");
    mailBtn.addEventListener("click", () => Auth.sendEmail(member));

    let social = document.querySelector("#memberInfoModal > div > div.social");
    member.socialIconLinks.forEach(socialIcon => {
      if (socialIcon.value != "") {
        if (socialIcon.type == "github") {
          social.insertAdjacentHTML(
            "beforeend", `<a href="${socialIcon.value}"><img class="socialIcons" src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt=""> </a>`
          );
        }
        if (socialIcon.type == "linkedin") {
          social.insertAdjacentHTML(
            "beforeend", `<a href="${socialIcon.value}"><img class="socialIcons" src="https://content.linkedin.com/content/dam/me/business/en-us/amp/brand-site/v2/bg/LI-Bug.svg.original.svg" alt=""> </a>`);
        }

        if (socialIcon.type == "twitter") {
          social.insertAdjacentHTML(
            "beforeend", `<a href="${socialIcon.value}"><img class="socialIcons" src="https://pngimage.net/wp-content/uploads/2018/06/official-twitter-logo-png-3.png" alt=""> </a>`);
        }
      }
    });

    let socialIconsVisibility = document.querySelectorAll("#memberInfoModal > div > div.social > a");

    if (Auth.isLoggedIn == false) {
      socialIconsVisibility.forEach(hideIcon => hideIcon.remove());
    }

    social.insertAdjacentHTML("beforeend", `<button class="loginBtn"  onclick="signInModalInstance.open();" >Login </button>`);

    let loginBtnVisibility = document.querySelector("#memberInfoModal > div > div.social > button");

    if (Auth.isLoggedIn == true) {
      loginBtnVisibility.remove();
    }
    memberInfoModalInstance.open();

    let icons = document.getElementsByClassName("edit-Icons");
    if (Auth.isLoggedIn) {
      let userEmail = JSON.parse(
        localStorage.getItem("firebase:authUser:AIzaSyAQmIYmYmq2OXM1zuJanex1paJpXJp3ZXc:[DEFAULT]")).email;
      if (userEmail === member.user_email) {
        for (let index = 0; index < icons.length; index++) {
          icons[index].classList.remove("hidden");
        }
      }
    }

    let editIcon = icons[0];

    editIcon.addEventListener("click", () => {
      localStorage.setItem("updateForm", true);
      console.log(member);

      localStorage.setItem("user", JSON.stringify(member));
      Auth.openFormModal(memberType);
    });
  }

  static deleteMember() {
    deleteModalInstance.open();
    let delBtn = document.getElementById("delBtn");
    delBtn.addEventListener("click", function () {
      db.collection(memberType)
        .doc(member.doc_id)
        .delete()
        .then(function (docRef) {
          deleteAlertInstance.open();
          window.location = `./index.html?type=${memberType}`;
        })
        .catch(function (error) {
          console.error("Error adding document: ", error);
        });
    });
  }
}

async function run() {
  Auth.checkUser();
  configureNavButtons();

  const progrss = document.getElementById('circularProgress')
  FireBaseRequest.getMembers(memberRef).then(members => {
    progrss.classList.add('hidden')
    MembersView.render(members);
    MembersView.renderInfoModal(members);
  });
}

function configureNavButtons() {

  const aboutButtons = document.querySelectorAll('.about-btn')
  aboutButtons.forEach(btn => {
    btn.addEventListener('click', () => aboutModalInstance.open())
  })

  const pageTitle = document.getElementById("pageTitle");
  const type = document.getElementById("type");
  let beMember = document.querySelectorAll(".member-btn");

  const beMemberDropdown = document.getElementsByClassName("beMember")[1];

  const title = document.getElementById("page_title");
  title.innerText = memberType;

  memberRef = db.collection(memberType);
  pageTitle.innerText = memberType;
  type.innerText = oppositeMember;
  beMember[0].innerHTML = `Be a ${memberType, memberType.substring(0, memberType.length - 1)}`;
  beMemberDropdown.innerHTML = `Be a ${memberType}`;
  type.href = `index.html?type=${oppositeMember}`;

  let signInBtn = document.getElementById("signInBtn");
  signInBtn.addEventListener("click", () => Auth.sendToForm(memberType));

  let showSignOutBtn = document.querySelectorAll(".signOutBtn");
  showSignOutBtn.forEach(btn => btn.addEventListener("click", Auth.signOut));

  isMemberBefore(memberType);
}

async function isMemberBefore(type) {
  let user = await Auth.getUser();
  let memberRef = db.collection(type);
  let beMember = document.querySelectorAll(".member-btn");

  if (user) {
    memberRef.where("user_email", "==", user.email)
      .get()
      .then(querySnapshot => {
        if (querySnapshot.docs.length != 0) {
          beMember.forEach(btn => {
            btn.innerHTML = `My ${type.substring(0, type.length - 1)}`;
            // btn.removeEventListener("click", () => Auth.openFormModal(memberType));
            btn.addEventListener("click", () => MembersView.showModal(
              new Member(querySnapshot.docs[0].data(), querySnapshot.docs[0].id)
            )
            );
          });
        }
      })
  } else {
    beMember.forEach(btn => {
      btn.addEventListener("click", () => Auth.openFormModal(memberType));
    });
  }
}

document.addEventListener("DOMContentLoaded", run);
