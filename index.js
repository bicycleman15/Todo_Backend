import express from 'express'
import bodyParser from 'body-parser';
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

import database from './database'

var id_gen = 0;

app.get('/',(req,res) => {
    res.send("Hello, This is the root page!!")
})

app.get('/api',(req,res) => {
    return res.status(200).json({
        success : true,
        message : "query successful",
        data : database
    });
})

app.post('/api',(req,res) => {
    
    const item = req.body;

    if(!item.title) {
        return res.status(400).json({
            success : false,
            message : "title empty"
        });
    }

    if(!item.description) {
        return res.status(400).json({
            success : false,
            message : "description empty"
        });
    }

    const new_item = {
        title : item.title,
        description : item.description,
        id : id_gen
    }

    id_gen += 1;

    database.push(new_item)

    return res.status(200).json({
        success : true,
        message : "to do added",
        data : database
    });

})

app.post('/api/:id',(req,res) => {
    
    const x = req.params.id;
    var i = 0; var found = false;
    for(;i<database.length;i++) {
        if(x == database[i].id) {
            found = true;
            break;
        }
    }

    if(found == false) {
        return res.json({
            success : false,
            message : "Not Found",
        }) 
    }

    const item = req.body;

    if(!item.title) {
        return res.status(400).json({
            success : false,
            message : "title empty"
        });
    }

    if(!item.description) {
        return res.status(400).json({
            success : false,
            message : "description empty"
        });
    }

    database[i].title = item.title; database[i].description = item.description;

    return res.status(200).json({
        success : true,
        message : "data updated",
        data : database[i]
    });
})

app.get('/api/:id',(req,res) => {
    
    const x = req.params.id;
    for(var i=0;i<database.length;i++) {
        if(x == database[i].id) {
            return res.status(200).json({
                success : true,
                message : "Found",
                data : database[i]
            })
        }
    }

    return res.json({
        success : false,
        message : "Not Found",
    })

})

app.post('/api/delete/:id',(req,res) => {
    const x = req.params.id;
    var i = 0; var found = false;
    for(;i<database.length;i++) {
        if(x == database[i].id) {
            found = true;
            break;
        }
    }

    if(found == false) {
        return res.json({
            success : false,
            message : "Not Found",
        }) 
    }

    database.splice(i,1);

    return res.status(200).json({
        success : true,
        message : "Deleted successfully",
        data : database[i]
    })

})

const PORT = 3000

app.listen(PORT, () => {
    console.log("server running on port " + PORT)
  });