const router=require("express").Router();

const services=require("./services");

router.post("/", services.scanProduct);

module.exports=router;