const http = require ('http')
const fs  = require('fs');
const requests = require('requests');


const homeFile = fs.readFileSync('Home.html' , 'utf-8');


    // Dynamic data send in html
const replaceVal=(temval ,orgval)=>{
    let temperature= temval.replace("{%tempval%}", orgval.main.temp);
    temperature= temperature.replace("{%minval%}", orgval.main.temp_min);
    temperature= temperature.replace("{%maxval%}", orgval.main.temp_max);
    temperature= temperature.replace("{%location%}", orgval.name);
    temperature= temperature.replace("{%country%}", orgval.sys.country);
    temperature= temperature.replace('{%temstatus%}', orgval.weather[0].main);


 //  console.log(temperature);
    return temperature;
}

const server =http.createServer((req, res)=>{
    if (req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=chittagong&appid=c8187f7272da157d100128bc404bdb96"
       )
        .on("data", function (chunk) {
          const objdata =JSON.parse(chunk);
          const arrdata =[objdata];
          //console.log(arrdata[0].main.temp);
          const realTimeData =arrdata.map((val)=>replaceVal(homeFile,val))
          .join('')
          res.write(realTimeData)
         //console.log(realTimeData);
         
        })
        .on('end', function (err) {
        if (err) return console.log('connection closed due to errors', err);
        
        res.end();
        console.log('end');
        });
    }
})
 

server.listen(4000)
console.log('yes ')