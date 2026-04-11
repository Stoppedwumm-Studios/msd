const fs = require('fs');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

async function downloadFile(url, fileName) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`unexpected response ${res.statusText}`);
  
  const fileStream = fs.createWriteStream(fileName);
  await finished(Readable.fromWeb(res.body).pipe(fileStream));
  
  console.log('Download complete!');
}

// Usage
downloadFile('https://example.com/image.png', './image.png')
  .catch(console.error);