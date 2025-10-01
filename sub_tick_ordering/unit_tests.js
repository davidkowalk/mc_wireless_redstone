//This file includes all unit tests

//Every test must return whether it passes
function run_unit_tests() {
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
    //run_test(test_warnings);

    run_test(test_delay_optimizer);
    run_test(test_diode_optimizer);

    //AI generated Tests
    run_test(test_schedule_next);
    run_test(test_add_tilesets);
    run_test(test_tick_and_got_ticked);
    run_test(test_get_tileset_delay)
    run_test(test_get_chain_start);
    run_test(test_toString);



    console.info(passed_tests + "/" + total_tests + " tests passed.")

    return {
        total: total_tests,
        passed: passed_tests
    };
}

function test_delay_optimizer() {
    return (find_optimal_delay(3).delay == 12 && find_optimal_delay(4).delay == 18 && find_optimal_delay(1).delay == 2);
}

function test_diode_optimizer() {
    return (find_optimal_diodes(10).diode_nr == 4 && find_optimal_diodes(12).diode_nr == 5)
}

function test_generation() {
    try {
        return (
            generate_set(2, 1).length == 2 &&
            generate_set(4, 1).length == 1 &&
            generate_set(4, 2).length == 4
        );
    } catch {
        return false
    }
}

function test_channel_number() {
    try {
        return (
            Math.sumPrecise(get_available_channels(1)) == 5 &&
            Math.sumPrecise(get_available_channels(2)) == 25 &&
            Math.sumPrecise(get_available_channels(3)) == 125
        );
    } catch {
        return false
    }
}

function test_warnings() {
    console.info(test_warnings.name + " is not implemented")
    return false;
}


function test_schedule_next() {
    try {
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
    } catch {
        return false;
    }
}

function test_add_tilesets() {
    try {
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
    } catch {
        return false;
    }
}

function test_tick_and_got_ticked() {
    try {

        const d = new Diode(1);
        d.priority = 0;
        const loop = new LoopHandler([d]);

        loop.tick();
        return d.ticked === false; // got_ticked resets after checking
    } catch {
        return false;
    }
}

function test_get_tileset_delay() {
    try {
        const d = new Repeater(2, new Comparator(new Repeater(4)));
        return d.get_tileset_delay() === 8;
    } catch {
        return false
    }
}

function test_get_chain_start() {
    try {
        const c = new Comparator();
        const r = new Repeater(2, c);
        c.parent_diode = r;
        return c.get_chain_start() === r;
    } catch {
        return false
    }
}

function test_toString() {
    try {
        const d = new Repeater(2, new Comparator());
        return d.toString().includes("repeater(2)") && d.toString().includes("comparator(2)");
    } catch {
        return false
    }
}