const router=require("express").Router();

const services=require("./services");
/**
 * scans created products
 */
router.post("/", services.scanProduct);

module.exports=router;