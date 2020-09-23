const router=require("express").Router();

const services=require("./services");

/**
 * creates products
 */
router.post("/",services.creatProducts);


/**
 * gets created products
 */
router.get("/",services.getProducts);

module.exports=router;

