(function(){
    var User = function(){
        this.btnLock = false; //登录按钮的锁,请求结束之前禁止点击

        this.dom = {
            submitBtn : $('#btn'),
            userNameInput:$('input[type=text]'),
            passwordInput:$('input[type=password]')
        }
    }


    User.prototype.bindDOM = function(){
        var that = this;
        this.dom.submitBtn.click(function(){
            //发送ajax请求之前，先判断是否有锁
            if(!that.btnLock){
                //没锁的时候，加把锁，并且发请求
                that.btnLock = true;
                that.handleLogin();
            }
        })
    }

    //登录方法，调取ajax
    User.prototype.handleLogin = function(){
        var that = this;
        $.post('/user/login',{
            userName:this.dom.userNameInput.val(),
            password:this.dom.passwordInput.val()
        },function(res){
            if(res.code === 0){
                //登录成功
                layer.msg('登录成功');
                console.log(res.data);

                setTimeout(function(){
                    window.location.href = '/';
                },1000);
            }else{
                //登录失败
                layer.msg(res.msg);
            }

            //无论成功与否，都要解锁
            that.btnLock = false;
        })
    }


    //最后
    var user = new User();
    user.bindDOM();
})();