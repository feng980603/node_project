//提供给前端ajax调用的接口地址
const express = require('express');
const async = require('async');
const BannerModel = require('../models/bannerModel');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({
    dest:'d:/tmp'
})

const router = express.Router();

//添加banner
router.post('/add', upload.single('bannerImg'), function (req, res) {
    //1.操作文件
    let newFileName = new Date().getTime() + '_' + req.file.originalname;
    let newFilePath = path.resolve(__dirname,'../public/uploads/banners/',newFileName);

    //2.移动文件
    try{
        let data = fs.readFileSync(req.file.path);
        fs.writeFileSync(newFilePath,data);
        fs.unlinkSync(req.file.path);

        //文件的名字+banner图的名字写到数据库
        let banner = new BannerModel({
            name:req.body.bannerName,
            imgUrl: 'http://localhost:3000/uploads/banners/'+newFileName
        });
        banner.save().then(() => {
            res.json({
                code:0,
                msg:'ok'
            })
        }).catch(error => {
            res.json({
                code:-1,
                msg:error.message
            })
        });
    }catch(error){
        res.json({
            code:-1,
            msg:error.message
        })
    }


    /* //获取前端传递过来的参数
    var banner = new BannerModel({
        name: req.body.bannerName,
        imgUrl: req.body.bannerUrl
    });

    banner.save(function (err) {
        if (err) {
            res.json({
                code: -1,
                msg: err.message
            })
        } else {
            res.json({
                code: 0,
                msg: 'ok'
            })
        }
    }); */
});

// 搜索or查询banner - http://localhost:3000/banner/search
router.get('/search', function (req, res) {
    //分页
    //1.得到前端传递过来的参数
    let pageNum = parseInt(req.query.pageNum) || 1;//当前的页数
    let pageSize = parseInt(req.query.pageSize) || 2;//每页显示的条数

    //采用并行无关联
    async.parallel([
        function (cb) {
            BannerModel.find().count().then(function (num) {
                cb(null, num);
            }).catch(function (err) {
                cb(err);
            })
        },
        function (cb) {
            BannerModel.find().skip(pageNum * pageSize - pageSize).limit(pageSize).then(function (data) {
                cb(null, data);
            }).catch(
                function (err) {
                    cb(err);
                }
            )
        }
    ], function (err, result) {
        console.log(result);
        if (err) {
            res.json({
                code: -1,
                msg: err.message
            });
        } else {
            res.json({
                code: 0,
                msg: 'ok',
                data: result[1],
                totalPage: Math.ceil(result[0] / pageSize)
            });
        }
    });
});


// 删除 - http://localhost:3000/banner/delete
router.post('/delete', function (req, res) {
    //1.得到要删除的字段
    let id = req.body.id;
    BannerModel.findOneAndDelete({
        _id: id
    }).then(data => {
        if (data) {
            res.json({
                code: 0,
                msg: 'ok'
            })
        } else {
            res.json({
                code: -1,
                msg: '未找到相关记录'
            })
        }
        console.log(data);

    }).catch(error => {
        res.json({
            code: -1,
            msg: error.message
        })
    })
})



// router.get('/search',function(req,res){
//     BannerModel.find(function(err,result){
//         console.log(result);
//         if(err){
//             console.log('查询失败');
//             res.json({
//                 code:-1,
//                 msg:err.message
//             })
//         }else{
//             console.log('查询成功');
//             res.json({
//                 code:0,
//                 msg:'ok',
//                 data:result
//             })
//         }
//     });
// });

module.exports = router;