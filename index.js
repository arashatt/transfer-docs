import dotenv from 'dotenv';
import puppeteer from 'puppeteer';
import express from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4} from 'uuid';

const CHECKHOSTFILLED  = 20;
dotenv.config();
const port = process.env.PORT || 3000;
let head = false;
if (process.env.HEAD.toLowerCase() ==="true") {
head = ture;
}

async function check(domain, browser){ 
	let start = performance.now();
	//empirically figured out size for check-host
	// const browser =  await puppeteer.launch({headless: false, executablePath:"/home/arash/chrome-selenimu/chrome-linux64/chrome"});
	const page = await browser.newPage();
	await page.goto("https://check-host.net/check-ping?host="+domain);
	await page.setViewport({ width: 1200, height: 1400 });



	let count = 0; //number of successful pings returned
	for (let i = 1; i < 44; i++ ){
	const selector = `/html/body/div/div[7]/div/div[1]/div[2]/table/tbody/tr[${i}]/td[4]/div`;
	try {
		await page.waitForXPath(selector, {timeout: 50});
		const elementHandle = await page.$x(selector);
		//const elementText = await page.evaluate( element => element.textContent, elementHandle[0]);
		//console.log('Element text', elementText);
		console.log(`i is ${i}`);
		count++;
	} catch (error) {
		if (count > CHECKHOSTFILLED)
		break;
		else
			continue;
	}
	} 
		
	await page.screenshot({path:'public/check-host.png'});
	
    // Close the browser
	await page.close();
	let finish = performance.now();
	console.log(`check host took ${(finish - start )/ 1000}`)
  
}

async function intodns(domain, browser){ 
	const page = await browser.newPage();
	let start = performance.now();
	await page.setViewport({ width: 1200, height: 320 });
	try {
		await page.goto("https://intodns.com/" + domain);
	} catch (e){
	}
	const selector = `.content`;
	try {
		await page.waitForSelector(selector, {timeout: 3000});
		const elementHandle = await page.$(selector);
		const elementText = await page.evaluate( element => element.textContent, elementHandle);	
	} catch (error) {

	}
		
    // Close the browser
	await page.screenshot({path:'public/intodns.png'});
	await page.close();
  	let finish = performance.now();
	console.log(`intodns took ${(finish - start )/ 1000}`);

}

async function site(domain, browser){
	let start = performance.now();
	console.log("site fucntion called " + domain);
	const page = await browser.newPage();
	
try{	
	await page.goto("https://" + domain);
	        await page.setViewport({ width: 1920, height: 2080 });
//	await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
	await page.screenshot({path:'public/site.png'});
}catch(e){}
	
		
    // Close the browser
	let finish = performance.now();
	console.log(`site took ${(finish - start )/ 1000}`);
	await page.close();
  
}

const folderPath = '.';
fs.readdir(folderPath, (err, files)=>{
files.forEach(file => {console.log(file);})

});

const browser =  await puppeteer.launch({headless: true,  args: ["--disable-dev-profile"]});
//let domain = readline.question();

const app = express();

//app.set('view engine', 'ejs');
const image1Path = 'check-host.png';
const image2Path = 'intodns.png';
const image3Path = 'site.png';
////////////////////////////////////////////
app.use(express.static('public'));
 app.get('/status', (req, res) => { 

	browser.pages().then (result => {
		res.send((result.length - 1).toString());
		}).catch(function(error)  
			{

			res.send("Status failed");

		});
	});
app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/:domain', (req, res) => {
let domain = req.params.domain;
console.log("one request came from server %s %s" , uuidv4(), domain);

	//check(domain, page)
	let start = performance.now();
Promise.all([site(domain, browser), check(domain, browser), intodns(domain, browser)]).then(results =>{
	res.sendFile(path.join(process.cwd(),'index.html'));
	//res.sendFile(path.join(process.cwd(), 'site.png'));
	let finish = performance.now();
console.log(`PromiseAll took ${(finish - start )/ 1000}`)

});
});
////////////////////////////////////////////
app.use(function (req, res, next) {
	console.log()
	if (req.path.substr(-1) == '/' && req.path.length > 1) {
	  let query = req.url.slice(req.path.length)
	  res.redirect(301, req.path.slice(0, -1) + query)
	} else {
	  next()
	}
  })
////////////////////////////////////////////
app.listen(port, ()=>{
	console.log(`server running on port ${port}`);
});


function delay(time) {
	return new Promise(function(resolve) { 
		setTimeout(resolve, time)
	});
 }
