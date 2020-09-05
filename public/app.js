let userData;
document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const id = window.location.search.replace('?id=', '');
    // Si no hay id hay q mostrar un mensaje
    const currentUser = db.collection("users").doc(id);
    const $buttons = document.getElementById('has-not-voted').querySelectorAll('.vote');
    currentUser.get().then(res => {
        // aquí se puede remover el spinner y hacer una animación de entrada
        // Si no existe el usuario, hay q mostrar mensaje
        userData = res.data();
        document.getElementById('username').innerHTML = userData.name;
        if (userData.hasVoted) {
            document.getElementById('has-voted').classList.remove('is-hidden');
            document.getElementById('pastor-name').innerHTML = userData.vote;
        } else {
            document.getElementById('has-not-voted').classList.remove('is-hidden');
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