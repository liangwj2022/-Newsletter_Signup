const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

const port = process.env.PORT;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get("/", function(req,res){
  res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
  const fName = req.body.firstName;
  const lName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);
  const url = " ";//add to which list, which is list_id
  const options = {
    method:"POST",
    auth: " " //HTTP Basic Authentication: "any string: API key"
  }
  const request = https.request(url, options, function(response){
    if (response.statusCode == 200){
      res.sendFile(__dirname+"/success.html");
    }
    else{
      res.sendFile(__dirname+"/failure.html");
    }
    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req,res){
  res.redirect("/");
})

app.listen(port || 3000, function(){
  console.log("The server is running on port " + port);
});
