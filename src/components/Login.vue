<template>
  <div class="login_container">
    <div class="login_box">
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
        <el-form-item label="" prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"></el-input>
        </el-form-item>
        <el-form-item label="" prop="password">
          <el-input v-model="loginForm.password" prefix-icon="iconfont icon-3702mima" type="password"></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登入</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',

  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 15, message: '长度在3到15个字符', trigger: 'blur'}
        ],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {min: 5, max: 15, message: '长度在5到15个字符', trigger: 'blur'}]
      }
    }
  },

  methods: {
    resetLoginForm: function () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      var loginForm = this.loginForm
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return
        }

        loginForm.password = this.$md5(loginForm.password )
        const {data: res} = await this.$http.post('/gm/login', JSON.stringify(loginForm))
        if (res.meta.status !== 200) {
          return this.$message.error('登入失败')
        }
        this.$message.success('登入成功')
        console.log(res)
        window.sessionStorage.setItem('token', res.data.password)
        window.sessionStorage.setItem('roleId' , res.data.roleId)
        window.sessionStorage.setItem('userName', res.data.userName)
        window.sessionStorage.setItem('id' , res.data.id)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped lang="less">
.login_container {
  background-color: rgba(199, 229, 216, 0.87);
  height: 100%;
}

.login_box {
  width: 380px;
  height: 280px;
  background-color: #eeeeee;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eeeeee;
    border-radius: 50%;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }

  }
;

}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}

/*.login_box .avatar_box{*/
/*  height: 130px;*/
/*  width: 130px;*/
/*}*/
/*.login_box .avatar_box img {*/
/*  width: 100%;*/
/*  height: 100%;*/
/*}*/

</style>
