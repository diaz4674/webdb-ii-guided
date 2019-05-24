const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/rolex.db3', //from the root folder
  },
  useNullAsDefault: true,
  debug: true
};

const db = knex(knexConfig);

//GET
router.get('/', (req, res) => {
  // get the roles from the database
  db('roles')
  .then(roles =>{
    res.status(200).json(roles)
  })
  .catch(err =>{
    console.log(err)
    res.status(500).json(err)
  })
});


//GET BY ID
router.get('/:id', (req, res) => {
  // retrieve a role by id
  db('roles').where({id: req.params.id})
    .first()
    .then(role => {
      if(role){
        res.status(200).json(role)
      } else {
        res.status(404).json({message: 'Role not found'})
      }
    })
    .catch(err =>{
      console.log(err)
      res.status(500).json(err)
    })
});

router.post('/', (req, res) => {
  if (!req.body.name){
    res.status(400).json({message: 'please provide a name'})
  } else{
  // add a role to the database
  db('roles').insert(req.body, 'id')
    .then(ids => {
      return db('roles').where({id: ids[0]})
      .first()
      .then(role => {
          res.status(200).json(role)
      })
      .catch(err =>{
        console.log(err)
        res.status(500).json(err)
      })
})
}
})

router.put('/:id', (req, res) => {
  // update roles
  db('roles').where({id: req.params.id}).update(req.body)
  .then(count => {
    if(count > 0) {
      res.status(200).json({message: `${count} record updataed.`})
    } else{
      res.status(404).json({message: 'Role doesnt exist'})
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

router.delete('/:id', (req, res) => {
  // remove roles (inactivate the role)
  db('roles').where({id: req.params.id}).del()
  .then(count => {
    if(count > 0) {
      res.status(200).json({message: `${count} record updataed.`})
    } else{
      res.status(404).json({message: 'Role doesnt exist'})
    }
  })
  .catch(err => {
    res.status(500).json(err)
  })
});

module.exports = router;
