'use strict'

const Attraction = require("../models/attraction.model")
const Schedule = require("../models/schedule.model")
const { findTourById } = require("../services/tour.service")

class ScheduleController {
    createSchedule = async(req, res, next) => {
        try {
            const tour_id = req.body.tour_id
            const tour = await findTourById(tour_id)
            if (!tour) return res.status(404).json({ message: "Not found tour for creating schedule!" })

            const schedule_detail = req.body.schedule_detail

            console.log(`detail`, schedule_detail)
            for (const schedule of schedule_detail) {
                for (const detail of schedule.detail) {
                    const name = detail.name;

                    const attraction = await Attraction.findOne({ where: { name: name }})
                    if (!attraction) return res.status(404).json({ message: "Not found attraction in tour!" })
                    attraction.note = detail.note;
                    attraction.description = detail.description;
                    await attraction.save()
                }
            }
            const new_schedule = await Schedule.create({
                schedule_detail: JSON.parse(JSON.stringify(schedule_detail)),
                tour_id: tour_id
            })
            return res.status(201).json({ 
                data: new_schedule,
                message: "Create schedule for tour successfully! "
            })
            
        } catch(error) {
            return res.status(500).json({ message: error.message })
        }
    }
}

module.exports = new ScheduleController()