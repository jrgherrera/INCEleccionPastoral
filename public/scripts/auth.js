document.addEventListener('DOMContentLoaded', () => {
    firebase.auth().onAuthStateChanged(function(user) {
        let email, password;
        if (!user) {
            email = prompt('Enter email', '');
            password = prompt('Enter Password', '');
            if (email && password) {
                firebase.auth().signInWithEmailAndPassword(email, password)
                    .catch(function(error) {
                        window.location.replace('404.html');
                    });
            } else {
                window.location.replace('404.html');
            }
        }
    });
});