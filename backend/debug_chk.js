const eventController = require("./controllers/eventController");
const authMiddleware = require("./middlewares/authMiddleware");
const validationMiddleware = require("./middlewares/validationMiddleware");

console.log("=== Event Controller ===");
console.log("createEvent:", typeof eventController.createEvent);
console.log("getAllEvents:", typeof eventController.getAllEvents);

console.log("\n=== Auth Middleware ===");
console.log("verifyAdmin:", typeof authMiddleware.verifyAdmin);

console.log("\n=== Validation Middleware ===");
console.log("validateCreateEvent:", typeof validationMiddleware.validateCreateEvent);
console.log("validateCreateEvent is array?", Array.isArray(validationMiddleware.validateCreateEvent));
console.log("validateMongoId:", typeof validationMiddleware.validateMongoId);
