const express = require('express');
const app = express();
const port = 3000;
const articles = [{ title: 'Example:' }];
const bodyParser = require('body-parser');
const Article = require('../model/db').Article;

// json and form encoded(default) bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//  gets all
app.get('/articles', (req, res, next) => {
  Article.all((err, articles) => {
    if (err) return next(err)
    res.send(articles);
  })
  
});

/* creates one -- replace this function
app.post('/articles', (req, res, next) => {
  const article = { title: req.body.title };
  Article.push(err, article) => { // add to articles array
  
    res.status(200).send('Ok added ' + article + '\n');

});
*/


// gets a single article
app.get('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  Article.find(id, (err, article) => {
    if (err) return next(err)
    console.log('Fetching:', id);
    res.send(article);
  })
});

app.delete('/articles/:id', (req, res, next) => {
  const id = req.params.id;
  Article.delete(id, (err, article) => {
    if (err) return next(err)
    console.log('Deleting:', id);
    res.send({ message: 'Deleted' });
 })
})


app.listen(port, () => {
  console.log('Started express web app at localhost:' + port);
});
