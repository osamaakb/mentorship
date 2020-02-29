let docRef = db.collection("tags");
docRef.get()
    .then(docs => {
        docs.docs.forEach(doc => {
            const tag = doc.data().name
            renderTag(tag)
        })
        initialTagsList()
    })

function initialTagsList() {
    M.FormSelect.init(document.querySelector("#tags"))
}

function renderTag(tag) {
    if (!document.querySelector("#tags").innerHTML.includes(tag))
        document.querySelector("#tags").insertAdjacentHTML("beforeend", `<option value="${tag}">${tag}</option>`)
}

function selecetedTags(tags) {

}

