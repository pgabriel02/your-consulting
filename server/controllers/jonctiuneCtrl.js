module.exports = db => {
    return {
      create: (req, res) => {
        db.models.Jonctiune.findOrCreate({where: {id_person: req.body.id_person, id_car: req.body.id_car}}).then(() => {
          res.send({ success: true });
        }).catch((err) => {
            console.log(err)
            res.status(401)
        });
      },
  
      update: (req, res) => {
        db.models.Jonctiune.update(req.body, { where: { id: req.body.id } }).then(() => {
          res.send({ success: true })
        }).catch(() => res.status(401));
      },
  
      find: (req, res) => {
        db.query(`SELECT j.id_person, j.id_car, "m"."Denumire_marca", "m"."Denumire_model", "m"."Anul_fabricatiei", "m"."Capacitate_cilindrica", "m"."Taxa_de_impozit"
        FROM "Jonctiune" as j INNER JOIN "Masini" as m on j.id_car = "m".id  WHERE id_person = ${req.params.id}`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch((err) => {
            console.log(err)
            res.status(401)
        });
      },
      destroy: (req, res) => {
        db.query(`DELETE FROM "Jonctiune" WHERE id_person = ${req.params.id} AND id_car = ${req.params.car}`, { type: db.QueryTypes.DELETE }).then((data) => {
          res.send({ success: true });
        }).catch((err) => {
            console.log(err)
            res.status(401)
        });
      }
    };
  };
  