const collapseBtn = document.getElementById("collapseSidebar");
const showBtn = document.getElementById("showSidebar");

collapseBtn.addEventListener("click", () => {
    document.body.classList.add("collapsed");
});

showBtn.addEventListener("click", () => {
    document.body.classList.remove("collapsed");
});

function runAndDisplayTests() {
    document.getElementById("test-results").textContent = "...";
    const result = run_unit_tests();
    document.getElementById("test-results").textContent =
        result.passed + "/" + result.total + " tests passed.";
}

document.getElementById('toggle-uncertainties').addEventListener('click', function() {
    const section = document.getElementById('uncertainty-section');
    section.classList.toggle('open');

    const label = document.getElementById('toggle-uncertainties');
    const isOpen = section.classList.contains('open');
    label.textContent = isOpen ? 'Advanced ▲' : 'Advanced ▼';
});

function getSortedTileset() {
    const delay = parseInt(document.getElementById("delay").value);
    const tiles = parseInt(document.getElementById("tiles").value);

    sets = generate_set(delay, tiles)
    loop = new LoopHandler(sets)
    loop.sort()

    //Display
    let container = document.getElementById("tileset_container")
    container.innerHTML = ""

    if (loop.sorted.length == 0) {
        container.innerHTML = "No Tilesets Found"
    } else {

        let i = 1;
        for (let el of loop.sorted) {
            //console.log(el.toString())

            container.innerHTML += get_tileset_html(i, el);
            i++;
        }
    }
}

function get_tileset_html(i, el) {
    return "<label><input type='checkbox'>#" + i + " " + el.toString() + "</label>\n<hr/>"
}

function test_delay_minimum() {

    const delay = parseInt(document.getElementById("delay").value);
    const tiles = parseInt(document.getElementById("tiles").value);

    const splash_text = document.getElementById("delay_warning_splash");

    if (delay < 2 * tiles) {
        splash_text.classList.add("show");
    } else {
        splash_text.classList.remove("show");
    }

}