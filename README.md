# GTFS-station-builder

![](./public/images/screenshot.jpg)

## Try it out!

1. Open [https://kostjerry.github.io/gtfs-station-builder/sample/](https://kostjerry.github.io/gtfs-station-builder/sample/).<br>
2. Click "LOAD SAMPLE DATA" button or choose your own feed.<br>
3. Choose which station to build.<br>
4. Enjoy the station building process.<br>
5. Click "Save".<br>
6. Click "Download" to get the zipped feed.<br>

## Shortcuts

 - Double click on map: add location.
 - Double click on location: open location properties popup.
 - Double click on pathway: open pathway properties popup.
 - Ctrl+double click on map: add several objects describing fare and exit gates.
 - Right click on pathway: make it able to be reconnected to another location.
 - Enter on any input field in Location or Pathway popup: apply changes.
 - Delete on location or on pathway: delete it.
 - ESC: close Location or Pathway popup.

## Restrictions on the input data

The input is GTFS-static feed in one zip archive or a set of files that form GTFS-static feed together.
 - Required files: stops.txt and pathways.txt.
 - Stops.txt must contain at least one station.
 - Stops.txt must have located platforms and entrances because there is no way to add them in the builder.
 - All locations in stops.txt must have specified coordinates (even if it's a generic node). This way we will know how to place all locations relative to each other on the plane to show you the network.

## Data sample

[Download the sample.](https://kostjerry.github.io/gtfs-station-builder/sample/gtfs-translations-pathways-vehicles-sample.zip)

## Contributing

Project in written based on ReactJs framework.<br>
To run project locally in development mode type `npm start`.<br>
Open http://localhost:3000 to view it in the browser.<br>
The page automatcally reloads once you edit the code.<br>
You will also see any lint errors in the console.

## Known issues
 - No translations support.
 - No way to add platforms and entrances.

## License

The project is licensed under MIT License.
