const jwt = require("express-jwt");

if (!process.env.JWT_SECRET) {
	throw new Error("The JWT_SECRET environment variable must be set to run the tools service.");
}

if (!process.env.AUTH_ACCESS_TOKEN) {
	throw new Error("The AUTH_ACCESS_TOKEN environment variable must be set to run the tools service.");
}

module.exports = (app) => {
	// Use express-jwt to handle the JWT's decoding & validation
	app.use(jwt({ secret: process.env.JWT_SECRET, algorithms: ["HS256"], requestProperty: "auth" }));

	// Check the access token contained in the JWT.
	app.use(function (req, res, next) {
		if (req.auth.access_token != process.env.AUTH_ACCESS_TOKEN) {
			res.status(401).send("Invalid access token.");
		}
		next();
	});

	/*
     * When the bearer JWT is missing or invalid, express-jt throws an UnauthorizedError.
     * Let's display a cleaner message when that happens.
     */
	app.use(function (err, req, res) {
		if (err.name === "UnauthorizedError") {
			res.status(401).send("Invalid bearer token.");
		}
	});
};
