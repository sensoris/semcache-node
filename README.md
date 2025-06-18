# semcache-node
A node sdk for github.com/sensoris/semcache



## Quick start

Start the Semcache Docker image:

```bash
docker run -p 8080:8080 semcache/semcache:latest
```

Install semcache
```bash
npm install semcache
```
Use the sdk in your service

```javascript
const SemcacheClient = require('semcache');

const client = new SemcacheClient('http://localhost:8080');

(async () => {
  await client.put('What is the capital of France?', 'Paris');

  const result = await client.get('What is the capital of France?');
  console.log(result); // => 'Paris'
})();
```
