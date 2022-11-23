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
        db.query(`SELECT p.id, p.Nume, p.Prenume, p."CNP", p."Varsta", j.id_person, ARRAY_AGG("Denumire_marca" || ' ' ||  "Denumire_model") Denumire_masina, ARRAY_AGG(m.id) id_masini,
        ARRAY_AGG("Anul_fabricatiei") Anul_fabricatiei, ARRAY_AGG("Capacitate_cilindrica") Capacitate_cilindrica, ARRAY_AGG("Taxa_de_impozit") Taxa_de_impozit
        FROM "Persoane" as p LEFT JOIN "Jonctiune" as j on p.id = j.id_person left join "Masini" as m on m.id = j.id_car  GROUP BY j.id_person, p.Nume, p.id, p."CNP", p.Prenume, p."Varsta"
        ORDER BY p.id`, { type: db.QueryTypes.SELECT }).then(resp => {
          res.send(resp);
        }).catch((err) => {
          console.log(err)
          res.status(401)
        });
      },
  
      find: (req, res) => {
        db.query(`SELECT p.id, j.id_person, p.Nume, p.Prenume, p."CNP", ARRAY_AGG(j.id_car) id_masini FROM "Persoane" as p left join "Jonctiune" as j on j.id_person = p.id WHERE p.id = ${req.params.id} GROUP BY p.id, j.id_person, p.Nume, p.Prenume `, { type: db.QueryTypes.SELECT }).then(resp => {
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
  