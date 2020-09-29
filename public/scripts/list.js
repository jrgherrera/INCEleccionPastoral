let users = [];
let $list, $userTemplate;
document.addEventListener('DOMContentLoaded', () => {
    const db = firebase.firestore();
    const collection = db.collection("users").orderBy('lastName');
    $list = document.getElementById('list');
    $userTemplate = document.getElementById('user-example');
    collection.get().then(querySnapshot => {
        document.body.classList.remove('loading');
        querySnapshot.forEach(user => {
            users.push({
                id: user.id,
                ...user.data()
            });
        })
        renderList();
    });
    // Search
    document.getElementById('search').addEventListener('keyup', e => {
        const searchVal = e.currentTarget.value.toLowerCase();
        clearList()
        renderList(searchVal);
    })
});

function clearList () {
    $list.innerHTML = '';
}

function renderList (searchVal = '') {
    for (let i = 0; i < users.length; i++) {
        const userData = users[i];
        if (`${userData.lastName.toLowerCase()} ${userData.name.toLowerCase()}`.includes(searchVal)) {
            const $user = $userTemplate.cloneNode(true);
            $user.id = `user-${userData.id}`;
            if (userData.hasVoted) {
                $user.classList.add('disabled')
            }
            const $link = $user.querySelector('.link');
            $user.querySelector('.name').innerHTML = `${userData.lastName} ${userData.name}`;
            $link.value = `${window.location.href}voto/?id=${userData.id}`;
            $link.setAttribute('data-key', userData.id);
            $link.addEventListener('click', copyToClipboard)

            $user.classList.remove('is-hidden');

            $list.appendChild($user);
        }
    }
}

function copyToClipboard (e) {
    const button = e.currentTarget;
    navigator.clipboard.writeText(button.value)
        .then(() => {
            $user = document.getElementById(`user-${button.dataset.key}`)
            $user.classList.add('copied');
            const timeout = setTimeout(() => {
                $user.classList.remove('copied');
            }, 2000);
        })
}
