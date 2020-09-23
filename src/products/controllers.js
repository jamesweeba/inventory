
const pg=require("../utils/databases");
module.exports={
    creatProducts:function(client,payload){
     return new Promise((resolve,reject)=>{
         let sql="";
         (payload.products||[]).map(entry=>{
             sql+=`insert into products(product_id,item,code,description,company) values('${entry.id}','${entry.item}','${entry.code}','${entry.description}','${entry.company}')  on conflict(product_id)  do nothing;`;
          })
         pg.query(client,sql,[],(err,res)=>{
            if(err){
               return reject({
                statusCode:500,
                message:"Internal server error"
            })
        }
        return resolve([]);
        });     
     })
    },

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
    },


    getProducts:function(client,payload){
        return new Promise((resolve,reject)=>{
            paginateProducts(client,payload).then(count=>{
              let totalCount=parseInt(count[0].count);
              if (isNaN(payload.page) || payload.page < 1 || !payload.page) {
                   payload.page = 1;
                }
               if (isNaN(payload.limit) || !payload.limit) {
                     payload.limit = 100;
                 }
                 if (payload.limit > 100){
                    payload.limit = 100;
                  }
                 if (payload.limit < 1) {
                      payload.limit = 1;
                  }
                  const maxPageLimit = Math.ceil(parseInt(totalCount) / payload.limit);
                  let offset = (payload.page - 1) * payload.limit;
                  if (maxPageLimit < payload.page) {
                    payload.page = maxPageLimit
                   } 
                   payload["offset"]=  offset;
                   payload["totalCount"]=  totalCount;
                return getallProducts(client,payload);
             }).then(results=>{
                const combined = {
                    pageNumber: parseInt(payload["page"]),
                    pageSize: parseInt(payload["limit"]),
                    total: payload["totalCount"],
                    items: results.length,
                    results
                   }
                 return resolve(combined)
            }).catch(err=>{
                return reject(err);
            })
        })
    }
}

function paginateProducts(client,payload){
    return new Promise((resolve,reject)=>{
        let sql="select count(*) from products";
        let params=[];
        const fields = ['product_id', 'item', 'code', 'description', 'company', 'status', 'posted_ts'];
        let sql_fields = fields.filter(field_name => payload[field_name] !== null && payload[field_name] !== undefined);
        if(sql_fields.length > 0){
            sql="select count(*) from products where "+ sql_fields.map((v,i)=>v + "=$"+(i+1)).join(" and ") + " offset $"+(sql_fields.length + 1) + " limit $"+ (sql_fields.length + 2);
            params = sql_fields.map(field_name =>  payload[field_name]);
            params.push(payload.offset,payload.limit)
        }
        pg.query(client,sql,params,(err,res)=>{
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

function getallProducts(client,payload){
    return new Promise((resolve,reject)=>{
        let sql="select product_id,item,code,description,company,status,posted_ts from products order by posted_ts desc offset $1  limit $2";
        let params=[payload.offset,payload.limit];
        const fields = ['product_id', 'item', 'code', 'description', 'company', 'status', 'posted_ts'];
        let sql_fields = fields.filter(field_name => payload[field_name] !== null && payload[field_name] !== undefined);
        if(sql_fields.length > 0){
            sql="select product_id ,item,code,description,company,status,posted_ts from products where "+ sql_fields.map((v,i)=>v + "=$"+(i+1)).join(" and ") + " order by posted_ts desc offset $"+(sql_fields.length + 1) + " limit $"+ (sql_fields.length + 2);
            params = sql_fields.map(field_name =>  payload[field_name]);
            params.push(payload.offset,payload.limit)
        }
        pg.query(client,sql,params,(err,res)=>{
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


function scanProducts(client,payload){
    return new Promise((resolve,reject)=>{
        let sql=`update products set status='scanned'  where  product_id=any($1) and status!='scanned'`;
      pg.query(client,sql,[payload.productIds],(err,res)=>{
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
        let sql=`select status,product_id from products where product_id =any($1)`;
        pg.query(client,sql,[payload.productIds],(err,res)=>{
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

