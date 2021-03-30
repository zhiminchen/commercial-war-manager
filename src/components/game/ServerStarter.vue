<template>
    <div>
      <!--  面包屑导航区域  -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>游戏启动器</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>
          <el-tag>全服服务器列表:</el-tag>
        </el-row>


        <el-row style="margin-top: 5px">
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="checkedServers" @change="handleCheckedServerChange" >
            <el-checkbox v-for="server in serverOptions" :label="server" :key="server">{{server}}</el-checkbox>
          </el-checkbox-group>
        </el-row>

        <el-row style="margin-top: 20px">

          <el-col :span="5">
            <el-select v-model="action" placeholder="请选择">
              <el-option
                v-for="item in actionOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="5">
            <el-input v-model="pwd"  show-password size="medium"  clearable></el-input>
          </el-col>


          <el-button size= "medium" type="danger"  @click="operation" style="float:right;">操作</el-button>
        </el-row>


      </el-card>
    </div>
</template>

<script>
  export default {
    name: 'ServerStarter',

    data() {
      return {
        serverOptions: [],
        checkedServers: [],
        // 是否全选
        checkAll: false,
        isIndeterminate: true,
        action: '',
        actionOptions:[
          {id: 1 , name : '重启'},{id:2 ,name: '更新'},{id: 3, name : '停服'}
        ],
        pwd : '',
      }
    },

    created () {
      this.queryAllGameServer()
    },

    methods : {
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

      // 获取所有服务器列表
      async queryAllGameServer () {
        const {data: res} = await this.$http.get('/gm/game/servers', {params: {}})
        if (res.meta.status != 200) {
          return this.$message.error('获取游戏服务器列表失败!')
        }

        this.serverOptions = res.data.map(e => e.value)
        // console.log(this.serverOptions)

      },

      // 操作
      async operation() {

        if(this.checkedServers.length <= 0){
          return this.$message.error('请选择服务器！')

        }

        if(!this.action){
          return this.$message.error('请选择服务器行为!')
        }

        if(!this.pwd){
          return this.$message.error('请输入密码!')
        }

        // let content = "<strong> 服务器列表为 : _0 </strong> </br> <strong> 服务器行为 : _1 </strong> </br> "
        let content = "<strong> 服务器列表为 : </strong> </br> _0 </br></br><strong> 服务器行为:&nbsp&nbsp&nbsp&nbsp _1 </strong> </br> "

        let strList = []
        this.checkedServers.forEach(e => {
          let one = "<strong> 服务器 :&nbsp&nbsp&nbsp&nbsp   _0 </strong> ".replace("_0", e)
          strList.push(one)
        })


        let actionName = ''
        this.actionOptions.forEach( e => {
          if(e.id === this.action){
            actionName = e.name;
          }
        })

        let xx =  strList.join('</br>')
        content = content.replace("_0", xx)
        content = content.replace("_1" , actionName)


        const confirmResult = await this.$confirm.confirm(content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除')
        }

        let param = {
          servers : this.checkedServers.join(","),
          action : this.action,
          md5: this.$md5(this.pwd)
        }

        const {data: res} = await this.$http.post('/gm/game/server/action', param)

        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        if(!res.data){
          return this.$message.error('沒有任何服务器操作到!')
        }


        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message:  res.data
        })


      }

    }
  }
</script>

<style scoped>

</style>
