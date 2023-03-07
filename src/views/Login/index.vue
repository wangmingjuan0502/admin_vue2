<template>
  <div class="login">
    <div class="custom-form">
        <h1 class="title">系统登录</h1>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item  prop="username">
            <el-input prefix-icon="el-icon-s-custom" v-model="ruleForm.username" autocomplete="off" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item  prop="password">
            <el-input prefix-icon="el-icon-lock"  type="password" v-model="ruleForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item  prop="code" class="yanz">
            <el-input prefix-icon="el-icon-loading" v-model="ruleForm.code" maxlength="4" placeholder="请输入验证码"></el-input>
            <img @click="changeSrc" class="code" :src="code_src" alt="">
          </el-form-item>
          <el-form-item class="btn">
            <!-- <button>提交</button> -->
            <el-button class="btn1" @click="resetForm('ruleForm')">重置</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
          </el-form-item>
        </el-form>
    </div>
    
  </div>
</template>

<script>

import { v4 as uuidv4 } from 'uuid';
export default {
    data(){
        var checkAge = (rule, value, callback) => {
            
        if (!value) {
          return callback(new Error('验证码不能为空'));
        }else{
            callback();
        }
      };
      var validateUsername = (rule, value, callback) => {
        let reg = /^[^0-9]\w{5,12}$/
        if (!reg.test(value)) {
          return callback(new Error('账号输入有误'));
        } else {
          callback();
        }
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!/^[^0-9]\w{5,12}$/.test(value)) {
          callback(new Error('密码格式错误'));
        } else {
          callback();
        }
      };
        return {
          ruleForm: {
          username: '',
          password: '',
          code: ''
        },
        rules: {
            username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePass, trigger: 'blur' }
          ],
          code: [
            { validator: checkAge, trigger: 'blur' }
          ]
        },
        code_src: '',
        uuid: '',
        timmer: 0
        }
    },
    created(){
      this.reRenderCode();
      this.timmer = setInterval(() => {
        this.reRenderCode();
      },1000*60)
    },
    beforeDestroy(){
      clearInterval(this.timmer);
    },
    methods: {
      reRenderCode(){
        let uuid = uuidv4();
        this.uuid = uuid;
        this.code_src = `https://www.chengzier.cn:8000/api/generateimagecode?uuid=${uuid}`
      },
      changeSrc(){
        this.reRenderCode();
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
           this.$http({
            url: 'api/supersignin',
            method: 'POST',
            data: `username=${this.ruleForm.username}&password=${this.ruleForm.password}&uuid=${this.uuid}&text=${this.ruleForm.code}`
           }).then(res => {
            console.log(res);
              this.$message({
              showClose: true,
              message: res.data.msg,
              type: 'success'
            });
            this.$router.push('/');
           }).catch(res => {

           })
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }

}
</script>
<style>
   .login .el-form-item__content {
     margin: 0 !important;
   }
   .login .el-input input{
    border: 1px solid rgb(177, 177, 177);
    background-color: transparent;
    height: 47px;
    color: aliceblue;
   }
   .login .btn1{
    margin-left: 0 !important;
   }
   .login .yanz .el-form-item__content{
    width: 100%;
     display: flex;
   }
   .login .btn .el-form-item__content{
    display: flex;
    justify-content: space-between;
   }
</style>
<style lang="less" scoped>
   .login{
     position: absolute;
     top: 0;
     left: 0;
     right: 0;
     bottom: 0;
     background-image: url('@/assets/reg-bg.png');
     background-repeat: no-repeat;
     background-size: 100% 100%;
    background-color: #2d3a4b;
   }
   .custom-form{
    width: 300px;
    position: absolute;
     top: 50%;
     left: 50%;
     transform: translate(-50%,-50%);
   }
   .title{
    font-size: 26px;
    color: #eee;
    margin: 0 auto 40px auto;
    text-align: center;
    font-weight: 700;
   }
   .login .el-input{
     background-color: rgba(0,0,0,.2);
   }
   
   .login .btn el-button{
     display: block;
   }
   .login .yanz {
    display: flex;
   }
   .login .code{
     display: block;
     height: 47px;
     cursor: pointer;
     border-top-right-radius: 3px;
     border-bottom-right-radius: 3px;
   }
</style>