//页面渲染的路由
const express = require('express');
const router = express.Router();
const userCheck = require('../middlewares/userCheck');

//首页
router.get('/', userCheck ,function(req,res){
    //获取登录的用户名
    // let nickName = req.cookies.nickName;
    // let isAdmin = req.cookies.isAdmin ? true : false;

    res.render('index',{
        nickName:req.cookies.nickName,
        isAdmin:parseInt(req.cookies.isAdmin)
    });
});

//banner页面
router.get('/banner.html',userCheck,function(req,res){
    res.render('banner',{
        nickName:req.cookies.nickName,
        isAdmin:parseInt(req.cookies.isAdmin)
    });
});

//登录页面
router.get('/login.html',(req,res) => {
    res.render('login');
});

module.exports = router;    