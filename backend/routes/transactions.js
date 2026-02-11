const express = require("express");
const Transaction = require("../models/transaction");

const router = express.Router();

// CREATE
router.post("/", async (pyynto, vastaus) => {
    try {
        const luotu_transaktio = await Transaction.create(pyynto.body);
        vastaus.status(201).json(luotu_transaktio);
    } catch (err) {
        vastaus.status(400).json({message: "Validation error", error: String(err)});
    }
});

// READ
router.get("/", async (pyynto, vastaus) => {
    try {
        const transaktiolista = await Transaction.find().sort({ date: -1, createdAt: -1 });
        vastaus.json(transaktiolista);
    } catch (err) {
        vastaus.status(500).json({ message: "Read error", error: String(err) });
    }
});

// UPDATE
router.put("/:id", async (pyynto, vastaus) => {
    try {
        const paivitetty = await Transaction.findByIdAndUpdate(pyynto.params.id, pyynto.body, {
            new: true, runValidators: true,
        });
        if (!paivitetty) return vastaus.status(404).json({ message: "No eipä löydy!"});
        vastaus.json(paivitetty);
    } catch(err) {
        vastaus.status(400).json({ message: "Update error", error: String(err) });
    }
});
// DELETE
router.delete("/:id", async (pyynto, vastaus) => {
    const poistettu = await Transaction.findByIdAndDelete(pyynto.params.id);
    if(!poistettu) return vastaus.status(404).json({message: "No eipä löytynyt!"});
    vastaus.status(204).send();
});

module.exports = router;