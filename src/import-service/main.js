const SERVICE_ENDPOINT = 'https://90m4tsqga1.execute-api.eu-west-1.amazonaws.com/dev/uploaded';

const fetchData = async () => {
    await fetch(SERVICE_ENDPOINT)
        .then(res => res.json())
        .then(files => {
            console.log('files', files);
            const allFiles = files.map(file =>
                (`<div class='file-wrap'>
                    <img class='file' src="${file}"/>
                </div>`)).join('');
      
        document.querySelector('#files-container').innerHTML = allFiles;
    });
};

fetchData();