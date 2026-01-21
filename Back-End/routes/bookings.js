const express = require("express");
const router = express.Router();
const db = require("../db/db");

const POOLS = {
    PS4: [1, 2, 3],
    PS5: [4],
    PS3: [5, 6, 7, 8],
    VIP: [9, 10],
};

function normalize(s) {
    if (typeof s !== "string") return s;
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s)) return s.replace("T", " ") + ":00";
    if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(s)) return s.replace("T", " ");
    return s;
}

const hasOverlapStmt = db.prepare(`
  SELECT 1
  FROM bookings
  WHERE resource_id = ?
    AND datetime(starttime) < datetime(?)
    AND datetime(endtime) > datetime(?)
  LIMIT 1
`);

const hasOverlapExcludingIdStmt = db.prepare(`
  SELECT 1
  FROM bookings
  WHERE resource_id = ?
    AND id <> ?
    AND datetime(starttime) < datetime(?)
    AND datetime(endtime) > datetime(?)
  LIMIT 1
`);

const insertStmt = db.prepare(`
  INSERT INTO bookings (name, resource_id, starttime, endtime, services)
  VALUES (?, ?, ?, ?, ?)
`);

const updateStmt = db.prepare(`
  UPDATE bookings
  SET name = ?, resource_id = ?, starttime = ?, endtime = ?, services = ?
  WHERE id = ?
`);

router.get("/", (req, res, next) => {
    try {
        return res.status(200).json({ error: false, result: [] });
    } catch (err) {
        next(err);
    }
});

router.get("/getall", (req, res, next) => {
    const startRaw = req.query.start_time;
    const endRaw = req.query.end_time;

    try {
        if (!startRaw || !endRaw) {
            const result = db.prepare("SELECT * FROM bookings ORDER BY starttime ASC").all();
            return res.status(200).json({ error: false, result });
        }

        const startTime = normalize(startRaw);
        const endTime = normalize(endRaw);

        const result = db
            .prepare(
                `
        SELECT *
        FROM bookings
        WHERE datetime(starttime) BETWEEN datetime(?) AND datetime(?)
        ORDER BY starttime ASC
      `
            )
            .all(startTime, endTime);

        return res.status(200).json({ error: false, result });
    } catch (err) {
        next(err);
    }
});

router.get("/get/:id", (req, res, next) => {
    if (!req.params.id) {
        return res.status(400).json({ error: true, message: `id cannot be empty` });
    }
    const id = req.params.id;

    try {
        const statement = "SELECT * FROM bookings WHERE id = ?";
        const result = db.prepare(statement).get(id);
        return res.status(200).json({ error: false, result: result });
    } catch (err) {
        next(err);
    }
});

router.delete("/delete", (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ error: true, message: `body cannot be empty!` });
    }

    const { id } = req.body;
    try {
        const check = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
        if (!check) {
            return res.status(404).json({
                error: true,
                message: `No booking was found with id ${id}`,
            });
        }

        const statement = "DELETE FROM bookings WHERE ID = ?";
        db.prepare(statement).run(id);
        res.status(200).json({ error: false, message: `Successfully deleted booking with id ${id}` });
    } catch (err) {
        next(err);
    }
});

router.post("/add", (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ error: true, message: "body cannot be empty" });
    }

    const { name, startTime: startRaw, endTime: endRaw, services } = req.body;

    try {
        if (!name || !startRaw || !endRaw || !services) {
            return res.status(400).json({
                error: true,
                message: "name, startTime, endTime, and services cannot be empty!",
            });
        }

        const pool = POOLS[services];
        if (!pool) {
            return res.status(400).json({
                error: true,
                message: "services must be one of: PS4, PS5, PS3, VIP",
            });
        }

        const startTime = normalize(startRaw);
        const endTime = normalize(endRaw);

        if (endTime <= startTime) {
            return res.status(400).json({ error: true, message: "endTime must be after startTime" });
        }

        const out = db.transaction(() => {
            for (const resourceId of pool) {
                const conflict = hasOverlapStmt.get(resourceId, endTime, startTime);
                if (!conflict) {
                    const insert = insertStmt.run(name, resourceId, startTime, endTime, services);
                    return { ok: true, bookingId: insert.lastInsertRowid, resourceId };
                }
            }
            return { ok: false, status: 409, message: `No ${services} available for that time range.` };
        })();

        if (!out.ok) {
            return res.status(out.status).json({ error: true, message: out.message });
        }

        return res.status(200).json({ error: false, result: out });
    } catch (err) {
        next(err);
    }
});

router.put("/update", (req, res, next) => {
    if (!req.body) {
        return res.status(400).json({ error: true, message: "body cannot be empty" });
    }

    const { id, name, startTime: startRaw, endTime: endRaw, services } = req.body;

    try {
        if (!id) {
            return res.status(400).json({ error: true, message: "id cannot be empty!" });
        }

        const existing = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
        if (!existing) {
            return res.status(404).json({ error: true, message: `No booking was found with id ${id}` });
        }

        const nextName = name ?? existing.name;
        const nextServices = services ?? existing.services;

        const pool = POOLS[nextServices];
        if (!pool) {
            return res.status(400).json({
                error: true,
                message: "services must be one of: PS4, PS5, PS3, VIP",
            });
        }

        const nextStartTime = normalize(startRaw ?? existing.starttime);
        const nextEndTime = normalize(endRaw ?? existing.endtime);

        if (!nextName || !nextStartTime || !nextEndTime || !nextServices) {
            return res.status(400).json({
                error: true,
                message: "id, name, startTime, endTime, and services must be valid",
            });
        }

        if (nextEndTime <= nextStartTime) {
            return res.status(400).json({ error: true, message: "endTime must be after startTime" });
        }

        const out = db.transaction(() => {
            const currentResourceOk =
                pool.includes(existing.resource_id) &&
                !hasOverlapExcludingIdStmt.get(existing.resource_id, id, nextEndTime, nextStartTime);

            if (currentResourceOk) {
                updateStmt.run(nextName, existing.resource_id, nextStartTime, nextEndTime, nextServices, id);
                return {
                    ok: true,
                    bookingId: id,
                    resourceId: existing.resource_id,
                    keptResource: true,
                };
            }

            for (const resourceId of pool) {
                const conflict = hasOverlapExcludingIdStmt.get(resourceId, id, nextEndTime, nextStartTime);
                if (!conflict) {
                    updateStmt.run(nextName, resourceId, nextStartTime, nextEndTime, nextServices, id);
                    return {
                        ok: true,
                        bookingId: id,
                        resourceId,
                        keptResource: false,
                    };
                }
            }

            return {
                ok: false,
                status: 409,
                message: `No ${nextServices} available for that time range.`,
            };
        })();

        if (!out.ok) {
            return res.status(out.status).json({ error: true, message: out.message });
        }

        const updated = db.prepare("SELECT * FROM bookings WHERE id = ?").get(id);
        return res.status(200).json({ error: false, result: { ...out, booking: updated } });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
