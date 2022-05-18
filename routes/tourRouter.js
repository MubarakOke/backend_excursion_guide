const express= require('express')
const tourController= require('../controllers/tourController')
const authController = require('../controllers/authController')

const router= express.Router()

router
.route('/top-5-cheap')
.get(tourController.aliasTour, tourController.getTours)

router
.route('/tour-stat')
.get(tourController.aggregateStat)

router
.route('/')
.get(authController.protect, authController.restrictTo('admin', 'lead-guide'), tourController.getTours) 
.post(tourController.createTour)

router
.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.put(tourController.updateTour)
.delete(tourController.deleteTour)

module.exports= router

