require("dotenv").config();

const API_KEY = process.env.LASTFM_API_KEY;
// const API_SECRET = process.env.LASTFM_API_KEY;
const AGENT = 'query scrobles';
const queryUsername = process.env.LASTFM_USER;

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./songs.sqlite');

// Databsae setup
db.serialize(function() {
    db.run("CREATE TABLE IF NOT EXISTS song (artist TEXT, ablum TEXT, song TEXT, timestamp INT, page INT)");
});

var LastFmNode = require('lastfm').LastFmNode;
var lastfm = new LastFmNode({
    api_key: API_KEY,
    // secret: API_SECRET,
    useragent: AGENT // optional. defaults to lastfm-node.
});

function recentTracksSuccessHandler(data) {
    let page = data.recenttracks['@attr']['page']
    var mapped = data.recenttracks.track.map(track => {
        try {
            if (!track.date) {
                return null;
            }
            return {
                date: parseInt(track.date.uts),
                artist: track.artist['#text'],
                artistId: track.artist['mbid'],
                album: track.album['#text'],
                albumId: track.album['mbid'],
                name: track.name
            };
        } catch(e) {
            console.log(e);
            console.log("parse error")
            console.log(track);
            throw "error";
        }
    });

    var stmt = db.prepare("INSERT INTO song VALUES (?, ?, ?, ?, ?)");
    mapped.filter(t => t !== null).forEach(track => {
        stmt.run(track.artist, track.album, track.name, track.date, page);
    })
    stmt.finalize();

}

function fetchSongsForPage(page) {
    var req = lastfm.request("user.getRecentTracks", {
      user: queryUsername,
      format: "json",
      page: page,
      limit: 200,
      handlers: {
        success: recentTracksSuccessHandler,
        error: function(err) {
          console.error(err);
        }
      }
    });
}

// Query the database for the hightest pagenumber we already have and
// fetch the next page
db.each("SELECT max(page) as maxpage from song", function(err, row) {
  let page = (row.maxpage || 0) + 1;
  console.log("Fetching for ", page);
  fetchSongsForPage(page);
});
