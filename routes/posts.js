const router = require("express").Router();
const verify = require("./verifyToken");

router.get('/', verify, (req, res) => {
    res.json({
                posts: {
                    title: 'My First Post',
                    description: 'random data to be accessed with login only.'
                        }
            });
});

module.exports = router;