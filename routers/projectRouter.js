const express = require("express");
const router = express();
const projectModel = require("../data/helpers/projectModel");

// GET, POST, PUT, DELETE

router.get("/", (req, res) => {
  projectModel
    .get()
    .then((dbRes) => {
      res.status(200).json(dbRes).end();
    })
    .catch((err) =>
      res.status(500).json({ message: "Internal server error." }).end()
    );
});

router.get("/:id", validateProjectId, (req, res) => {
  res.status(200).json(res.project).end();
});

router.post("/", validateProject, (req, res) => {
  projectModel
    .insert(req.body)
    .then((dbRes) => {
      res.status(201).json(dbRes).end();
    })
    .catch((err) =>
      res.status(500).json({ message: "Internal server error." }).end()
    );
});

router.put("/:id", validateProject, validateProjectId, (req, res) => {
  projectModel
    .update(req.params.id, req.body)
    .then((dbRes) => {
      res.status(200).json(dbRes).end();
    })
    .catch((err) =>
      res.status(500).json({ message: "Internal server error." })
    );
});

router.delete("/:id", validateProjectId, (req, res) => {
  projectModel
    .remove(req.params.id)
    .then((dbRes) => {
      res.status(200).send("Item deleted successfully!").end();
    })
    .catch((err) =>
      res.status(500).json({ message: "Internal server error." }).end()
    );
});

// CUSTOM MIDDLEWARE

function validateProject(req, res, next) {
  if (!req.body)
    res.status(400).json({ message: "Request missing body." }).end();
  else if (!req.body.name)
    res.status(400).json({ message: "Missing name value." }).end();
  else if (!req.body.description)
    res.status(400).json({ message: "Missing description value." }).end();
  else next();
}

function validateProjectId(req, res, next) {
  if (!req.params.id)
    res.status(400).json({ message: "URL missing id." }).end();
  else
    projectModel
      .get(req.params.id)
      .then((dbRes) => {
        if (!dbRes) {
          res
            .status(404)
            .json({ message: "Item for that id does not exist." })
            .end();
        } else {
          res.project = dbRes;
          next();
        }
      })
      .catch((err) =>
        res.status(500).json({ message: "Internal server error." }).end()
      );
}

module.exports = router;
