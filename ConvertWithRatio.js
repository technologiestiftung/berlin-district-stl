const fs = require('fs');
const turf = require('turf');
const geojson2stl = require("geojson2stl");

fs.readdir('./GeoJSON/', (err, files) => {
    const printSize = 100;
    const maxDiffs = [];
    files.forEach(file => {
       
        const geoJSON = JSON.parse(fs.readFileSync('./GeoJSON/' + file, 'utf-8'));


        // THIS IS WHERE THE MAGIC HAPPENS
        const bbox = turf.bbox(geoJSON)
        let diffX = bbox[2] - bbox[0];
        let diffY = bbox[3] - bbox[1];
        let maxDiff = diffX >= diffY ? diffX : diffY;

        maxDiffs.push(maxDiff);   
    });
    
    const biggestOfAllDiffs = Math.max(...maxDiffs);
    
    files.forEach(file=> {
        const geoJSON = JSON.parse(fs.readFileSync('./GeoJSON/' + file, 'utf-8'));
        
        let options = {};
        

        //....AND AGAIN...
        const bbox = turf.bbox(geoJSON)
        let diffX = bbox[2] - bbox[0];
        let diffY = bbox[3] - bbox[1];
        let maxDiff = diffX >= diffY ? diffX : diffY;

        options.size = maxDiff/biggestOfAllDiffs * printSize;
        options.extrude = 5;

        let stl = geojson2stl(geoJSON, options);
        let filename = file.split(".")[0] + ".stl";
        fs.writeFileSync("./scaledSTL/" + filename, stl); 
    })
})