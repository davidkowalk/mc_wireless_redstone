//This file includes all unit tests

//Every test must return whether it passes
function run_tests() {
    let total_tests = 0;
    let passed_tests = 0;

    function run_test(test) {
        total_tests += 1;
        if (test()) {
            passed_tests += 1
        } else {
            console.error("Test Failed: " + test.name)
        }
    }

    run_test(test_generation);
    run_test(test_channel_number);
    run_test(test_warnings);

    //AI generated Tests
    run_test(test_schedule_next);
    run_test(test_add_tilesets);
    run_test(test_tick_and_got_ticked);
    run_test(test_get_tileset_delay)
    run_test(test_get_chain_start);
    run_test(test_toString);



    console.info(passed_tests + "/" + total_tests + " tests passed.")
}

function test_generation() {
    return false;
}

function test_channel_number() {
    return false;
}

function test_warnings() {
    return false;
}


function test_schedule_next() {
    const loop = new LoopHandler();
    const d0 = new Diode(2);
    d0.priority = 0;
    const d1 = new Diode(2);
    d1.priority = -1;
    const d3 = new Diode(2);
    d3.priority = -3;

    loop.schedule_next(d0);
    loop.schedule_next(d1);
    loop.schedule_next(d3);

    return (
        loop.next_scheduled_0.includes(d0) &&
        loop.next_scheduled_1.includes(d1) &&
        loop.next_scheduled_3.includes(d3)
    );
}

function test_add_tilesets() {
    const d0 = new Diode(2);
    d0.priority = 0;
    const d1 = new Diode(2);
    d1.priority = -1;
    const d3 = new Diode(2);
    d3.priority = -3;

    const loop = new LoopHandler([d0, d1, d3]);

    return (
        loop.scheduled_0.includes(d0) &&
        loop.scheduled_1.includes(d1) &&
        loop.scheduled_3.includes(d3)
    );
}

function test_tick_and_got_ticked() {
    const d = new Diode(1);
    d.priority = 0;
    const loop = new LoopHandler([d]);

    loop.tick();
    return d.ticked === false; // got_ticked resets after checking
}

function test_get_tileset_delay() {
    const d = new Repeater(2, new Comparator(new Repeater(4)));
    return d.get_tileset_delay() === 8;
}

function test_get_chain_start() {
    const c = new Comparator();
    const r = new Repeater(2, c);
    c.parent_diode = r;
    return c.get_chain_start() === r;
}

function test_toString() {
    const d = new Repeater(2, new Comparator());
    return d.toString().includes("repeater(2) -> comparator(2)");
}