
const pg=require("../utils/databases");
const controller=require('./controllers');
const api=require("../api/commons");
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
   function  creatProducts(req,res){
    pg.connect().then(client=>{
      let  payload=req.body;
        controller.creatProducts(client,payload).then(bookResults=>{
            api.success({statusCode:200,message:"OK"},client,res);
        }).catch(err=>{
            api.processError(err,client,res);
            });
    }).catch(err=>{
            api.processError(err,client,res);
    })
}


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


function getProducts(req,res){
    pg.connect().then(client=>{
        let  payload=req.query;
          controller.getProducts(client,payload).then(bookResults=>{
              api.success({statusCode:200,message:"OK",data:bookResults},client,res);
          }).catch(err=>{
              api.processError(err,client,res);
              });
      }).catch(err=>{
              api.processError(err,client,res);
      })
}

module.exports={
    creatProducts,
    scanProduct,
    getProducts
}