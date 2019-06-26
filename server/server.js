const express = require('express');
const request = require('request');
const path = require('path');

const app = express();

const publicPath = path.resolve(__dirname, '../public');
const port = process.env.PORT || 3000;

require('dotenv').load();

app.use(express.static(publicPath));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/spotifyToken/', (req, resp) => {
  let client_id = req.params.client_id;
  let client_secret = req.params.client_secret;
  let spotifyUrl = 'https://accounts.spotify.com/api/token';

  var authOptions = {
    url: spotifyUrl,
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(
          process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET
        ).toString('base64')
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  request.post(authOptions, (err, httpResponse, body) => {
    if (err) {
      return resp.status(400).json({
        ok: false,
        mensaje: 'Cannot obtain token',
        err
      });
    }

    resp.json(body);
  });
});

app.listen(port, err => {
  if (err) throw new Error(err);

  console.log(`Server running on port: ${port}`);
});
