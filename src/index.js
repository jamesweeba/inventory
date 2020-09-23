
const pg=require("../src/utils/databases");
const express=require("express");
const app=express();
const products=require("./products/routes");

const scans=require("./scans/routes")
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const port= process.env.PORT ||1900;

var path=require('path');

//let myconectiion= new pg.connection();
pg.init(db="local");
  app.use(fileUpload());
  app.use(bodyParser.json({ limit: '50mb' }), bodyParser.urlencoded({ extended: true, limit: '50mb' }));
  app.use(cors());


app.get("/api/v1/docs",(req,res)=>{
  res.sendFile(path.join(__dirname+"/docs.html"));
})

app.use("/api/v1/products",products);
app.use("/api/v1/scans",scans);

app.listen(port,()=>{
    console.log("Magic happens on port"+ port);
});
