const https = require('https');

https.get('https://almulhimtravel.runasp.net/api/Packages?PageSize=50', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json.items.filter(p => p.destinationName !== 'ماليزيا').slice(0, 5).map(p => ({id: p.packageId, image: p.imageUrl, title: p.titleAr})), null, 2));
    } catch(err) { console.error(err.message); }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
