module.exports = db => {
    return {
      create: (req, res) => {
        db.models.Persoane.create(req.body).then((result) => {
          res.send({rowId: result.dataValues.id});
        }).catch((err) => {
            console.log(err)
            res.status(401)
        });
      },
  
      update: (req, res) => {
        db.models.Persoane.update(req.body, { where: { id: req.body.id } }).then(() => {
          res.send({ success: true })
        }).catch((err) => {
            console.log(err)
            res.status(401)
        });
      },
  
      findAll: (req, res) => {
        db.query(`SELECT *
        FROM "Persoane"
        ORDER BY id`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch(() => res.status(401));
      },
  
      find: (req, res) => {
        db.query(`SELECT * FROM "Persoane" WHERE id = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp[0]);
        }).catch((err) => {
            console.log(err)
            res.status(401)
        });
      },
  
      destroy: (req, res) => {
        db.query(`DELETE FROM "Persoane" WHERE id = ${req.params.id}`, { type: db.QueryTypes.DELETE }).then(() => {
          res.send({ success: true });
        }).catch((err) => {
            console.log(err)
            res.status(401)
        });
      }
    };
  };
  