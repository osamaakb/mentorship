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
            .then(() => {
                for (let i = 0; i < Auth.li.length; i++) {
                    Auth.li[i].classList.add('hidden')
                }
            })
        signOutModalInstance.open();
    }

    static sendEmail() {
        if (!Auth.isLoggedIn) {
            Auth.directToFirebase()
        }
        location.href = 'mailto:name@rapidtables.com'
    }
}
