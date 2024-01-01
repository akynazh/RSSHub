module.exports = (router) => {
    router.get('/search/:query/:genre?', require('./search'));
};
