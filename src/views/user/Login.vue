<template>
  <div>
    <div class="header">
      <div class="title">客服登录</div>
      <!-- <div class="logo">
        <img src="http://img.cixi518.com/ljh_logo.jpeg" alt="default_logo">
      </div> -->
    </div>
    <div class="content">
      <van-field placeholder="账号名" v-model="name" left-icon="phone-o" :error-message="nameError" />
      <!-- eye -->
      <van-field v-if="loginWay==='password'" placeholder="登录密码" v-model="password" left-icon="lock" :type="passwordType">
         <van-icon slot="right-icon" @click="switchPasswordType" :name="passwordIcon"/>
      </van-field>
      <van-field v-else placeholder="短信验证码" v-model="password" left-icon="comment-o" type="text">
        <VerifyCodeBtn slot="button" @sendVerifyCode="sendVerifyCode" />
      </van-field>
      <div class="button-wrap">
        <van-button size="large" @click="handleLogin" type="info">登录</van-button>
      </div>
      <!-- <div class="more-wrap">
        <router-link class="link" to="/register">没有账号？去注册</router-link>
        <div class="switch-way" @click="switchLoginWay">{{loginWayObj.toggleMsg}}</div>
      </div> -->
    </div>
  </div>
</template>
<script>
import { Field, Icon, Button } from 'vant'
import VerifyCodeBtn from '@/components/VerifyCodeBtn'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      name: '',
      password: '',
      code: '',
      loginWay: 'password',
      passwordType: 'password',
      nameError: ''
    }
  },
  methods: {
    ...mapActions('CustomerService', [
      'login' // 登录
    ]),
    sendVerifyCode () {
      this.nameError = ''
      if (!this.name) { // 根据需求做判断
        this.nameError = '手机号码必填'
      }
    },
    switchPasswordType () {
      this.passwordType = this.passwordType === 'password' ? 'text' : 'password'
    },
    switchLoginWay () {
      this.password = this.code = ''
      this.loginWay = this.loginWay === 'password' ? 'verifyCode' : 'password'
    },
    handleLogin () {
      const data = {
        name: this.name,
        password: this.password
      }
      this.sendVerifyCode()
      this.login(data).then((res) => {
        setTimeout(() => {
          const redirect = '/AllContact'
          this.$router.replace({
            path: redirect
          })
        }, 1500)
      })
    }
  },
  computed: {
    loginWayObj: function () {
      if (this.loginWay === 'password') {
        return {
          icon: 'closed-eye',
          toggleMsg: '验证码登录'
        }
      }
      return {
        icon: 'eye',
        toggleMsg: '密码登录'
      }
    },
    passwordIcon: function () {
      return this.passwordType === 'password' ? 'closed-eye' : 'eye'
    }
  },
  components: {
    [Field.name]: Field,
    [Icon.name]: Icon,
    [Button.name]: Button,
    VerifyCodeBtn
  },
  created () {
  }
}
</script>
<style lang="scss" scoped>
  .header{
    width: 100%;
    height: 165px;
    display: flex;
    justify-content: center;
    align-items: center;
    .title {
      font-size: 18px;
      font-weight: bold;
    }
    .logo{
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
      }
    }
  }
  .content{
    width: 100%;
    height: auto;
    padding: 0 15px;
    box-sizing: border-box;
    .button-wrap{
      width: 100%;
      height: auto;
      margin-top: 15px;
    }
  }
  .more-wrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;
    font-size: 14px;
    a.link{
      color: #1989fa;
    }
    .switch-way{
      color: #333;
    }
  }

</style>
