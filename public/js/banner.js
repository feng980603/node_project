(function () {
    // 定义这个文件操作的构造函数
    var Banner = function () {
        //定义这个页面需要的一些数据
        this.pageNum = 1;   //当前的页码数
        this.pageSeze = 2;  //每页显示的条数
        this.totalPage = 0; //总的页数
        this.bannerList = [];   //banner数据

        //需要用到的dom对象 性能优化 dom缓存
        this.dom = {
            table: $('#banner-table tbody'),//table的tbody
            pagination: $('#pagination'),//分页的ul
            nameInput: $('#inputEmail3'),//名字的1输入框
            urlInput: $('#inputPassword3'),//url输入框
            addModal: $('#addModal'),//新增的模态框
            submitAdd: $('#bannerAdd'),//确认新增的按钮
        }
    }

    //新增的方法
    Banner.prototype.add = function () {
        var that = this;
        //ajax 提交 并且带有文件

        //1.实例化一个FormData 对象
        var formData = new FormData();

        //2.给formData对象 加属性
        formData.append('bannerName',this.dom.nameInput.val());
        formData.append('bannerImg',this.dom.urlInput[0].files[0]);

        $.ajax({
            url:'/banner/add',
            method:'POST',
            //上传文件的时候，需要设置这俩个属性
            contentType:false,
            processData:false,
            data:formData,
            success:function(){
                layer.msg('添加成功');
                that.search();
            },
            error:function(error){
                console.log(error.message);
                layer.msg('网络异常，请稍后重试');
            },
            complete:function(){
                //不管成功还是失败，都会进入这个回调函数
                //手动调用关闭的方法
                that.dom.addModal.modal('hide');
                //清空输入框的内容
                that.dom.nameInput.val('');
                that.dom.urlInput.val('');
            }
            
            
        });



        /* $.post('/banner/add', {
            bannerName: this.dom.nameInput.val(),
            bannerUrl: this.dom.urlInput.val()
        }, function (res) {
            // console.log(res);
            if (res.code === 0) {
                //成功
                layer.msg('添加成功');

                //请求一下数据
                that.search();
            } else {
                console.log(res.msg);
                layer.msg('网络异常，请稍后重试');
            }

            //手动调用关闭方法
            that.dom.addModal.modal('hide');
            //手动清空输入框的内容
            that.dom.nameInput.val('');
            that.dom.urlInput.val('');
        }); */
    }


    //查询的方法
    Banner.prototype.search = function(){
        var that = this;
        $.get('/banner/search',{
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (result) {
            if (result.code === 0) {
                layer.msg('查询成功');

                //将result.data 写入到 实例的 bannerList
                that.bannerList = result.data;
                //将result.totalPage 写入到实例的totalPage
                that.totalPage = result.totalPage;

                //调用渲染table
                that.renderTable();

                //调用渲染分页
                that.renderPage();
                
            } else {
                console.log(result.msg);
                layer.msg('网络异常，请稍后重试');
            }
        })
    }

    //渲染table
    Banner.prototype.renderTable = function(){
        this.dom.table.html('');
        for (var i = 0; i < this.bannerList.length; i++) {
            var item = this.bannerList[i];
            this.dom.table.append(
                `
                    <tr>
                    <td>${item._id}</td>
                    <td>${item.name}</td>
                    <td>
                    <img class="banner-img" src="${item.imgUrl}"
                    alt="">
                    </td>
                    <td>
                        <a class="delete" data-id="${item._id}" href="javascript:;">删除</a>
                        <a class="update" data-id="${item._id}" href="javascript:;">修改</a>
                    </td>
                    </tr>
                `
            )
        }
    }

    //渲染分页
    Banner.prototype.renderPage = function(){
        var prevClassName = this.pageNum === 1 ? 'disabled' : '';
        var nextClassName = this.pageNum === this.totalPage ? 'disabled' : '';

        //清空
        this.dom.pagination.html('');

        //添加上一页
        this.dom.pagination.append(
            `
            <li class="${prevClassName}" data-num="${this.pageNum - 1}">
              <a href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            `
        );

        //根据this.totalpage 循环渲染多少个li
        for(var i = 1;i <= this.totalPage;i++){
            var className = this.pageNum === i ? 'active' : '';
            this.dom.pagination.append(
                `
                <li class="${className}" data-num="${i}"><a href="#">${i}</a></li>
                `
            )
        }


        //添加下一页
        this.dom.pagination.append(
            `
            <li class="${nextClassName}" data-num="${this.pageNum + 1}">
                <a href="#" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
            `
        )
    }

    //将所有的dom 事件的操作放在这里
    Banner.prototype.bindDOM = function(){
        var that = this;
        //点击确认新增按钮需要调用add
        this.dom.submitAdd.click(function(){
            that.add();
        })

        //分页按钮点击事件
        this.dom.pagination.on('click','li',function(){
            //1.得到页码
            //attr获取属性，如果是自定义属性且用data-开头，可以用更简单的   data
            var num = parseInt($(this).data('num'));

            //1.1判断是否点击的是相同页面，或者左右按钮
            if(that.pageNum === num || num < 1 || num > that.totalPage){
                return;
            }

            //2.设置给this.pageNum
            that.pageNum = num;

            //3.再次调用查询this.search
            that.search();
        })

        //删除按钮点击
        this.dom.table.on('click','.delete',function(){
            //1.得到id
            var id = $(this).data('id');

            //2.二次确认框
            layer.confirm('确认删除吗',function(){
                
            },function(){
                
            })
        })
    }

    //最后
    $(function(){
        var banner = new Banner();
        banner.bindDOM();
        banner.search();//默认渲染第一页
    })
})();















// $(function(){
//     var pageNum = 1;
//     var pageSize = 2;

//     //默认调用一次 search
//     search(pageNum,pageSize);

//     $('#bannerAdd').click(function(){
//         $.post('/banner/add',{
//             bannerName:$('#inputEmail3').val(),
//             bannerUrl:$('#inputPassword3').val()
//         },function(res){
//             console.log(res);
//             if(res.code === 0){
//                 //成功
//                 layer.msg('添加成功');
//             }else{
//                 console.log(res.msg);
//                 layer.msg('网络异常，请稍后重试');
//             }

//             //手动调用关闭方法
//             $('#myModal').modal('hide');
//             //手动清空输入框的内容
//             $('#inputEmail3').val('');
//             $('inputPassword3').val('');
//         });
//     });
// });

// /**
//  * 查询banner数据的方法
//  * @param {Number} pageNum 当前的页数
//  * @param {Number} pageSize 每页显示的条数
//  */
// function search(pageNum,pageSize){
//     $.get('/banner/search',{
//         pageNum:pageNum,
//         pageSize:pageSize
//     },function(result){
//         if(result.code === 0){
//             layer.msg('查询成功');

//             for(var i = 0;i < result.data.length;i++){
//                 var item = result.data[i];
//                 $('#banner-table tbody').append(
//                     `
//                         <tr>
//                         <td>${item._id}</td>
//                         <td>${item.name}</td>
//                         <td>
//                         <img class="banner-img" src="${item.imgUrl}"
//                         alt="">
//                         </td>
//                         <td>
//                             <a href="javascript:;">删除</a>
//                             <a href="javascript:;">修改</a>
//                         </td>
//                         </tr>
//                     `
//                 );
//             }
//         }else{
//             console.log(result.msg);
//             layer.msg('网络异常，请稍后重试');
//         }
//     })
// }