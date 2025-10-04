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

    if (window.innerWidth <= 810) {
        document.body.classList.toggle("collapsed");
    }

    worker_enabled = document.getElementById("web_worker_toggle_button").checked;

    let container = document.getElementById("tileset_container")

    if (worker_enabled) {


        const delay = parseInt(document.getElementById("delay").value);
        const tiles = parseInt(document.getElementById("tiles").value);
        
        container.innerHTML = `
            <div style="margin-left:auto; margin-right:auto" class="loader"></div>
            <br/><br/>
            <button onclick="terminate_web_workers()">Stop</button>
            <br/><br/>
            <div id = "result_counter"></div>
        `;

        // Terminate if a worker is already running
        if (typeof web_workers !== "undefined") {
            web_workers.terminate();
        }

        web_workers = new Worker("js/worker.js");

        // Handle messages from worker
        web_workers.onmessage = function(event) {
            if (event.data.type === "count") {
                // Before sorting: show number of sets
                document.getElementById("result_counter").innerHTML =
                    `Generated ${event.data.value} sets...`;
            } else if (event.data.type === "result") {
                // After sorting: display results
                container.innerHTML = "";
                console.log(event.data.value);
                if (event.data.value.length === 0) {
                    container.innerHTML = "No Tilesets Found";
                } else {
                    container.innerHTML = event.data.value;
                }
            } else if (event.data.type === "error") {
                container.innerHTML = event.data.value;
            }
        };

        // Send input params to worker
        web_workers.postMessage({ delay, tiles });


    } else {

        
        const delay = parseInt(document.getElementById("delay").value);
        const tiles = parseInt(document.getElementById("tiles").value);
        
        sets = generate_set(delay, tiles)
        
        if (sets.length > 1000) {
            
            container.innerHTML = "More than 1000 tilesets found, aborting."
            return;
        }
        
        loop = new LoopHandler(sets)
        loop.sort()
        
        //Display
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
}

function terminate_web_workers() {

    let container = document.getElementById("tileset_container")

    web_workers.terminate()
    container.innerHTML = "";

}

function test_delay_minimum() {

    document.getElementById("channel_nr_warning_splash").classList.remove("show");
    const delay = parseInt(document.getElementById("delay").value);
    const tiles = parseInt(document.getElementById("tiles").value);

    const splash_text = document.getElementById("delay_warning_splash");

    if (delay < 2 * tiles) {
        splash_text.classList.add("show");
    } else {
        splash_text.classList.remove("show");
    }

}


function set_optimal_diode_nr() {
    const delay = parseInt(document.getElementById("delay").value);

    const optimal_delay = find_optimal_diodes(delay);
    document.getElementById("tiles").value = optimal_delay.diode_nr;

    document.getElementById("channel_nr_warning_splash_nr").innerHTML = optimal_delay.channels
    document.getElementById("delay_warning_splash").classList.remove("show");
    document.getElementById("channel_nr_warning_splash").classList.add("show");
}

function set_optimal_delay() {
    const tiles = parseInt(document.getElementById("tiles").value);

    const optimal_delay = find_optimal_delay(tiles);
    document.getElementById("delay").value = optimal_delay.delay;

    document.getElementById("channel_nr_warning_splash_nr").innerHTML = optimal_delay.channels
    document.getElementById("delay_warning_splash").classList.remove("show");
    document.getElementById("channel_nr_warning_splash").classList.add("show");
}


function check_web_worker() {
    const button = document.getElementById("web_worker_toggle_button");
    if(typeof(Worker) !== "undefined") {
      button.checked = true;
    } else {
      button.checked = false
      button.disabled = true;
    }
}