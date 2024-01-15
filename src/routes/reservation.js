const express = require('express');
const Reservation = require('../models/Reservations');
const router = express.Router();

router.post('/reservation', async (req, res) => {
    try {
        const {  startDate, endDate, summary, address, price } = req.body;

        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);

        const reservationToCheck = {
            startDate: parsedStartDate,
            endDate: parsedEndDate
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
v 
        // Tarih aralığındaki gün sayısını hesapla
        const startTimestamp = parsedStartDate.getTime();
        const endTimestamp = parsedEndDate.getTime();

        // Gün farkını hesaplayın
        const days = Math.ceil((endTimestamp - startTimestamp) / (1000 * 60 * 60 * 24));
        // Toplam ücreti hesapla (örneğin, her gün belirli bir fiyat ile çarpabilirsiniz)
        console.log(days);
        const total = price * days;

        // Yeni rezervasyonu oluştur ve kaydet
        const newReservation = new Reservation({
            startDate,
            endDate,
            summary,
            address,
            price,
            userId: req.body.userId,
            total: total
        });

        const savedReservation = await newReservation.save();

        res.status(200).json({ success: true, reservation: savedReservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});


// Rezervasyonu rezerve etme endpoint'i
router.post('/reservation/:reservationId/reserve', async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const userId = req.body.userId;

        // Rezervasyonu bul
        const reservationToReserve = await Reservation.findById(reservationId);

        // Rezervasyonun var olduğunu kontrol et
        if (!reservationToReserve) {
            return res.status(404).json({ success: false, error: 'Rezervasyon bulunamadı.' });
        }

        // Rezervasyonun daha önce rezerve edilip edilmediğini kontrol et
        if (reservationToReserve.isReserved && reservationToReserve.reservedBy.toString() !== userId) {
            return res.status(400).json({ success: false, error: 'Bu rezervasyon başka bir kullanıcı tarafından rezerve edilmiş.' });
        }

        // Rezervasyonu rezerve et (örneğin, durumu güncelle)
        reservationToReserve.isReserved = true;
        reservationToReserve.reservedBy = userId;

        // Güncellenmiş rezervasyonu kaydet
        const updatedReservation = await reservationToReserve.save();

        res.status(200).json({ success: true, reservation: updatedReservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});
router.get('/reservations', async (req, res) => {
    try {
        // Tüm rezervasyonları çek
        const allReservations = await Reservation.find();

        res.status(200).json({ success: true, reservations: allReservations });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});





module.exports = router;
