const express = require('express');
const app = express();
const port = 3000;
const articles = [{ title: 'Example:' }];
const bodyParser = require('body-parser');
const Article = require('../model/db').Article;
const read = require('node-readability');

// json and form encoded(default) bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// load bootstrap css
app.use('/css/bootstrap.css', express.static('../node_modules/bootstrap/dist/css/bootstrap.css'));

//  gets all
app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err);
    // format response using express render
    res.format({
      html: () => {
        res.render('articles.ejs', { articles: articles });
      },
      json: () => {
        res.send(articles);
      }
    });
  });
});

//pulls data from url than created article

app.post('/articles', (req, res, next) => {
  const url = req.body.url;
  read(url, (err, result) => {
    if (err || !result) res.status(500).send('Error retrieving article \n');
    Article.create({ title: result.title, content: result.content }, (err, article) => {
      if (err) return next(err);
      res.status(200).send('OK Added ' + url + '\n');
    });
  });
});

// gets a single article
app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  Article.find(id, (err, article) => {
    if (err) return next(err);
    console.log('Fetching:', id);
    res.format({
      html: () => {
        res.render('articles.ejs', { articles: articles });
      },
      json: () => {
        res.send(articles);
      }
    });
  });
});

app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  Article.delete(id, (err, article) => {
    if (err) return next(err);
    console.log('Deleting:', id);
    res.send({ message: 'Deleted' });
  });
});

app.listen(port, () => {
  console.log('Started express web app at localhost:' + port);
});
