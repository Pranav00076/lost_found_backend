const express = require("express");
const fs = require("fs");
const path = require("node:path");
const cors = require("cors")
const PORT = process.env.PORT || 8080;

const itemFilePath = path.join(__dirname, "./database/items.json");

const app = express();

app.use(cors());

app.use(express.json());

// POST

app.post("/api/items", (req, res) => {
  if (!req.body) {
    res.status(400).json({ error: "Invalid Body" });
    return;
  }

  const { itemName, type, place, date, contact } = req.body;

  if (!itemName || !type || !place || !date || !contact) {
    res
      .status(400)
      .json({ error: "Missing itemName or type or place or date or contact" });
    return;
  } else if (type != "lost" && type != "found") {
    res.status(400).json({ error: "Type should be lost or found" });
    return;
  }
  let obj = {
    id: Date.now(),
    itemName: itemName,
    type: type,
    place: place,
    date: date,
    contact: contact,
    status: "open",
  };

  let arr = JSON.parse(fs.readFileSync(itemFilePath, "utf-8"));

  arr.push(obj);

  let toWrite = JSON.stringify(arr);

  fs.writeFile(itemFilePath, toWrite, (err) => {
    if (err) {
      return res.status(500).json({
        error: "Error while posting",
      });
    }

    return res.status(201).json(obj);
  });
});

// GET ALL

app.get("/api/items", (req, res) => {
  const { type, status, place } = req.query;

  let arr = JSON.parse(fs.readFileSync(itemFilePath, "utf-8"));

  arr = type ? arr.filter((x) => x.type == type) : arr;

  arr = status ? arr.filter((x) => x.status == status) : arr;

  arr = place ? arr.filter((x) => x.place == place) : arr;

  arr = arr.sort((a, b) => a.id - b.id);

  res.status(200).json(arr);
});

// GET SINGLE

app.get("/api/items/:id", (req, res) => {
  let itemId = req.params.id;

  let arr = JSON.parse(fs.readFileSync(itemFilePath, "utf-8"));

  let obj = arr.find((x) => x.id == itemId);

  if (!obj) {
    res.status(404).json({ error: "Item Not Found" });
    return;
  }

  res.json(obj);
});

// PUT

app.put("/api/items/:id", (req, res) => {
  const itemId = req.params.id;

  if (!itemId) {
    res.status(400).json({ error: "Item Id param not found" });
    return;
  }

  if (!req.body) {
    res.status(400).json({ error: "Invalid Body" });
    return;
  }

  const { itemName, type, place, date, contact } = req.body;

  let arr = JSON.parse(fs.readFileSync(itemFilePath, "utf-8"));

  let itemObj = arr.find((x) => x.id == itemId);

  if (!itemObj) {
    res.status(404).json({ error: `Id: ${itemId} not Found` });
    return;
  }

  let newObj = {
    itemName: itemName,
    type: type,
    place: place,
    date: date,
    contact: contact,
  };

  let updatedArr = arr.map((item) => {
    if (item && item.id == itemId) {
      return {
        ...item,
        ...newObj,
      };
    }

    return item;
  });

  let toWrite = JSON.stringify(updatedArr);

  fs.writeFile(itemFilePath, toWrite, (err) => {
    if (err) {
      return res.status(500).json({
        error: "Error while Updating",
      });
    }

    return res.status(200).json({
      ...itemObj,
      ...newObj,
    });
  });
});

// PATCH CLAIM

app.patch("/api/items/:id/claim", (req, res) => {
  let itemId = req.params.id;

  if (!itemId) {
    res.status(400).json({ error: "Item Id param not found" });
    return;
  }

  let arr = JSON.parse(fs.readFileSync(itemFilePath, "utf-8"));

  let itemObj = arr.find((x) => x.id == itemId);

  if (!itemObj) {
    res.status(404).json({ error: `Id: ${itemId} not Found` });
    return;
  } else {
    if (itemObj.status == "claimed") {
      res.status(409).json({ error: "Item already Claimed" });
      return;
    }
  }

  let updatedobj = {};

  let updatedArr = arr.map((item) => {
    if (item && item.id == itemId) {
      updatedobj = {
        ...item,
        status: "claimed",
      };

      return updatedobj;
    }

    return item;
  });

  let toWrite = JSON.stringify(updatedArr);

  fs.writeFile(itemFilePath, toWrite, (err) => {
    if (err) {
      return res.status(500).json({
        error: "Error while Patch",
      });
    }

    return res.status(200).json(updatedobj);
  });
});

app.delete("/api/items/:id", (req, res) => {
  let itemId = req.params.id;

  if (!itemId) {
    res.status(400).json({ error: "Item Id param not found" });
    return;
  }

  let arr = JSON.parse(fs.readFileSync(itemFilePath, "utf-8"));

  let itemObj = arr.find((x) => {
    if (x) {
      return x.id == itemId;
    }
  });

  if (!itemObj) {
    res.status(404).json({ error: `Id: ${itemId} not Found` });
    return;
  }

  let updatedArr = arr.filter((x) => x.id != itemId);

  let toWrite = JSON.stringify(updatedArr);

  fs.writeFile(itemFilePath, toWrite, (err) => {
    if (err) {
      return res.status(500).json({
        error: "Writing Error while Deleting",
      });
    }

    return res.status(204).send();
  });
});


app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server Started on ${PORT}`);
});