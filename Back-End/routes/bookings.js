const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
    try {
    const result = [
        {
        bookingId: "B001",
        name: "Alex",
        service: "PS5",
        startDateTime: "2026-01-19T10:00",
        endDateTime: "2026-01-19T12:00",
        },
        {
        bookingId: "B002",
        name: "Jamie",
        service: "VIP",
        startDateTime: "2026-01-19T13:00",
        endDateTime: "2026-01-19T15:00",
        },
    ];

    return res.status(200).json({
        error: false,
        result: result,
    });
    } catch (err) {
    next(err);
    }
});

module.exports = router;