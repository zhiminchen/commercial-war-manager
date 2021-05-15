<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动日期分布</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>

        <el-row>
          <el-col :span="6">
            <el-select v-model="selectGame" placeholder="请选择游戏服务器">
              <el-option
                v-for="item in gameConfigList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="6">
            <el-button icon="el-icon-search" type="primary" @click="queryAction">查询</el-button>
          </el-col>

        </el-row>

<!--        <el-row style="margin-top: 20px">-->
<!--          <el-table :data="dataList" stripe border >-->
<!--            <el-table-column prop="monday" label="星期一" ></el-table-column>-->
<!--            <el-table-column prop="tuesday" label="星期二" align="center" ></el-table-column>-->
<!--            <el-table-column prop="wednesday" label="星期三" align="center" ></el-table-column>-->
<!--            <el-table-column prop="Thursday" label="星期四" align="center" ></el-table-column>-->
<!--            <el-table-column prop="friday" label="星期五" align="center" ></el-table-column>-->
<!--            <el-table-column prop="saturday" label="星期六" align="center" ></el-table-column>-->
<!--            <el-table-column prop="sunday" label="星期日" align="center" ></el-table-column>-->
<!--          </el-table>-->

<!--        </el-row>-->

          <el-table :data="dataList" stripe border >
            <el-table-column prop="monday" label="星期一"  >
              <template slot-scope="scope">
                <div v-html="scope.row.monday"></div>
              </template>
            </el-table-column>

            <el-table-column prop="tuesday" label="星期二" align="center" >
              <template slot-scope="scope">
                <div v-html="scope.row.tuesday"></div>
              </template>
            </el-table-column>

            <el-table-column prop="wednesday" label="星期三" align="center" >
              <template slot-scope="scope">
                <div v-html="scope.row.wednesday"></div>
              </template>
            </el-table-column>

            <el-table-column prop="thursday" label="星期四" align="center" >
              <template slot-scope="scope">
                <div v-html="scope.row.thursday"></div>
              </template>
            </el-table-column>

            <el-table-column prop="friday" label="星期五" align="center" >
              <template slot-scope="scope">
                <div v-html="scope.row.friday"></div>
              </template>
            </el-table-column>

            <el-table-column prop="saturday" label="星期六" align="center" >
              <template slot-scope="scope">
                <div v-html="scope.row.saturday"></div>
              </template>
            </el-table-column>

            <el-table-column prop="sunday" label="星期日" align="center" >
              <template slot-scope="scope">
                <div v-html="scope.row.sunday"></div>
              </template>
            </el-table-column>

          </el-table>


      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'ActivityDayDistribution',
    data() {
      return {
        gameConfigList : [],
        selectGame: '',
        dataList : [],
        // dataList : [{monday: '123<br/>234<br/>'}],
        style: "background-color:red",
      }
    },

    created () {
      this.queryGameConfig()
    },

    methods: {
      // 查询游戏配置
      async queryGameConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/game")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏配置失败！')
        }
        this.gameConfigList = res.data

        if(this.gameConfigList.length > 1){
          this.gameConfigList.splice(0, 1);
        }


      },

      // 查询行为数据
      async  queryAction(){

        if(!this.selectGame){
          return this.$message.error("请选择服务器")
        }

        let param = {
          serverId : this.selectGame ,
        }

        const {data : res} = await this.$http.post("/gm/game/activity/time/distribution", param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败！')
        }
        this.dataList = res.data

      },

    }

  }
</script>

<style scoped lang="less">


  .cell-class  {
      text-align: center;
      white-space: pre-line;
  }

</style>
