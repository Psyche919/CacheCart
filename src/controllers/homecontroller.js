exports.home = (req, res) => {
    res.send("Welcome to CacheCart");
};

exports.health = (req, res) => {
    res.status(200).json({
        status: "OK",
        application: "CacheCart",
        environment: process.env.NODE_ENV || "development"
    });
};