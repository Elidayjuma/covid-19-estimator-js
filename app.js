const express = require('express');
const cors = require('cors');


const covidRoutes = require('./API/route');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/on-covid-19', covidRoutes);


app.post('/', async (req, res) => {
  res.json({
    messsage: 'Hello from the server'
    // transactionCode
  });
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on Port ${PORT}`);
});
