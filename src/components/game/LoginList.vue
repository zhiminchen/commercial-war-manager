<template>
    <div>

      <!--  面包屑导航区域  -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>服务器列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row >
          <el-input placeholder="请输入内容" v-model="search" class="input-with-select" size="mini" style="width: 400px" clearable @change="queryServerList">
            <el-button slot="append" icon="el-icon-search" @click="queryServerList"></el-button>
          </el-input>
        </el-row>


        <el-table :data="serverList" border stripe size="small">
          <el-table-column prop="serverId" label="服务器id" align="center"></el-table-column>
          <el-table-column prop="name" label="服务器名称" align="center"></el-table-column>
          <el-table-column prop="ip" label="ip地址或域名" align="center"></el-table-column>
          <el-table-column prop="type" label="类型" align="center"></el-table-column>
          <el-table-column prop="gamePort" label="游戏端口" align="center"></el-table-column>
          <el-table-column prop="gmPort" label="gm端口" align="center"></el-table-column>
          <el-table-column prop="state" label="状态" align="center"></el-table-column>
          <el-table-column prop="priority" label="优先级" align="center"></el-table-column>
          <el-table-column prop="openTime" label="开放时间" align="center"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="更新时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center">

            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="edit(scope.row)">编辑</el-button>
            </template>

          </el-table-column>
        </el-table>


      </el-card>

      <el-dialog
        title="服务器列表编辑对话框"
        :visible.sync="editDialogVisible"
        width="50%">
        <div>
          <el-row style="margin-bottom: 20px">
            服务器类型： <el-select v-model="selectType" placeholder="请选择服务器类型">
              <el-option
                v-for="item in serverType"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-row>



          <el-row style="margin-bottom: 20px">
            服务器状态： <el-select v-model="selectState" placeholder="请选择服务器类型">
            <el-option
              v-for="item in serverState"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          </el-row>


          <el-row style="margin-bottom: 20px">
            服务器优先级： <el-input-number v-model="priority"  :min="0" :max="100" label="描述文字"></el-input-number>
          </el-row>


        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="update">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  export default {
    name: 'LoginList' ,
    data() {
      return {
        search : '',
        serverList : [],
        serverType: [],
        serverState: [] ,
        editDialogVisible : false,
        selectType : '',
        selectState : '',
        priority : 0,
        serverId : 0,
      }

    },
    created () {
      this.queryServerList()
      this.queryServerType();
      this.queryServerState();
    },

    methods : {
      async queryServerList () {
        const {data: res} = await this.$http.post('/gm/game/login/list', {key : this.search})
        if (res.meta.status != 200) {
          return this.$message.error('获取登入服务器列表失败!')
        }

        this.serverList = res.data

      },

      // 查询服务器类型
      async queryServerType() {
        const {data: res} = await this.$http.get('/gm/game/server/type')
        if (res.meta.status != 200) {
          return this.$message.error('获取服务器类型列表失败!')
        }
        this.serverType = res.data
        // console.log(this.serverType)
      },


      // 查询服务器状态
      async queryServerState() {
        const {data: res} = await this.$http.get('/gm/game/server/state')
        if (res.meta.status != 200) {
          return this.$message.error('获取服务器状态列表失败!')
        }
        this.serverState = res.data
        // console.log(this.serverState)
      },

      // 编辑
      edit(server) {
        this.editDialogVisible=true
        this.serverType.forEach(e => {
          if(e.name === server.type){
            this.selectType = e.id ;

          }
        })

        this.serverState.forEach(e => {
          if(e.name === server.state){
            this.selectState = e.id ;
          }
        })

        this.priority = server.priority
        this.serverId = server.serverId

      },

      // 更新
      async update(){

        if(this.serverId <= 0){
          return this.$message.error("服务器id不合法，小于等于0 ")
        }

        if(!this.selectType){
          return this.$message.error("请选择服务器类型！")
        }

        if(!this.selectState){
          return this.$message.error("请选择服务器状态！")
        }

        if(this.priority < 0){
          return this.$message.error("请输入合法的优先级")
        }

        let param = {
          serverId : this.serverId ,
          priority : this.priority,
          serverType : this.selectType,
          serverState : this.selectState
        }

        const {data: res} = await this.$http.post('/gm/game/server/update' , param)
        if (res.meta.status != 200) {
          return this.$message.error('更新服务器失败！')
        }
        this.$message.success('更新服务器成功！')
        this.editDialogVisible = false ;
        this.queryServerList();

      }

    },



  }
</script>

<style scoped>

</style>
