//IMPORTS
require("dotenv").config();
var Twit = require("twit");
var fs = require("fs"),
  request = require("request");
var link = "https://source.unsplash.com/weekly?aesthetic";
//var link='https://picsum.photos/1920/1080?grayscale';

//Acceso a twitter
var T = new Twit({
  consumer_key: process.env.BOT_CONSUMER_KEY,
  consumer_secret: process.env.BOT_CONSUMER_SECRET,
  access_token: process.env.BOT_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true,
});

//Descarga de la imagen
function download(uri, filename, callback) {
  request.head(uri, function (err, res, body) {
    console.log("content-type:", res.headers["content-type"]);
    console.log("content-length:", res.headers["content-length"]);

    request(uri).pipe(fs.createWriteStream(filename)).on("close", callback);
  });
}

download(link, "foto.jpg", function () {
  console.log("imagen descargada");
  var b64content = fs.readFileSync("foto.jpg", { encoding: "base64" });
  T.post(
    "media/upload",
    { media_data: b64content },
    function (err, data, response) {
      if (err) {
        console.log("ERROR:");
        console.log(err);
      } else {
        console.log("imagen subida a TW");
        console.log("Now tweeting it...");

        T.post(
          "statuses/update",
          {
            media_ids: new Array(data.media_id_string),
          },
          function (err, data, response) {
            if (err) {
              console.log("ERROR:");
              console.log(err);
            } else {
              console.log("Imagen posteada!!");
            }
          }
        );
      }
    }
  );

  fs.unlinkSync("foto.jpg");
});
