const express = require("express");
// const fs = require("fs");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const db = process.env.DATABASE;

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(con => {
    console.log(con.connections);
    console.log("DB connection successful");
  });

const app = express();
//middle weres
app.use(express.json());

//Own created middle were.
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(morgan("tiny"));

//Route Handelers
// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/data/simple-tours.json`, "utf-8")
// );

//define Schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String
  },
  price: {
    type: String
  },
  rating: {
    type: Number
  }
});

const Tour = mongoose.model("Tour", tourSchema);

const getAllTours = async (req, res) => {
  try {
    const tours = await Tour.find();
    res.status(201).json({
      status: "success",
      data: tours
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

const getTourByID = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: "success",
      data: tour
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};
const updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });
    res.status(200).json({
      status: "success",
      data: tour
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

const createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body, {
      new: true
    });
    res.status(201).json({
      status: "success",
      data: newTour
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

const deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err
    });
  }
};

//Routes
app
  .route("/api/v1/tours")
  .get(getAllTours)
  .post(createTour);
app
  .route("/api/v1/tours/:id")
  .get(getTourByID)
  .patch(updateTour)
  .delete(deleteTour);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Listening to port 3000...");
});
