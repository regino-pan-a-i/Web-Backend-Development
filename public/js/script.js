pButton = document.getElementById('pwordBtn');
pButton.addEventListener('click', function() {
    var pword = document.getElementById('password');
    var type = pword.getAttribute('type');
    if (type === 'password') {
        pword.setAttribute('type', 'text');
        pButton.textContent = 'Hide Password';
    } else {
        pword.setAttribute('type', 'password');
        pButton.textContent = 'Show Password';
    }
});