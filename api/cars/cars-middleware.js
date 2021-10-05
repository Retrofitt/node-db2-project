const Cars = require('./cars-model')
const vinValidator = require('vin-validator')


const checkCarId = async (req, res, next) => {
  try{
    const car = await Cars.getById(req.params.id)
    if(!car){
      res.status(404).json({
        message: `Car with id ${req.params.id} is not found`
      })
    }else{
      next()
    }
  }catch (err){
    res.status(err.status || 500).json({
      customMessage:"An error has occurred",
      message: err.message,
      stack: err.stack
    })
  }
}

const checkCarPayload = (req, res, next) => {
  const {vin, make, model, mileage} =  req.body
  if(!vin){
    res.status(400).json({
      message: "vin is missing"
    })
  }if(!make){
    res.status(400).json({
      message: "make is missing"
    })
  }if(!model){
    res.status(400).json({
      message: "model is missing"
    })
  }if(!mileage){
    res.status(400).json({
      message: "mileage is missing"
    })
  }else{
    next()
  }
}

const checkVinNumberValid = (req, res, next) => {
  const {vin} = req.body
  const isValidVin = vinValidator.validate(vin)
  if(isValidVin){
    next()
  }else{
    res.status(400).json({
      message: `vin ${vin} is invalid`
    })
  }
}

const checkVinNumberUnique = async (req, res, next) => {
  const {vin} = req.body
  const cars = await Cars.getAll()
  const unique = cars.filter(cars=>cars.vin === vin)
  if(unique.length < 1){
    next()
  }else{
    res.status(400).json({
      message: `vin ${vin} already exists`
    })
  }
}

module.exports = {
  checkCarId, 
  checkCarPayload, 
  checkVinNumberValid, 
  checkVinNumberUnique
}
