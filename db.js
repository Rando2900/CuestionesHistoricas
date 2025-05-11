const mongoose = require('mongoose');

const uri = 'mongodb+srv://admin:admin@cuestioneshistoricas.yk69gma.mongodb.net/cuestioneshistoricas?retryWrites=true&w=majority';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch(err => console.error('Error al conectar a MongoDB Atlas:', err));

module.exports = mongoose;