const express = require("express");
const router = express();
const actionModel = require("../data/helpers/actionModel");
const projectModel = require("../data/helpers/projectModel");

// GET, POST, PUT, DELETE

router.get("/", (req, res) => {
  actionModel
    .get()
    .then((dbRes) => res.status(200).json(dbRes).end())
    .catch((err) =>
      res.status(500).json({ message: "Internal server error." }).end()
    );
});

router.get("/:id", validateActionId, (req, res) => {
  res.status(200).json(res.action).end();
});

router.post("/", validateProjectExists, validateAction, (req, res) => {
  actionModel
    .insert(req.body)
    .then((dbRes) => res.status(201).json(dbRes).end())
    .catch((err) =>
      res.status(500).json({ message: "Internal server error." }).end()
    );
});

router.put("/:id", validateProjectExists, validateAction, (req, res) => {
  actionModel
    .update(req.params.id, req.body)
    .then((dbRes) => res.status(200).json(dbRes))
    .catch((err) =>
      res.status(500).json({ message: "Internal server error." }).end()
    );
});

// CUSTOM MIDDLEWARE

function validateProjectExists(req, res, next) {
  if (!req.body.project_id)
    res.status(400).json({ message: "Missing project_id value." }).end();
  else
    projectModel
      .get(req.body.project_id)
      .then((dbRes) => {
        if (!dbRes)
          res
            .status(404)
            .json({ message: "No project exists for the provided project_id." })
            .end();
        else next();
      })
      .catch((err) =>
        res.status(404).json({ message: "Internal server error." })
      );
}

function validateAction(req, res, next) {
  if (!req.body)
    res.status(400).json({ message: "Request missing body." }).end();
  else if (!req.body.description)
    res.status(400).json({ message: "Missing description value." }).end();
  else if (req.body.description.length > 128)
    res
      .status(400)
      .json({
        message:
          "Description value too long. Can only be up to 128 characters.",
      })
      .end();
  else if (!req.body.notes)
    res.status(400).json({ message: "Missing notes value." }).end();
  next();
}

function validateActionId(req, res, next) {
  if (!req.params.id) res.status(400).json({ message: "URL missing id." }).end;
  else
    actionModel.get(req.params.id).then((dbRes) => {
      if (!dbRes) {
        res
          .status(404)
          .json({ message: "Item for that id does not exist." })
          .end();
      } else {
        res.action = dbRes;
        next();
      }
    });
}

module.exports = router;
