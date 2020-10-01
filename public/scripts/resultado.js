document.addEventListener('DOMContentLoaded', () => {
    if (!check()) return false;
    const db = firebase.firestore();
    const collection = db.collection("users");
    let total = 0;
    let miguel = 0;
    let guido = 0;
    let none = 0;
    let votes = 0;
    collection.get().then(querySnapshot => {
        document.body.classList.remove('loading');
        querySnapshot.forEach(user => {
            const userData = user.data();
            if (!userData.demo) {
              total++;
              if (userData.vote === 'gs') {
                  guido++;
              }
              if (userData.vote === 'ml') {
                  miguel++;
              }
              if (userData.vote === 'none') {
                  none++;
              }
              if (userData.hasVoted) {
                  votes++;
              }
            }
        })
        $miguel = document.querySelector('#miguel .votes');
        $guido = document.querySelector('#guido .votes');
        $total = document.querySelector('#total');
        $blank = document.querySelector('#blank');
        $null = document.querySelector('#null');

        $miguel.innerHTML = miguel;
        $guido.innerHTML = guido;
        $total.innerHTML = votes;
        $null.innerHTML = none;
        $blank.innerHTML = total - votes;
    })
});
