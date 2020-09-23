
const {Pool}=require('pg');
const dbConfig=require("../databaseConfig/databaseConfig");
let pool = new Pool({});
module.exports={
    init:function(local){
        let configParams=dbConfig.postgresConfig[local];
        console.log(configParams);
      //  console.log("did u even come hereeeeeeeeee");
        pool=new Pool(configParams);
       // console.log("did u even come hereeexxxxxxxxxxeeeeeee");
 
        pool.on("acquire",(client)=>{
            console.log(" i aquired connection succesfully")
 
        });
        pool.on("error",(client)=>{
         console.log("there was an error with configuration")
        });
 
        pool.on("remove",(client)=>{
         console.log("connection return to pool")
        })
     },
     connect:function(){
        return new Promise((resolve,reject)=>{
            pool.connect().then(client=>{
                client.query("BEGIN",(err)=>{
                    if(err){
                        return reject(err);
                    }
                    return resolve(client);
                })
            }).catch(err=>{
                return reject(err);
            })
        })
    },


 commitAndReleas:function(client){
    return new Promise((resolve,reject)=>{
        client.query("COMMIT",(err)=>{
            if(err){
                console.log("error committing code");
                return reject(err);
            }

            client.release();
            
            return resolve();
        })

    })

},
rollBack:function(client){
    return new Promise((resolve,reject)=>{
        client.query("ROLLBACK",(err=>{
            if(err){
                console.log("error rolling back")
                return reject(err);
            }
            client.release();
            return resolve();

        }));
    })

},

query:function(client,sql,params,cb){
        client.query(sql,params,(err,res)=>{
            console.log("query excuted succesfully",{
                sql,
                params,
                rowCount:res ? res.rows : 0,
                err
            });
         
            if(err){
                return cb(err,null)
            }
            return cb(err,res);
        });
}
}
