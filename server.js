const express = require('express');
const app = express();

app.set('view', `${__dirname}/dist/`);
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', express.static(`${__dirname}/dist/`));

app.get('/', (req, res) => {
  res.render('index', {});
});

const server = app.listen(5020, () => {
  console.log('Express listening on port: ' + server.address().port);
});
