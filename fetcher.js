const request = require('request');
const fs = require('fs');
const readline = require('readline');
const source = process.argv[2];
const target = process.argv[3];

const writeData = function(target, data) {
  fs.writeFile(target, data, (err) => {
    if (err) throw err;
    fs.stat(target, (err, stats) => {
      if (err) throw err;
      const size = stats.size;
      console.log(`Downloaded and saved ${size} bytes to ${target}`);
    }); 
  });
}

request(source, (error, response, body) => {
  if (!error && response && response.statusCode === 200){
    fs.access(target, fs.constants.F_OK, (err) => {
      if(!err){
        console.log(`${target} already exists.`);
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout
        });
        rl.question('Overwrite?(y) ', (answer) => {
          if(answer !== "y") {
            throw "Aborted by user";
          } else {
            rl.close();
            writeData(target, body);
          }
        });
      } else {
        writeData(target, body);
      }
    });
  } else {
    console.log("Something went wrong!", 'error:', error, 'statusCode:', response && response.statusCode);
    console.log(); 
    console.log();
  }
});