const Service = require("../models/service-model");

const services = async (req, res) => {
  try {
    const response = await Service.find();
    res.status(200).json({ msg: response ?? [] });
  } catch (error) {
    console.error("Failed to fetch services", error);
    res.status(500).json({ message: "Unable to fetch services" });
  }
};

module.exports = services;
