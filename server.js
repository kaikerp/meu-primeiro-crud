const express = require('express');
const bodyParser = require('body-parser');
const { ObjectId } = require('mongodb');
const app = express();
const port = 8081;
const MongoClient = require('mongodb').MongoClient;



const uri = "mongodb+srv://kaikerp:<senha>@first-crud.rgxoi.gcp.mongodb.net/first-crud?retryWrites=true&w=majority";

// MongoClient.connect(uri, (err, client) => {
//     if (err) return console.log(err)
//     db = client.db('first-crud')
//   });

// insertMany
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(client => {
    db = client.db('first-crud');

    app.listen(8081, () =>{
        console.log(`the force is running on the port ${port}`)
    });
  });


  

app.use(bodyParser.urlencoded({ extended: true }));

// SET ENGINE
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index.ejs')
});

app.get('/', (req, res) => {
    let cursor = db.collection('data').find()
});

app.get('/show', (req, res) => {
    db.collection('data').find().toArray((err, results) => {
        if (err) return console.log(err)
        res.render('show.ejs', { data: results })

    });
});

app.post('/show', (req, res) => {
    db.collection('data').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('Salvo no Banco de Dados')
        res.redirect('/show')
    });
});

app.route('/edit/:id')
.get((req, res) => {
    var id = req.params.id
    // var ObjectId = require('mongodb').ObjectID;

    db.collection('data').find(ObjectId(id)).toArray((err, result) => {
        if (err) return res.send(err)
        res.render('edit.ejs', { data: result })
    })
})

.post((req, res) => {
    var id = req.params.id
    var name = req.body.name
    var surname = req.body.surname
    // var ObjectId = require('mongodb').ObjectID;
    
    db.collection('data').updateOne({_id: ObjectId(id)}, {
        $set: {
            name: name,
            surname: surname
        }
    }, (err, result) => {
        if (err) return res.send(err)
        res.redirect('/show')
        console.log('Atualizado no Banco de Dados')
    })
});

app.route('/delete/:id')
.get((req, res) => {
    var id = req.params.id

    db.collection('data').deleteOne({_id: ObjectId(id)}, (err, result) => {
        if (err) return res.send(500, err)
        console.log('Deletando do Banco de Dados!')
        res.redirect('/show')
    })

});




