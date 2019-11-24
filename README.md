Testing Last-Fm Access
======================

Demo and test scripts for last-fm access.

Install
-------

Sign-up for a key at http://www.last.fm/api

Copy the `.env_example` to `.env`, substituting your configuration.

    # Install requried packages
    npm install

Contents
--------

`index.js` - example for an artist search

    node index.js

`fetchSongs.js` - queries the plays/song-scrobbles of a lastfm user, one page
                per run. the songs are stored in a sqlite database.

    node fetchSongs.js