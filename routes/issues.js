const { default: axios } = require("axios");
var express = require("express");
const Issue = require("../models/issue_model");
const issues_validator = require("../validators/issues_validator");
var router = express.Router();

/* POST array of strings to and endpoind and return ok */

router
  .get("/issues", async function (req, res, next) {
    let issues = [];
    try {
      issues = await Issue.find(req.query, null, { sort: { index: 1 } });
    } catch (err) {
      if (err) {
        res.status(500).json({ status: "error", message: err.message });
        return;
      }
    }
    res.render("issues", { issues: issues, count: issues.length });
  })
  .post("/issues", function (req, res, next) {
    req.body.issues.reverse().forEach(async ({ hash, key }, index) => {
      try {
        if (key === "" || key === undefined) {
          return;
        }
        // Search Key on Jira
        const response = await axios.get(
          `https://bucksapp.atlassian.net/rest/api/3/issue/${key}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
            auth: {
              username: "raul@bucksapp.co",
              password: "KAOoO7WLlm2ZKb9stD4JB53E",
            },
          }
        );
        const issue = new Issue({
          index: index,
          hash: hash,
          key: key,
          status: response.data.fields.status.name,
          fixVersion: response.data.fields.fixVersions.map( (version) => version.name).join(", ")
        });
        issue.save();
      } catch (err) {
        if (err) {
          res.status(500).json({ status: "error", message: err.message });
          return;
        }
      }
    });
    res.json({ status: "ok" });
  });
/* GET issue by key */
router.get("/issues/:key", async function (req, res, next) {
  try {
    const issue = await Issue.findOne({ key: req.params.key });

    const response = await axios.get(
      `https://bucksapp.atlassian.net/rest/api/3/issue/${issue.key}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "raul@bucksapp.co",
          password: "KAOoO7WLlm2ZKb9stD4JB53E",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    if (err) {
      res.status(500).json({ status: "error", message: err.message });
      return;
    }
  }
});

/* DELETE all issues */
router.delete("/issues", function (req, res, next) {
  Issue.deleteMany({}, function (err) {
    if (err) {
      res.status(500).json({ status: "error", message: err.message });
      return;
    }
    res.json({ status: "ok" });
  });
});

/* POST array of issues and update the existing issues */
router.post("/issues/jira", function (req, res, next) {
  req.body.jira.forEach(({ key, version, status }) => {
    console.log("key: " + key + " version: " + version + " ");
    Issue.updateMany(
      { issue: key },
      {
        fixVersion: version,
        status: status,
      },
      function (err, doc) {
        if (err) {
          console.log(err);
        }
      }
    );
  });

  res.json({ status: "ok" });
});

module.exports = router;
