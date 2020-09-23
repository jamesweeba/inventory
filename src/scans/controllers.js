
const pg=require("../utils/databases");
module.exports={
    checkProduct:function(client,payload){
        return new Promise((resolve,reject)=>{
            scanProducts(client,payload).then(results=>{
                return fetchProductsAfterScan(client,payload);
            }).then(results=>{
                if(results.length==0){
                    return reject({
                        statusCode:404,
                        message:"Not found"
                    })
                }
                return resolve(results);
             }).catch(err=>{
             return reject({
                 statusCode:500,
                 message:"Internal server error"
             })
            })
        })
    }


}

function scanProducts(client,payload){
    return new Promise((resolve,reject)=>{
        let sql="";
        payload.productIds.map(entry=>{
            sql+=`update products set status='scanned',gis='${JSON.stringify(entry.gis)}' where product_id='${entry.id}' and status!='scanned'; `;
        })
        //let sql=`update products set status='scanned'  where  product_id=any($1) and status!='scanned'`;
      pg.query(client,sql,[],(err,res)=>{
          if(err){
            return reject({
                statusCode:500,
                message:"Internal server error"
            })
          }
             return resolve("updated");
      })

    })
}

function fetchProductsAfterScan(client,payload){
    return new Promise((resolve,reject)=>{
     let productIds=(payload.productIds||[]).map(entry=>{
         return entry.id;

     });
        let sql=`select status,product_id from products where product_id =any($1)`;
        pg.query(client,sql,[productIds],(err,res)=>{
            if(err){
                return reject({
                    statusCode:500,
                    message:"Internal server error"
                })
            }
            return resolve(res.rows);
        })


    })
}














//books_author

