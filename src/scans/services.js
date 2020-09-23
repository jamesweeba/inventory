const pg=require("../utils/databases");
const controller=require('./controllers');
const api=require("../api/commons");


function scanProduct(req,res){
    pg.connect().then(client=>{
        let  payload=req.body;
          controller.checkProduct(client,payload).then(bookResults=>{
              api.success({statusCode:200,message:"OK",data:bookResults},client,res);
          }).catch(err=>{
              api.processError(err,client,res);
              });
      }).catch(err=>{
              api.processError(err,client,res);
      })
}


module.exports={
    scanProduct
}


