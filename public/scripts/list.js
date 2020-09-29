let users = [];
let $list, $userTemplate;
document.addEventListener('DOMContentLoaded', () => {
    if (!check()) return false;
    const db = firebase.firestore();
    const collection = db.collection("users").orderBy('lastName');
    const generalCollectionPromise = db.collection("general").doc('appData').get();
    $list = document.getElementById('list');
    $userTemplate = document.getElementById('user-example');
    generalCollectionPromise
      .then(doc => {
        const appData = doc.data();
        if (Number(localStorage.getItem('idn-lastUpdate')) !== appData.lastUpdate.seconds) {
          localStorage.setItem('idn-lastUpdate', appData.lastUpdate.seconds)
          return true;
        }
        return false;
      })
      .then(downloadData => {
        if (downloadData || !localStorage.getItem('idn-users')) {
          return collection.get()
        } else {
          users = JSON.parse(localStorage.getItem('idn-users'))
          renderList();
        }
      })
      .then(querySnapshot => {
        document.body.classList.remove('loading');
        if (querySnapshot) {
          querySnapshot.forEach(user => {
              users.push({
                  id: user.id,
                  ...user.data()
              });
          })
          localStorage.setItem('idn-users', JSON.stringify(users));
          renderList();
        }
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
