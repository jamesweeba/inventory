const pg=require("../utils/databases");

module.exports={
    success:function(data,client,res){
            pg.commitAndReleas(client).then(()=>{
                let results=data.length==1 ? data[0]:data;
                return res.status(200).json(results);
            }).catch(err=>{
               return  res.status(500).json({
                    statusCode:500,
                    message:{err}
    
                })
            })
    },

    processError:function(data,client,res){
        pg.rollBack(client).then(()=>{
            switch(data.statusCode){
                case 500:
                    return res.status(500).json(data)
                    case 400:
                        return res.status(400).json(data);
                        case 404:
                            return res.status(404).json(data);
                            case 403:
                                return res.status(403).json(data);
                          default:
                            return res.status(500).json(data)

            }

        }).catch(err=>{
            return  res.status(500).json({
                statusCode:500,
                message:{err}

            })

        })
    }
}