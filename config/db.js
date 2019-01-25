const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/mz';

mongoose
    .connect(url,{useNewUrlParser:true})
    .then(function(){
        console.log('连接成功');
    })
    .catch(function(err){
        console.log('连接失败',err.message);
    });

module.exports = mongoose;