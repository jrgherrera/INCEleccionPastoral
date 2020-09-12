let userData;
document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const id = window.location.search.replace('?id=', '');
    // Si no hay id hay q mostrar un mensaje
    const generalCollectionPromise = db.collection("general").get();
    const currentUser = db.collection("users").doc(id);
    const currentUserPromise = currentUser.get();
    const $buttons = document.getElementById('has-not-voted').querySelectorAll('.vote');
    const now = new Date().getTime();
    Promise.all([generalCollectionPromise, currentUserPromise])
        .then(res => {
            document.body.classList.remove('loading');
            const [generalQuery, userResponse] = res
            // aquí se puede remover el spinner y hacer una animación de entrada
            // Si no existe el usuario, hay q mostrar mensaje
            userData = userResponse.data();
            document.getElementById('username').innerHTML = userData.name;

            // Luego verificamos si ya expiró la votación
            generalQuery.forEach(res => {
                const data = res.data();
                if (now < (data.initialDate.seconds * 1000) || now > (data.expirationDate.seconds * 1000)) {
                    throw 'expiration'
                    return userData
                }
            })
            return userData;
        })
        .then(userData => {
            if (!userData.hasVoted) {
                document.getElementById('has-not-voted').classList.remove('is-hidden');
            } else {
                throw 'hasVoted'
            }
        })
        .catch(err => {
            switch (err) {
                case 'expiration':
                    document.getElementById('has-expired').classList.remove('is-hidden');
                    break;
                case 'hasVoted':
                    document.getElementById('has-voted').classList.remove('is-hidden');
                    document.getElementById('pastor-name').innerHTML = userData.vote;
                    break;
            
                default:
                    break;
            }
        })
    
    for (let i = 0; i < $buttons.length; i++) {
        const $vote = $buttons[i];
        $vote.addEventListener('click', event => {
            const vote = event.currentTarget.value;
            currentUser.set({
                ...userData,
                hasVoted: true,
                vote
            }).then(() => {
            document.getElementById('has-not-voted').classList.add('is-hidden');
            document.getElementById('has-voted').classList.remove('is-hidden');
            document.getElementById('pastor-name').innerHTML = vote;
        })
    });
    }
});