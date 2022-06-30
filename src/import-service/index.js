import fetch from 'node-fetch';

const SERVICE_ENDPOINT = 'https://olzf19sxd2.execute-api.eu-west-1.amazonaws.com/dev/import';
const fetchData = async () => {
    await fetch(SERVICE_ENDPOINT)
        .then(res => res.json(image =>  `<div class='img-wrap'>
                                            <img class='image' src="${image}"/>
                                        </div>`))
        .then(imgs => {
        const allImgs = imgs.map().join(' ');

        document.querySelector('#images-container').innerHTML = allImgs;
    });
};

fetchData();
            