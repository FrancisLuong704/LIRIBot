require("dotenv").config();

var keys = require("./keys.js");

var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

var moment = require('moment');

var request = require('request');

var command = process.argv[2];

var name = process.argv.slice(3).join('%20');

var fs = require("fs");

fs.readFile("random.txt", "utf8", function (error, data) {
    if (error) {
        console.log(error);
    }

    if (command === "concert-this") {
        request("https://rest.bandsintown.com/artists/" + name + "/events?app_id=289222e4a5ee7badfabfa3a51b8b9c09", function (error, response, body) {
            if (error) {
                console.log(error);
            } else if (!error && response.statusCode === 200) {
                var obj = JSON.parse(body);
                console.log(obj);
                for (var set in obj) {
                    var date = moment(obj[set].datetime).format("MM/DD/YYYY");
                    console.log("At " + obj[set].venue.name + " " + obj[set].venue.city + " " + date);
                }
            }
        })

    } else if (command === `spotify-this-song`) {

        spotify.search({ type: 'track', query: name, limit: 1 }, function (err, data) {
            if (err) {
                console.log(err);
                return;
            }
            data.tracks.items.forEach(element => {

                console.log("The Song name is: " + element.name);
                console.log("The Album name is: " + element.album.name);
                console.log("This is Artist's name: " + element.album.artists[0].name);
                console.log("A Preview URL is: " + element.album.external_urls.spotify);

            });
        })
    } else if (command === `movie-this`) {
        request("http://www.omdbapi.com/?t=" + name + "&y=&plot=short&apikey=trilogy", function (error, response, body) {
            if (name === "") {
                name = "Mr.Nobody"
            }
            if (!error && response.statusCode === 200) {
                console.log("The movie's Title is: " + JSON.parse(body).Title);
                console.log("The Year this movie came out is: " + JSON.parse(body).Year);
                console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
                console.log("The Rotten Tomatoes Rating of the movie.: " + JSON.parse(body).Ratings[1].Value);
                console.log("The Country where the movie was produced: " + JSON.parse(body).Country);
                console.log("The Language of the movie: " + JSON.parse(body).Language);
                console.log("The Plot of the movie: " + JSON.parse(body).Plot);
                console.log("The Actors in the movie: " + JSON.parse(body).Actors);
            }
        })
    } else if (command === `do-what-it-says`) {

    }
})