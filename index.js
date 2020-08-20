const express = require("express");
const request = require("request");
const fs = require('fs');
const cheerio = require('cheerio');

const app = express();

app.get("/",function(req,res){
	res.send('<html><p>Please click the link <a href="https://latest5news.herokuapp.com/latestNews">https://latest5news.herokuapp.com/latestNews</a> to display latest 5 Stories from times.com</p></html>')
})

app.get("/latestNews",function(req,res){
	request({uri: "https://time.com/"},function(error, response, body) {
		if(error) {
			res.send("Error ocurred. Please try after sometime");
		}

		let $ = cheerio.load(body);

		let latestStoriesSection = $("section[data-module_name='Latest Stories']");
		latestStoriesSection = latestStoriesSection.html();
		$ = cheerio.load(latestStoriesSection)

		let latest5News = [];

		$("li").each(function(i) {
			latest5News.push({
				"title": $(this).find("a").text(),	
				"link": "https://time.com/"+$(this).find("a").attr("href")
			})
		})

		res.send(latest5News);
	  });

})

const port=process.env.PORT || 3000
app.listen(port,function()
{
	console.log(`Example app listening at http://localhost:${port}`)
});