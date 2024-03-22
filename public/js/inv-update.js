const form = document.querySelector("#updateForm")

console.log(form)

form.addEventListener("change", function () {
    const updateBtn = document.getElementById("submit")
    updateBtn.removeAttribute("disabled")
})