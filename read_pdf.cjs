const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('C:\\Users\\User\\Desktop\\MRI프로토콜 및 파라메타.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('pdf_extracted.txt', data.text);
    console.log('PDF extracted to pdf_extracted.txt successfully. Length: ' + data.text.length);
}).catch(function(error){
    console.log(error);
});
