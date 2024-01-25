'use strict'

const Tour = require("../models/tour.model")
const jwt = require("jsonwebtoken")

class TourController {

    createTour = async (req, res, next) => {
        // const access_token = req.headers['authorization']
        // const decodeUser = jwt.decode(access_token)
        // const role_user = decodeUser['role_user']
        // if (role_user !== 'admin') 
        //     return res.status(401).json({ Message: "Unauthorized for creating tour!"})

        const { name, max_customer, departure_date, departure_time, departure_place, destination_place,
                time, price, highlight, note, description, deadline_book_time } = req.body;

        // const cover_image = req.file.filename

        const parts = deadline_book_time.split('-');
        const parsedDeadlineBookTime = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);

        const newTour = new Tour({
            name, max_customer, departure_date, departure_time, departure_place, destination_place,
            time, price, highlight, note, description, deadline_book_time: parsedDeadlineBookTime,
            current_customers: 0
        })

        const savedTour = await newTour.save().catch((error) => {
            console.log(`error`, error)
            return res.status(400).json({ Message: "Can't save tour"})
        })

        return res.status(200).json({
            message: "Create tour successfully!",
            data: savedTour
        })
    }

    updateTour = async (req, res, next) => {
        const tour_id = req.params.tour_id;
        const updated_tour = req.body;

        const tour = await Tour.findOne({ where: { tour_id }})
        if (!tour) return res.status(404).json({ Message: "Not found tour"})

        const result = await Tour.update(updated_tour, {
            where: { tour_id }
        })
        if (!result) 
            return res.status(400).json({ Message: "Update fail!"})
        return res.status(200).json({Message: "Update tour successfully!"})
    }

    getTour = async (req, res, next) => {
        try {
            const tour_id = req.params.tour_id;
            const tour = await Tour.findOne({
                where: { tour_id },
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                }
            })
            if (!tour) return res.status(404).json({ Message: "Not found tour" })
            return res.status(200).json({ 
                data: tour
            })
        } catch (error) {
            console.log(error)
            return res.status()
        }
    }

    getAllTours = async (req, res, next) => {
        try {
            const all_tours = await Tour.findAll({
                attributes: {
                    exclude: ['updatedAt', 'createdAt']
                }
            })

            return res.status(200).json({
                data: all_tours
            })
        } catch (error) {
            return res.status(404).json({ Message: error + "1"})
        }
    }

    deleteTour = async (req, res, next) => {
        try {
            const tour_id = req.params.tour_id
            const tour = await Tour.findOne({ where : { tour_id }})
            if (!tour) return res.status(404).json({ Message: "Not found tour!"})

            await tour.destroy()
            return res.status(200).json({ Message: "Delete tour successfully"})
        } catch (error) {
            return res.status(400).json({ Message: error})
        }
    }
}

module.exports = new TourController()