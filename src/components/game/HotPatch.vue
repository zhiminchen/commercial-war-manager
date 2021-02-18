<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>热更新</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-table
          ref="multipleTable"
          :data="machineList"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange" border stripe>
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>

          <el-table-column
            prop="serverIp"
            label="ip"
            width="120">
          </el-table-column>
          <el-table-column
            prop="machineName"
            label="机器名称"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="serverList"
            label="运行进程"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px">
          <el-button @click="toggleSelection()">取消选择</el-button>
          <el-button @click="serverHotPatch" style="float: right"> 热更新</el-button>
        </div>
      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'hotfix',

    data() {
      return {
        //机器列表
        machineList : [],

        multipleSelection: []
      }
    },

    created () {
      this.queryAllMachine();
    },

    methods: {

      // 获取所有服务器列表
      async queryAllMachine() {
        const {data: res} = await this.$http.get('/gm/game/machines', {params: {}})
        if(res.meta.status != 200){
          return this.$message.error("获取物理服务列表失败!")
        }

        this.machineList = res.data ;
        // console.log(this.machineList)

      },

      toggleSelection(rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          });
        } else {
          this.$refs.multipleTable.clearSelection();
        }
      },

      handleSelectionChange(val) {
        this.multipleSelection = val;
      },

      // 热更新
      async serverHotPatch(){

        if(this.multipleSelection.length === 0){
          return this.$message.error("没有勾选服务器,不能进行热更新!")
        }

        let serverIpList = this.multipleSelection.map(x => x.serverIp)
        const {data: res} = await this.$http.get('/gm/game/hotfix',{
          params : {
            machines: serverIpList.join(","),
          }
        })

        if(res.meta.status != 200){
          return this.$message.error("服务器热更新失败！")
        }

        // this.$message.success("热更新成功！" + res.data)
        this.$message({
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message: "热更新成功！" + res.data
        })



      }

    }

  }
</script>

<style scoped>

</style>
