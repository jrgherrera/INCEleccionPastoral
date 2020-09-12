document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const collection = db.collection("users");
    const $list = document.getElementById('list');
    const $userTemplate = document.getElementById('user-example');
    collection.get().then(querySnapshot => {
        document.body.classList.remove('loading');
        querySnapshot.forEach(user => {
            const $user = $userTemplate.cloneNode(true);
            $user.id = `user-${user.id}`;
            const userData = user.data();
            if (userData.hasVoted) {
                $user.classList.add('disabled')
            }
            $user.querySelector('.name').innerHTML = userData.name;
            $user.querySelector('.link a').href = `/voto?id=${user.id}`;
            $user.querySelector('.link a').innerHTML = `${window.location.href}voto?id=${user.id}`;
            $user.querySelector('.has-voted input[type=checkbox]').checked = userData.hasVoted;

            $user.classList.remove('is-hidden');

            $list.appendChild($user);
        })
    })
});