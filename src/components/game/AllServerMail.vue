<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>全服邮件</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-tag>全服服务器列表:</el-tag>
      </el-row>

      <el-row>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedServers" @change="handleCheckedServerChange">
          <el-checkbox v-for="server in serverOptions" :label="server" :key="server">{{server}}</el-checkbox>
        </el-checkbox-group>
      </el-row>

      <div class="row-mail">
        <el-row>
          <el-tag>邮件服务区域</el-tag>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-select v-model="currMailId" placeholder="请选择">
              <el-option
                v-for="item in mailList"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-input placeholder="请输入奖励配置" v-model="mailAward" clearable></el-input>
          </el-col>

          <el-col :span="5" style="float: right">
            <el-button type="success" icon="el-icon-message" round @click="sendServersMail">发送邮件</el-button>
          </el-col>

        </el-row>

      </div>

    </el-card>


  </div>
</template>

<script>
  const def_not_select_mail = '没有选中邮件'
  export default {
    name: 'allservermail',
    data () {
      return {
        serverOptions: [],
        checkedServers: [],
        // 是否全选
        checkAll: false,
        isIndeterminate: true,
        // 当前邮件模板id
        currMailId: def_not_select_mail,
        // 邮件模板列表
        mailList: [],
        // 邮件奖励
        mailAward: '',

      }
    },

    created () {
      this.queryAllGameServer()
      this.queryAllMailList()
    },

    methods: {

      // 获取所有服务器列表
      async queryAllGameServer () {
        const {data: res} = await this.$http.get('/gm/game/servers', {params: {}})
        if (res.meta.status != 200) {
          return this.$message.error('获取游戏服务器列表失败!')
        }

        this.serverOptions = res.data.map(e => e.value)
        console.log(this.serverOptions)

      },

      // 查询邮件列表
      async queryAllMailList () {
        const {data: res} = await this.$http.get('/gm/game/mails', {params: {}})
        if (res.meta.status != 200) {
          return this.$message.error('获取邮件模板列表失败!')
        }

        this.mailList = res.data
        console.log(this.mailList)
      },

      // 全选
      handleCheckAllChange (val) {
        this.checkedServers = val ? this.serverOptions : []
        this.isIndeterminate = false
      },

      handleCheckedServerChange (value) {
        let checkedCount = this.checkedServers.length
        this.checkAll = checkedCount === this.serverOptions.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.serverOptions.length
      },

      // 发送服务器邮件
      async sendServersMail () {
        if (this.checkedServers.length === 0) {
          return this.$message.error('至少要选择一个游戏服务器!')
        }

        if (this.mailAward === '' || this.mailAward == "undefined" || this.mailAward == "" ) {
          return this.$message.error('需要输入邮件奖励！')
        }

        if(this.currMailId === def_not_select_mail){
          return this.$message.error("还没有选择邮件模板!")
        }

        const {data: res} = await this.$http.get('/gm/game/mail/award',{
          params : {
            servers: this.checkedServers.join(","),
            mailTitle: this.currMailId,
            awards: this.mailAward
          }
        })

        if(res.meta.status != 200 ){
          return this.$message.error("发送全服邮件失败!")
        }

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message:  res.data
        })

        // return this.$message.success("这些服务器发送全服邮件成功 ! " +res.data)

      }

    }
  }
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }

  .row-mail {
    margin-top: 20px;
    padding-top: 30px;
  }
</style>
