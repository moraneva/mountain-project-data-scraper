const parser = require('node-html-parser');
const axios = require('axios');

(async () => {
    const topLevel = await axios.get('https://www.mountainproject.com/route-guide')

    const topLevelHtml = parser.parse(topLevel.data);

    const topLinks = topLevelHtml.querySelector('#route-guide').querySelectorAll('strong a');

    const stateLinks = topLinks.map(link => link.attributes['href']);

    const alabama = stateLinks[0];

    const alabamaRoutes = await getAllRoutes(alabama)
    console.log(alabamaRoutes.length)
})();

async function getAllRoutes(page) {

    const pageHtml = await axios.get(page);
    const parsedPageHtml = parser.parse(pageHtml.data);

    const areas = parsedPageHtml
        .querySelector('.mp-sidebar')
        .querySelectorAll('.lef-nav-row a')
        .map(link => link.attributes['href']);

    const routes = parsedPageHtml
        .querySelector('.mp-sidebar')
        .querySelectorAll('td a')
        .map(link => link.attributes['href']);

    for (let area of areas) {
        const moreRoutes = await getAllRoutes(area)
        routes.push(...moreRoutes);
    }

    console.log('finished ' + page);

    return routes;

}



