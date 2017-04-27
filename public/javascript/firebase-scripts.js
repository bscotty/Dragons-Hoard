function onFirebaseSignIn(fn) {
    firebase.auth().onAuthStateChanged(fn, function (error) {
        console.log('error signing into Firebase', error);
    });
}

function addSheetForms(snapshot) {
    const sheet = document.createElement('p');
    const val = snapshot.val();

    // Include a way to get to the sheet.
    const a = document.createElement('a');
    a.classList.add('sheet');
    a.textContent = a.title = val.name + ' -- Level ' + val.level + ' ' + val.class;
    a.href = '/sheet/' + val.slug;
    sheet.appendChild(a);

     /*
     <!-- For each of the forms we have, add it. The form, as HTML, is as follows. !-->

     <form action="/delete/{sheet.slug}" method="post">
        <input type="hidden" name="uid" value="{user.uid}">
        <input type="submit" value="Delete">
     </form>
     <br>
    */

    // Create Initial Delete Form
    const formDelete = document.createElement('form');
    formDelete.setAttribute('action', '/delete/' + val.slug);
    formDelete.setAttribute('method', 'post');
    formDelete.classList.add('delete');

    // Add the Hidden User ID to the form
    const hiddenUser = document.createElement('input');
    hiddenUser.type = 'hidden';
    hiddenUser.name = 'uid';
    hiddenUser.value = firebaseUser.currentUserId + '';
    formDelete.appendChild(hiddenUser);

    // Add Delete Button to the form
    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Delete';
    formDelete.appendChild(submit);

    // Add Delete form to the sheet, and add the sheet to the sheet envelope.
    sheet.appendChild(formDelete);
    const envelope = document.querySelector('#sheets');
    envelope.appendChild(sheet);
    envelope.appendChild(document.createElement('br'));
}