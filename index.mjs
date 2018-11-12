import axios from 'axios'
import humanizeString from 'humanize-string'

const config = {
    tsc: {
        urls: [
            'https://www.tokyosnowclub.com/trips/2018-12-01/kagura-ski-snowboard-day-trip.html',
            'https://www.tokyosnowclub.com/trips/2018-12-02/kagura-ski-snowboard-day-trip.html',
            'https://www.tokyosnowclub.com/trips/2018-12-08/naeba-kagura-ski-snowboard.html',
            'https://www.tokyosnowclub.com/trips/2018-12-15/naeba-kagura-ski-snowboard.html',
            'https://www.tokyosnowclub.com/trips/2018-12-21/minakami-xmas-ski-snowboard.html',
            'https://www.tokyosnowclub.com/trips/2019-01-11/shiga-kogen-ski-snowboard-long-weekend.html',
            'https://www.tokyosnowclub.com/trips/2019-01-25/cortina-tsugaike-ski-snowboard.html',
            'https://www.tokyosnowclub.com/trips/2019-02-01/zao-onsen-snow-monster-festival.html',
            'https://www.tokyosnowclub.com/trips/2019-02-08/shiga-kogen-ski-snowboard-long-weekend.html',
            'https://www.tokyosnowclub.com/trips/2019-03-08/cortina-tsugaike-ski-snowboard.html'
        ],
        search: /Spaces Left: (\d*)/,
        prefix: 'https://www.tokyosnowclub.com/trips/',
        criteria: (search) => search < 20
    },
    meetup: {
        urls: [
            'https://www.meetup.com/Tokyo-Forex-Traders-Meetup/events/255631788/'
        ],
        search: /(\d*) spots left/,
        prefix: 'https://www.meetup.com/',
        criteria: (search) => search < 5
    }
}

const searchUrls = async (object) => {

    const urls = object.urls

    for (let i = 0; i < urls.length; i++) {
        const url = urls[i]

        await axios.get(url)
            .then(function (response) {
          //      console.log(response);
                const found = response.data.match(new RegExp(object.search))
                if (found) {
                    
                    if (object.criteria(found[1])) {
                        notify(url, found[1], object.prefix)
                    } else {
                        log(url, found[1], object.prefix)
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            })
            .then(function () {
                // always executed
            })
    }
}

//TODO: This could be more beautiful
const formatText = (url, spaces, prefix) => {
    const string = url.replace(prefix,'')
        .replace('/', ' ')
        .replace('.html', '')

    return `"${spaces}" spaces left in "${humanizeString(string)}": ${url}`
}

const log = (url, spaces, prefix) => {
    console.log(formatText(url, spaces, prefix))
}

//TODO: Convert this into an email or similar to notify me
const notify = (url, spaces, prefix) => {
    console.info('----- ' + formatText(url, spaces, prefix) )
}

//TODO: This should run daily or every few hours.
const main = async () => {
    console.log('')
    await searchUrls(config.tsc)
    console.log('')
    await searchUrls(config.meetup)
    console.log('')
}

main()