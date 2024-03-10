const { signUp, logIn } = require("../Controllers/userAuth")

const router=require("express").Router()

router.post('/signup',signUp)
router.post('/login',logIn)


module.exports=router

