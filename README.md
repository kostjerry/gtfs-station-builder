# GTFS-station-builder

![](./public/images/screenshot.png)

## Try it out!

1. Open [https://kostjerry.github.io/gtfs-station-builder/sample/](https://kostjerry.github.io/gtfs-station-builder/sample/).<br>
2. Click "LOAD SAMPLE DATA" button.<br>
3. Enjoy the station building process.<br>
4. Click "Save" to download .zip with the station.<br>

## Sample of GTFS data

### stops.txt

```
stop_id,stop_name,location_type,parent_station,wheelchair_boarding,level_id,platform_code
1,XYZ,1,,0,,
2,1,0,1,1,2,K
3,2,0,1,1,,
4,Center,2,1,2,,
5,Park,2,1,1,1,
```

### pathways.txt

```
pathway_id,from_stop_id,to_stop_id,pathway_mode,is_bidirectional,length,traversal_time,stair_count,max_slope,min_width,signposted_as,reversed_signposted_as
1,4,2,4,1,,60,,,,,
2,4,2,2,1,,120,,,,,
3,5,2,5,1,,20,,,,,
4,2,3,1,1,,30,,,,,
```

### "levels.txt",

```
level_id,level_index,level_name
1,0,
2,-1,
```

## Contributing

Project in written based on ReactJs framework.<br>
To run project locally in development mode type `npm start`.<br>
Open http://localhost:3000 to view it in the browser.<br>
The page will reload if you make edits.<br>
You will also see any lint errors in the console.

## Known issues
 - location_type=4 (Boarding Area) is currently not processed
 - levels.txt is currently not processed
 - no translations support

## License

The project is licensed under MIT License.
