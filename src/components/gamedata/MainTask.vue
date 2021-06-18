<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏数据</el-breadcrumb-item>
        <el-breadcrumb-item>主线任务</el-breadcrumb-item>
      </el-breadcrumb>


      <el-card>
        <el-row>
          <el-col :span="4">
            <el-select v-model="beginServerId" placeholder="请选择起始服务器">
              <el-option v-for="item in gameConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="endServerId" placeholder="请选择结束服务器">
              <el-option v-for="item in gameConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="playerType" placeholder="请选择玩家类型">
              <el-option v-for="item in playerTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>

          </el-col>

          <el-col :span="4" >
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>


        </el-row>


        <el-row style="margin-top: 20px">

          <el-table :data="dataList" stripe border>
            <el-table-column prop="dau" label="DAU" align="center"></el-table-column>
            <el-table-column prop="taskId" label="任务id" align="center"></el-table-column>
            <el-table-column prop="taskName" label="任务名称" align="center"></el-table-column>
            <el-table-column prop="count" label="人数" align="center"></el-table-column>
            <el-table-column prop="totalCount" label="完成总人数" align="center"></el-table-column>
          </el-table>
        </el-row>


      </el-card>


    </div>
</template>

<script>
  export default {
    name: 'MainTask',

    data() {
      return {
        beginServerId : '',
        endServerId: '' ,
        gameConfigList: [],
        // 玩家类型
        playerTypeList : [
          {id : 1 , name : '全部'},
          {id : 2 , name : '活跃玩家'},
          {id : 3 , name : '付费玩家'},
          {id : 4 , name : '流失玩家'},
        ],
        playerType : 1,
        dataList: [],
      }
    },

    created () {
      this.queryGameConfig()
    },

    methods : {
      // 查询游戏配置
      async queryGameConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/game")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏配置失败！')
        }
        this.gameConfigList = res.data
        if(this.gameConfigList.length){
          this.gameConfigList.splice(0,1);
        }


      },

      // 查询日期
      async queryData(){

        if(!this.beginServerId){
          return this.$message.error("请选择起始区服！")
        }

        if(!this.endServerId){
          return this.$message.error("请选择结束区服!")
        }

        if(!this.playerType){
          return this.$message.error("请选择玩家类型")
        }

        let param = {
          startServerId : this.beginServerId ,
          endServerId : this.endServerId,
          playerType : this.playerType
        }

        const {data : res} = await this.$http.post("/gm/game/data/main/task",param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;
        if(!this.dataList  || this.dataList.length == 0){
          this.$message.warning("没有查询出数据！")
        }

        // console.log(this.dataList)

      }


    }

  }
</script>

<style scoped>

</style>
