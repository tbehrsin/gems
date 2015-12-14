
import express from 'express';
import path from 'path';

let app = express();


app.use('/', express.static(path.resolve(__dirname, '../../dist')));

app.listen(3000, function() {
  console.info('Listening on ' + 3000);
});
