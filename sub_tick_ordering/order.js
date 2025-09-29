class LoopHandler {
    constructor(tilesets = null) {

        //Priority of Scheduling
        this.scheduled_3 = []
        this.scheduled_1 = []
        this.scheduled_0 = []


        // Next cycle queues
        this.next_scheduled_3 = [];
        this.next_scheduled_1 = [];
        this.next_scheduled_0 = [];

        //Store the sorted list
        this.sorted = [];

        //this.currentTick = 0;

        if (tilesets) {
            this.add_tilesets(tilesets);
        }
    }

    schedule_next(element) {
        if (element.priority == 0) {
            this.next_scheduled_0.push(element);
        } else if (element.priority == -1) {
            this.next_scheduled_1.push(element);
        } else if (element.priority == -3) {
            this.next_scheduled_3.push(element);
        } else {
            console.error("INVALID PRIORITY: " + element.priority);
        }
    }

    add_tilesets(tilesets) {
        for (let i = 0; i < tilesets.length; i++) {

            if (tilesets[i].priority == 0) {
                this.scheduled_0.push(tilesets[i])
            } else if (tilesets[i].priority == -1) {
                this.scheduled_1.push(tilesets[i])
            } else if (tilesets[i].priority == -3) {
                this.scheduled_3.push(tilesets[i])
            } else {
                console.error("INVALID PRIORITY: " + tilesets[i].priority)
            }
        }
    }

    tick() {

        let i = 0;
        //process in order -3, -1, 0
        while (i < this.scheduled_3.length) {
            let element = this.scheduled_3[i];
            if (element.scheduled_in < 0) {
                this.scheduled_3.splice(i, 1); //Remove from list
            } else {
                element.tick(this);
                i++;
            }
        }

        i = 0;
        while (i < this.scheduled_1.length) {
            let element = this.scheduled_1[i];
            if (element.scheduled_in < 0) {
                this.scheduled_1.splice(i, 1); //Remove from list
            } else {
                element.tick(this);
                i++;
            }
        }

        i = 0;
        while (i < this.scheduled_0.length) {
            let element = this.scheduled_0[i];
            if (element.scheduled_in < 0) {
                this.scheduled_0.splice(i, 1); //Remove from list
            } else {
                element.tick(this);
                i++;
            }
        }

        let test = this.got_ticked();
        if (test == false) {
            console.error("Failed to tick all scheduled elements.")
        }



        // Merge next cycle queues into active ones
        this.scheduled_3.push(...this.next_scheduled_3);
        this.scheduled_1.push(...this.next_scheduled_1);
        this.scheduled_0.push(...this.next_scheduled_0);

        // Clear cycle queue
        this.next_scheduled_3 = [];
        this.next_scheduled_1 = [];
        this.next_scheduled_0 = [];

        //this.currentTick = this.currentTick + 1;
        return;
    }

    got_ticked() {
        let test = true;
        //Test if all elements got ticked and resets state
        this.scheduled_0.forEach((el) => {
            //console.log(el.ticked);
            if (el.ticked == false) {
                test = false
            };
            el.ticked = false;
        })

        this.scheduled_1.forEach((el) => {
            //console.log(el.ticked);
            if (el.ticked == false) {
                test = false
            };
            el.ticked = false;
        })

        this.scheduled_3.forEach((el) => {
            //console.log(el.ticked);
            if (el.ticked == false) {
                test = false
            };
            el.ticked = false;
        })

        return test;
    }

    sort() {
        while (this.scheduled_3.length > 0 || this.scheduled_1.length > 0 || this.scheduled_0.length > 0) {
            this.tick()
        }
    }

}

class Diode {
    constructor(delay, into = null) {
        this.delay = delay;
        this.child = into;
        this.priority = 0;
        this.scheduled_in = delay;
        this.type = "none";
        this.parent_diode = false;
        this.ticked = false;
    }



    tick(loop_handler) {
        this.ticked = true;
        //console.log("ticked diode");
        if (this.scheduled_in == 0) {
            //console.log(`[Tick fire] ${this.type}(${this.delay}) firing at tick=${loop_handler.currentTick}`);

            if (!this.child) {
                loop_handler.sorted.push(this.get_chain_start());
                this.scheduled_in -= 1;
                return;
            }

            this.child.scheduled_in = this.child.delay;

            let priority = this.child.priority;

            if (priority == 0) {
                loop_handler.next_scheduled_0.push(this.child);
                //console.log("Scheduling " + this.child.toString() + " with priority " + 0)
            } else if (priority == -1) {
                loop_handler.next_scheduled_1.push(this.child);
                //console.log("Scheduling " + this.child.toString() + " with priority " + 1)
            } else if (priority == -3) {
                loop_handler.next_scheduled_3.push(this.child);
                //console.log("Scheduling " + this.child.toString() + " with priority " + 3)
            }
        }

        this.scheduled_in -= 1;
    }

    get_tileset_delay() {
        if (this.child == null) {
            return this.delay;
        } else {
            return this.delay + this.child.get_tileset_delay();
        }
    }

    get_chain_start() {
        if (this.parent_diode) {
            return this.parent_diode.get_chain_start();
        } else {
            return this;
        }
    }

    toString() {
        if (this.child) {
            return this.type + "(" + this.delay + ") -> " + this.child.toString();
        } else {
            return this.type + "(" + this.delay + ")";
        }
    }
}

class Repeater extends Diode {
    constructor(delay, into = null) {
        super(delay, into);
        this.type = "repeater";

        if (this.child instanceof Diode) {
            this.priority = -3;
        } else {
            this.priority = -1;
        }
    }

}

class Comparator extends Diode {
    constructor(into = null) {
        super(2, into);
        this.type = "comparator";

        if (this.child instanceof Diode) {
            this.priority = -1;
        } else {
            this.priority = 0;
        }
    }
}

function generate_set(delay, tile_length) {
    const results = [];


    function clone_chain(chain) {
        if (chain == null) return null;
        const copy = new chain.constructor(chain.delay);
        copy.type = chain.type;
        copy.priority = chain.priority;
        copy.scheduled_in = chain.scheduled_in;
        copy.child = clone_chain(chain.child);
        if (copy.child) {
            copy.child.parent_diode = copy;
        }
        return copy;
    }

    function backtrack(remainingDelay, remainingTiles, chain = null) {
        // If we built a valid chain, save it
        if (remainingDelay === 0 && remainingTiles === 0) {
            results.push(chain);
            return;
        }

        // If impossible, stop
        if (remainingDelay <= 0 || remainingTiles <= 0) return;

        // Try placing a comparator
        if (remainingDelay >= 2) {
            new_chain = clone_chain(chain)
            const comp = new Comparator(new_chain);
            if (new_chain) {
                new_chain.parent_diode = comp;
            }
            backtrack(remainingDelay - 2, remainingTiles - 1, comp);
        }

        // Try placing a repeater (1–4 ticks)
        for (let d = 2; d <= 8; d += 2) {
            if (remainingDelay >= d) {
                new_chain = clone_chain(chain)
                const rep = new Repeater(d, new_chain);
                if (new_chain) {
                    new_chain.parent_diode = rep;
                }
                backtrack(remainingDelay - d, remainingTiles - 1, rep);
            }
        }
    }

    backtrack(delay, tile_length);
    return results;
}

function get_available_channels(tile_length) {
    delay = 2 * tile_length;

    delays = [];
    available_channels = [];


    do {
        n = generate_set(delay, tile_length).length;
        delays.push(delay);
        available_channels.push(n);
        delay += 2
    } while (n > 0)

    console.log(delays.toString());
    console.log(available_channels.toString());

}

//For debugging
function simulate() {
    set = generate_set(8, 3);
    //set = generate_set(20, 4);
    loop = new LoopHandler(set)
    loop.sort()

    console.log(loop.sorted)
}

function sort_tilesets(tile_sets) {
    //takes a list of tile sets and simulates the activation
    return;
}