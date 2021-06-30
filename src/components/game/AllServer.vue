<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>全服管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <h4>全服服务器列表:</h4>
      </el-row>

      <el-row>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedServers" @change="handleCheckedServerChange">
          <el-checkbox v-for="server in serverOptions" :label="server" :key="server">{{server}}</el-checkbox>
        </el-checkbox-group>
      </el-row>

      <div class="row-all-table">
          <el-row>
            <h5>更新所有配置表区域 : </h5>
          </el-row>
          <el-row>
            <el-button style="margin-top: 20px;" type="primary" plain @click="updateAllConfigTable">
              一键加载所有配置表
            </el-button>
          </el-row>
      </div>



      <div class="row-one-table">
        <el-row >
          <h5>单独配置表更新区域 : </h5>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-select  v-model="selectItemList" placeholder="请选择" multiple filterable clearable reserve-keyword>
              <el-option
                v-for="item in configTableList"
                :key="item.tableName"
                :label="item.tableName"
                :value="item.tableName">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="5" style="float: right">
            <el-button type="primary" icon="el-icon-bottom" plain @click="updateConfigTable">更新选中的配置表</el-button>
          </el-col>
        </el-row>
      </div>

<!--      <div class="row-all-kick">-->
<!--        <el-row style="margin-bottom: 20px">-->
<!--          <el-tag>踢掉所有玩家区域 : </el-tag>-->
<!--        </el-row>-->
<!--        <el-row>-->

<!--          <el-button solot="reference" type="primary" plain @click="kickAllPlayers">-->
<!--            一键剔除所有玩家-->
<!--          </el-button>-->
<!--        </el-row>-->
<!--      </div>-->

      <div class="row-component">
        <el-row style="margin-bottom: 20px">
          <h5>从新加载组件数据区域 :</h5>
        </el-row>


        <el-row>
          <el-col :span="8">
            <el-select  v-model="selectComponentList" placeholder="请选择组件" multiple filterable clearable reserve-keyword>
              <el-option
                v-for="item in componentList"
                :key="item.key"
                :label="item.value"
                :value="item.key">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="5" style="float: right">
            <el-button type="primary" icon="el-icon-bottom" plain @click="reloadComponentData">加载选中的组件</el-button>
          </el-col>
        </el-row>

      </div>


      <div class="row-component">
        <el-row style="margin-bottom: 10px">
          <h5>重新统计数据区域 :</h5>
        </el-row>

        <el-row>
          <el-button type="primary" icon="el-icon-view" plain @click="countData">重新统计日常数据</el-button>
        </el-row>


      </div>



      <div class="row-component">
        <el-row style="margin-bottom: 20px">
          <h5>调用游戏服务器对外接口区域 : </h5>
        </el-row>

        <el-row>
          <el-button type="primary" icon="el-icon-link" plain @click="callGameInterface">调用接口</el-button>
        </el-row>


      </div>



    </el-card>

  </div>
</template>

<script>
  export default {
    name: 'allserver',
    data () {

      return {
        serverOptions: [],
        checkedServers: [],
        // 是否全选
        checkAll: false,
        isIndeterminate: true,
        configTableList: [],
        // 选中项
        selectItemList : '',
        // 选中的组件
        selectComponentList: '',
        // 组件列表
        componentList: [],

      }
    },

    created () {
      this.queryAllGameServer()
      this.tableList();
      this.queryComponentList()
    },

    methods: {
      // 获取所有服务器列表
      async queryAllGameServer () {
        const {data: res} = await this.$http.get('/gm/game/servers', {params: {}})
        if (res.meta.status != 200) {
          return this.$message.error('获取游戏服务器列表失败!')
        }

        this.serverOptions = res.data.map(e => e.value)
        // console.log(this.serverOptions)

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

      // 更新所有配置表数据
      async updateAllConfigTable(){

        if (this.checkedServers.length === 0) {
          return this.$message.error('至少要选择一个游戏服务器!')
        }

        const confirmResult = await this.$confirm.confirm('此操作将会把所有表的数据重新加载', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

        if(confirmResult !== 'confirm'){
          return this.$message.info('取消了加载所有配置表的数据！');
        }


        // console.log("updateAllConfigTable")
        const {data: res} = await this.$http.post('/gm/game/tables/config', JSON.stringify({
            servers: this.checkedServers.join(","),
          }))
        if( res.meta.status != 200){
          return this.$message.error("一键重新加载配置表失败!")
        }

        // this.$message.success("一键加载所有数据成功！")

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message: res.data
        })
      },

      // 组件列表
      async queryComponentList() {
        const {data: res} = await this.$http.get('/gm/game/components')
        if (res.meta.status != 200) {
          return this.$message.error('获取组件数据失败！')
        }


        this.componentList = res.data
        console.log(this.componentList)
      },


      // 列表集合
      async tableList () {
        const {data: res} = await this.$http.get('/gm/config/tables')
        if (res.meta.status != 200) {
          return this.$message.error('获取配置表失败！')
        }
        this.configTableList = res.data
        // console.log(this.configTableList)
      },

      // 统计数据
      async countData(){
        const confirmResult = await this.$confirm.confirm('此操作将会重新统计最近7天的数据', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

        if(confirmResult !== 'confirm'){
          return this.$message.info('取消了重新统计数据的操作！');
        }

        const {data: res} = await this.$http.get('/gm/game/count/data')
        if( res.meta.status != 200){
          return this.$message.error("统计数据失败！")
        }

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message: res.data
        })


      },

      // 调用游戏接口
      async callGameInterface(){
        const confirmResult = await this.$confirm.confirm('此操作将会调用游戏接口执行代码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

        if(confirmResult !== 'confirm'){
          return this.$message.info('取消了调用游戏接口！');
        }

        if (this.checkedServers.length === 0) {
          return this.$message.error('至少要选择一个游戏服务器!')
        }

        let param = {
          servers : this.checkedServers.join(","),
        }

        const {data: res} = await this.$http.post('/gm/game/call/server', param)
        if( res.meta.status != 200){
          return this.$message.error("调用服务器接口失败!")
        }

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message: res.data
        })



      },



      // 重新加载组件数据
      async reloadComponentData(){
        if(this.selectComponentList == ''){
          return this.$message.error("至少选择一个组件！")
        }

        if (this.checkedServers.length === 0) {
          return this.$message.error('至少要选择一个游戏服务器!')
        }


        let param = {
          servers : this.checkedServers.join(","),
          tables : this.selectComponentList.join(","),
        }
        // console.log(param)

        const {data: res} = await this.$http.post('/gm/game/reload/component', JSON.stringify(param))
        if( res.meta.status != 200){
          return this.$message.error("一键重新加载组件数据失败!")
        }

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message: res.data
        })


      },


      // 单独更新配置表
      async updateConfigTable() {
        if(this.selectItemList == ''){
          return this.$message.error("至少选择一个配置表！")
        }

        if (this.checkedServers.length === 0) {
          return this.$message.error('至少要选择一个游戏服务器!')
        }

        const confirmResult = await this.$confirm.confirm('此操作将会把选中表的数据重新加载', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

        if(confirmResult !== 'confirm'){
          return this.$message.info('取消了加载选中配置表的数据！');
        }



        // console.log("updateAllConfigTable")
        let param = {
          servers : this.checkedServers.join(","),
          tables : this.selectItemList.join(","),
        }
        console.log(param)
        const {data: res} = await this.$http.post('/gm/game/same/tables', JSON.stringify(param))
        if( res.meta.status != 200){
          return this.$message.error("一键重新加载配置表失败!")
        }

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message: res.data
        })

      },

      // 剔掉所有玩家
      async kickAllPlayers(){
        // if(this.selectItemList == ''){
        //   return this.$message.error("至少选择一个配置表！")
        // }
        const confirmResult = await this.$confirm.confirm('此操作将会把所有在线玩家踢下线', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err);

        if(confirmResult !== 'confirm'){
          return this.$message.info('取消踢下玩家！');
        }

        if (this.checkedServers.length === 0) {
          return this.$message.error('至少要选择一个游戏服务器!')
        }

        const {data : res} =  await this.$http.post("/gm/game/kick/all", { servers : this.checkedServers.join(",")})
        if(res.meta.status !== 200){
          return this.$message.error("请求踢下所有玩家失败！")
        }

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message: res.data
        })

      }

    }

  }
</script>

<style scoped>

  .row-all-table {
    margin-top: 20px;
    padding-top: 30px;
  }

  .row-one-table {
    margin-top: 20px;
    padding-top: 40px;
  }

  .row-all-kick {
    margin-top: 20px;
    padding-top: 20px;
  }

  .row-component {
    margin-top: 20px;
    padding-top: 20px;
  }
</style>
