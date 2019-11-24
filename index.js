require("dotenv").config();

const API_KEY = process.env.LASTFM_API_KEY;
const AGENT = process.env.AGENT_NAME;

var LastFmNode = require("lastfm").LastFmNode;
var lastfm = new LastFmNode({
  api_key: API_KEY,
  useragent: AGENT
});

// https://www.last.fm/api/show/artist.search
lastfm.request("artist.search", {
    artist: 'john coltrane',
    format: 'json',
    handlers: {
        success: function(data) {
            console.log(data);
            console.log(data['results']['artistmatches']);
        },
        error: function(err) { console.error(err); }
    }
});

