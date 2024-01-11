const express = require('express');
const Reservation = require('../models/Reservations');
const router = express.Router();

router.post('/reservation', async (req, res) => {
    try {
        const { userId, startDate, endDate, summary, address, price } = req.body;

        
        const reservationToCheck = {
            startDate,
            endDate
        };

        
        const existingReservation = await Reservation.findOne({
            $or: [
                { $and: [{ startDate: { $lte: reservationToCheck.startDate } }, { endDate: { $gte: reservationToCheck.startDate } }] },
                { $and: [{ startDate: { $lte: reservationToCheck.endDate } }, { endDate: { $gte: reservationToCheck.endDate } }] },
                { $and: [{ startDate: { $gte: reservationToCheck.startDate } }, { endDate: { $lte: reservationToCheck.endDate } }] }
            ]
        });

        if (existingReservation) {
            return res.status(400).json({ success: false, error: 'Bu tarih aralığında başka bir rezervasyon bulunmaktadır.' });
        }

        const newReservation = new Reservation({
            startDate,
            endDate,
            summary,
            address,
            price,
            userId
        });

        const savedReservation = await newReservation.save();

        res.status(200).json({ success: true, reservation: savedReservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
module.exports = router;
