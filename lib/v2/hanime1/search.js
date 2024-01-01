const got = require('@/utils/got');
const cheerio = require('cheerio');
// const path = require('path');
// const { art } = require('@/utils/render');
const baseUrl = 'https://hanime1.me';

module.exports = async (ctx) => {
    const query = ctx.params.query;
    const genre = ctx.params.genre;

    let title = `Hanime1.me - ${query}`;
    let link = `${baseUrl}/search?query=${query}`;
    if (genre) {
        title += ` - ${genre}`;
        link += `&genre=${genre}`;
    }

    const response = await got({
        method: 'get',
        url: link,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36 Edg/117.0.2045.31',
        },
    });
    const $ = cheerio.load(response.data);

    const items = $('div .search-doujin-videos.hidden-xs')
        .toArray()
        .map((e) => {
            e = $(e);
            const vLink = e.find('a.overlay').attr('href');
            const vTitle = e.find('div.card-mobile-title').text().trim();
            const cover = e.find('img').last().attr('src');
            return {
                title: vTitle,
                link: vLink,
                description: `<img src=${cover} alt=${vTitle}></img>`,
            };
        });
    // items = await Promise.all(
    //     items.map((item) =>
    //         ctx.cache.tryGet(item.link, async () => {
    //             const resp = await got(item.link);
    //             const $ = cheerio.load(resp.data);

    //             let src = $('video').attrs('src');
    //             item.description = `<video src=${src}><img src=${item.cover}></img></video>`

    //             return item;
    //         })
    //     )
    // );
    ctx.state.data = {
        title,
        link,
        item: items,
    };
};
