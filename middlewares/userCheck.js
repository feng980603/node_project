//这个文件，是用来做用户验证的一个中间件函数

module.exports = function(req,res,next){
    //得到nickName
    let nickName = req.cookies.nickName;
    if(nickName){
        //若存在，随便去哪
        next();
    }else{
        //不存在，就去登录页面
        res.redirect('/login.html');
    }
}