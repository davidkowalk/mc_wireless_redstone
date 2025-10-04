# Tile Set Generator

This tool generates tile set with a specified number of comparators and repeaters (diodes) and simulates them to sort them by their sub tick activation.

# Starting the program

You can either visit the deployment on [GitHub.io](https://davidkowalk.github.io/mc_wireless_redstone/sub_tick_ordering/) or you can clone the repository locally.

## Starting a local http server

Running a local http server is necessarry for loading asynchronous processing scripts. It is only required when web workers are enabled.

> Warning: Large tilesets may crash your browser. It is not recommended to use the tool without web workers for more than 4 diodes.

To start a local web server, navigate to your folder in a terminal and run
```sh
python3 -m http.server 8000
```

# User Manual

This section details on how to use the tile set generator. Please visit the section above for instructions on how to start it.

## Setting up the generator

To generate a tileset, two values are required: the number of diodes and the delay you want to use.
Note that when activated in the same tick, tile sets with different number of diodes but identical delay may mix.

To find the arangement with the largest number of available channels set either the desired delay or the desired number of diodes. Then click the corresponding "Optimize" button to automatically find the largest number of channels by varying either delay or diode number.

## Options

Under "Advanced" you will find the option "Enable Web Workers". If your browser does not support the web workers api this option will be disabled, if it does it is enabled by default.
Web workers allow the script to process the tilesets separate from the main thread of the website. It is not really required for 4 diodes or less on most modern machines, including phones. If you run large tile sets without web workers enabled, your browser may crash.


## Reading the Output

After generating the tile sets you will see the tile sets ordered by their activation. The signal propagates from left to right, in the direction the arrows are showing. Every diode is denoted by `type(delay)` where the delay is the delay in game ticks. Comparators are therefore always denoted as `comparator(2)`. Repeater delay increases by 2 game ticks for every setting from 2 to 8 game ticks.

| Setting | Delay / Game Ticks |
|---------|--------------------|
| 1st     | 2
| 2nd     | 4
| 3rd     | 6
| 4th     | 8

The simulation assumes a constant signal at the input. Some tile sets, where a higher priority `repeater(2)` is facing into a lower priority `comparator(2)`, may not activate on a single tick puls. Similarily, in a row of comparators the last comparator has a lower priority and will therefore not turn on, when transmitting a single tick pulse.
