'use strict'

const cloudinary = require("../utils/cloudinary")

const Tour = require("../models/tour.model")
const Sequelize = require("sequelize")
const Destination = require("../models/destination.model")
const Op = Sequelize.Op
const { checkExistDestination } = require("../services/destination.service")
const { checkExistAttraction } = require("../services/attraction.service")
const Attraction = require("../models/attraction.model")

const slugify = (text) => {
    return text.toString().toLowerCase()
        .replace(/\s+/g, '-')           // Replace space by -
        .replace(/[^\w\-]+/g, '')       // Loại bỏ ký tự không phải chữ cái, số, gạch ngang
        .replace(/\-\-+/g, '-')         // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
        .replace(/^-+/, '')             // Loại bỏ dấu gạch ngang ở đầu chuỗi
        .replace(/-+$/, '');            // Loại bỏ dấu gạch ngang ở cuối chuỗi
};

class TourController {

    createTour = async (req, res, next) => {
        // const access_token = req.headers['authorization']
        // const decodeUser = jwt.decode(access_token)
        // const role_user = decodeUser['role_user']
        // if (role_user !== 'admin') 
        //     return res.status(401).json({ Message: "Unauthorized for creating tour!"})
        
        const { name, max_customer, departure_date, departure_time, departure_place, destination_place,
                time, price, highlight, note, description, deadline_book_time } = req.fields; 
        
        const exist_destination = await checkExistDestination(destination_place);
        let dest_id
        if (!exist_destination) {
            const new_destination = await Destination.create({
                name: destination_place
            })

            dest_id = new_destination.destination_id;
        } else {
            dest_id = exist_destination.destination_id
        }
        const attractions = []
        let i = 0;
        while (req.fields[`attractions[${i}][name]`]) {
            const attraction_name = req.fields[`attractions[${i}][name]`]
            const exist_attraction = await checkExistAttraction(attraction_name, dest_id)
            if (!exist_attraction) {
                attractions.push({ name: attraction_name, destination_id: dest_id})
            }
            // attractions.push({ name: attraction_name, destination_id: dest_id})
            i++;
        }

            // if (attractions.length > 0) {
            //     await Promise.all(
            //         attractions.map(async (attraction) => {
            //             await Attraction.create(attraction)
            //         })
            //     )
            // }

        if (attractions && Array.isArray(attractions)) {
            await Promise.all(
                    attractions.map(async (attraction) => {
                    const { name, address } = attraction;
                    await Attraction.create(
                        { name, address, destination_id: dest_id },
                    );
                })
            );
        }
        
        const result = req.files.cover_image.path
        const link_cover_image = await cloudinary.uploader.upload(result)

        const newTour = await Tour.create({
            name, max_customer, departure_date, departure_time, departure_place, destination_place,
            time, price, highlight, note, description, deadline_book_time, destination_id: dest_id,
            cover_image: link_cover_image.secure_url, current_customers: 0
        },)

        

        if (!newTour)
            return res.status(400).json({ message: "Create tour fail!" })

        return res.status(200).json({
            message: "Create tour successfully!",
            data: newTour
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
            const exist_tour = await Tour.findByPk(tour_id, {
                include: [
                    {
                        model: Destination,
                        include: [{ 
                            model: Attraction, 
                            attributes: ['name'] 
                        }],
                    },
                ],
            });
            if (!exist_tour) return res.status(404).json({ Message: "Not found tour" });

            const attractions = await Attraction.findAll({
                where: { destination_id: exist_tour.destination_id }
            })

            console.log(`attractions`, attractions)

            const tour = {
                name: exist_tour?.name ?? null,
                cover_image: exist_tour.cover_image,
                description_place: exist_tour.description_place,
                current_customers: exist_tour.current_customers,
                max_customer: exist_tour.max_customer,
                departure_place: exist_tour.departure_place,
                departure_date: exist_tour.departure_date,
                destination: {
                    name: exist_tour.destination_place,
                    attractions: attractions.map(attraction => ({
                        name: attraction.name,
                    })),
                },
                departure_time: exist_tour.departure_time,
                deadline_book_time: exist_tour.deadline_book_time,
                price: exist_tour.price,
                highlight: exist_tour.highlight,
                note: exist_tour.note,
                description: exist_tour.description,
            };
            return res.status(200).json({
                data: tour,
            });
        } catch (error) {
          return res.status(500).json({ message: error.message });
        }
    };

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

    searchTour = async (req, res, next) => {
        const { departure_place, destination_place, departure_date, time }  = req.query

        let condition = {}

        if (destination_place || departure_place || departure_date || time) {
            const searchConditions = [];
    
            if (destination_place) {
                searchConditions.push({ destination_place: { [Op.like]: '%' + destination_place + '%' } });
            }
    
            if (departure_place) {
                searchConditions.push({ departure_place: { [Op.like]: '%' + departure_place + '%' } });
            }
    
            if (departure_date) {
                const userProvidedDate = new Date(departure_date);

                searchConditions.push({
                    departure_date: {
                        [Op.gte]: userProvidedDate
                    }
                });
            }
    
            if (time) {
                searchConditions.push({ time: { [Op.like]: '%' + time + '%' } });
            }
            condition = {
                [Op.and]: searchConditions
            };
        }
        const tours = await Tour.findAll({ where: condition })

        return res.status(200).json({
            data: tours
        })
    }
}

module.exports = new TourController()