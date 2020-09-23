const router=require("express").Router();

const services=require("./services");

router.post("/",services.creatProducts);
router.get("/",services.getProducts);

module.exports=router;

