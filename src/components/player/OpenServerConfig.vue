<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>开服配置</el-breadcrumb-item>

      </el-breadcrumb>



      <el-card>

        <el-row>
          <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        </el-row>

        <el-row style="margin-top: 20px">
          <el-table :data="dataList" stripe border>
            <el-table-column prop="serverId" label="服务器ID" align="center"></el-table-column>
            <el-table-column prop="name" label="服务器名" align="center"></el-table-column>
            <el-table-column prop="openTime" label="开服时间" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>

        </el-row>

      </el-card>



      <el-dialog
        title="区服状态对话框"
        :visible.sync="editDialogVisible"
        width="25%" @close="editDialogClose"
        :close-on-click-modal="false"
      >

        <div>
          <h3>服务器ID</h3>
          <el-input v-model="serverId"  :disabled="true"> </el-input>
        </div>

        <div>
          <h3>服务器名称</h3>
          <el-input v-model="serverName"  > </el-input>
        </div>

        <div>

          <h3>服务器时间</h3>
          <el-date-picker
            v-model="openTime"
            type="datetime"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd HH:mm:SS"
          >
          </el-date-picker>
        </div>


        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false">取 消</el-button>
            <el-button type="primary" size="medium" @click="putData">确 定</el-button>
          </span>
      </el-dialog>

    </div>
</template>

<script>
  export default {
    name: 'OpenServerConfig',
    data() {
      return {
        dataList : [],
        editDialogVisible : false,
        serverId : '',
        serverName : '',
        openTime : '',

      }
    },
    created () {
      // this.queryData()
    },

    methods: {
      async queryData() {

        const {data : res} = await this.$http.get("/gm/op/no/open/servers",)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败')
        }

        this.dataList = res.data
        if(!this.dataList || this.dataList.length <= 0){
          this.$message.warning("没有查询出数据！")
        }
      },

      // 同步数据
      async putData() {

        if(!this.serverId){
          return this.$message.error("服务器ID未知错误！")
        }

        if(!this.serverName){
          return this.$message.error("请输入服务器名称")
        }

        if(!this.openTime){
          return this.$message.error("请输入服务器开服时间")
        }

        const confirmResult = await this.$confirm.confirm("确定要要修改数据吗", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消操作')
        }

        let param  = {
          serverId : this.serverId,
          serverName : this.serverName,
          openTime : this.openTime
        }

        const {data : res} = await this.$http.post("/gm/op/edit/server/time", param)
        if(res.meta.status !== 200){
          return this.$message.error('设置失败')
        }
        this.$message.success("更新数据成功！")
        this.editDialogVisible = false
        this.queryData()
      },


      edit(data){
        this.editDialogVisible = true
        this.serverId = data.serverId
        this.serverName = data.name
        this.openTime = data.openTime
      },

      editDialogClose() {
        this.editDialogVisible = false
        this.serverId = ''
        this.serverName = ''
        this.openTime = ''
      }
    }
  }
</script>

<style scoped>

</style>
