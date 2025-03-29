async function login() {

    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let response = await fetch("http://10.10.13.2/~inb5/merlini/api/user/login.php?username=" + email + "&password=" + password);

    if (response.ok) {
        let data = response.json();

        console.log(data);
    }

}