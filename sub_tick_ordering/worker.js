//This file takes the responsibillities of the background process.

importScripts("order.js")
importScripts("interface.js")


onmessage = function(e) {
    const { delay, tiles } = e.data;

    try {
        const sets = generate_set(delay, tiles);

        // Send back count before sorting
        //if (sets.length > 1000) {
        //    postMessage({ type: "error", value: "More than 1000 tilesets found, aborting." });
        //    return;
        //}

        postMessage({ type: "count", value: sets.length });

        // Run sort
        const loop = new LoopHandler(sets);
        loop.sort();

        //Render Loop
        let out_html = "";
        let i = 1;
        for (let el of loop.sorted) {
            out_html += get_tileset_html(i, el);
            i++;
        }

        // Send back final sorted results
        postMessage({ type: "result", value: out_html });

    } catch (err) {
        postMessage({ type: "error", value: "Worker failed: " + err.message });
    }
};