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

    static getUser() {
        return new Promise((resolve, reject) =>
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    return resolve(user);
                } else {
                    return resolve(null);
                }
            })
        );
    }

    static openFormModal(type) {
        if (Auth.isLoggedIn) {
            window.location = `../form/index.html?type=${type}`
        } else {
            signInModalInstance.open()
        }
    }

    static async directToFirebase() {
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await firebase.auth().signInWithPopup(provider);
        return result;
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

    static async sendToForm(type) {
        await Auth.directToFirebase()
        Auth.isLoggedIn = true;
        window.location = `../form/index.html?type${type}`
    }

    static async sendEmail() {
        if (!Auth.isLoggedIn) {
            await Auth.directToFirebase()
        }
        location.href = 'mailto:name@rapidtables.com'
    }
}
