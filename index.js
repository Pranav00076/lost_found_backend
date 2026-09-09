const express = require("express")
const fs = require("fs")
const path = require("node:path")

const itemFilePath = path.join(__dirname,"./database/items.json")

const items = [
    {
  "id": "a3f2c1",
  "itemName": "Black leather wallet",
  "type": "lost",
  "place": "Library",
  "date": "2026-09-05",
  "contact": "zeeshan@college.edu",
  "status": "open"
}
]

const app = express();

app.use(express.json())

app.use(express.static('./public'))

app.post('/api/items', (req,res) => {
    const {itemName, type, place, date, contact} = req.body;

    if (!itemName || !type || !place || !date || !contact){
        res.status(400).json({"error" : "Missing itemName or type or place or date or contact"})
        return 
    } else if (type != 'lost' && type != "found"){
        res.status(400).json({"error" : "Type should be lost or found"})
        return 
    }
    let obj = {
        id : (Date.now()).toString,
        itemName : itemName,
        type : type,
        place : place,
        date : date,
        contact : contact,
        status : "open"
    }

    let arr = JSON.parse(fs.readFileSync(itemFilePath, 'utf-8'))

    arr.push(obj)

    let toWrite = JSON.stringify(arr)

    fs.writeFile(itemFilePath, toWrite, (err) => {
        res.status(500).json({"Error" : "Error while posting"})
        return
    })

    res.status(201).json(obj)

})

app.get('/api/items', (req,res) => {
    const {type, status, place} = req.query;

    let arr = [...items]


    arr = type ? arr.filter(x => x.type == type) : arr

    arr = status ? arr.filter(x => x.status == status) : arr

    arr = place ? arr.filter(x => x.place == place) : arr

    arr = arr.sort((a,b) => a.id - b.id)

    res.status(200).json(arr)
})

app.put("/api/items/:id", (req,res) => {

    const itemId = req.params.id;

    const {itemName, type, place, date, contact} = req.body;

    let arr = JSON.parse(fs.readFileSync(itemFilePath, 'utf-8'))

    let newObj = {
        itemName : itemName,
        type: type,
        place : place,
        date : date,
        contact : contact,
    }

    const updatedArr = arr.map((item) => {
        if (item.id === id) {
        return {
            ...item,
            ...newObj,
        };
        }
    
    let toWrite = JSON.stringify(updatedArr)

    fs.writeFile(itemFilePath, toWrite, (err) => {
        res.status(501).json({"Error" : "Error while Updating"})
        return
    })

    res.status(201).json(newObj)
  });
})



app.listen(8080, () => {
    console.log("Server Started on 8080")
})