<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏数据</el-breadcrumb-item>
        <el-breadcrumb-item>排行榜数据</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>

          <el-col :span="4">
            <el-select v-model="serverId" placeholder="请选择服务器">
              <el-option v-for="item in gameConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
          </el-col>


          <el-col :span="4">
            <el-select v-model="type" placeholder="请选择排行榜类型">
              <el-option v-for="item in rankConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
          </el-col>


          <el-col :span="4">
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>

        </el-row>


        <el-row style="margin-top: 10px">
          <el-table :data="moneyDataList" stripe border>
            <el-table-column prop="rank" label="排名" align="center"></el-table-column>
            <el-table-column prop="name" label="玩家名称" align="center"></el-table-column>
            <el-table-column prop="level" label="玩家等级" align="center"></el-table-column>
            <el-table-column prop="data" label="挣钱速度" align="center"></el-table-column>
          </el-table>
        </el-row>

        <el-row style="margin-top: 10px">
          <el-table :data="powerDataList" stripe border>
            <el-table-column prop="rank" label="排名" align="center"></el-table-column>
            <el-table-column prop="name" label="玩家名称" align="center"></el-table-column>
            <el-table-column prop="level" label="玩家等级" align="center"></el-table-column>
            <el-table-column prop="power" label="玩家实力" align="center"></el-table-column>
          </el-table>
        </el-row>

        <el-row style="margin-top: 10px">
          <el-table :data="carDataList" stripe border>
            <el-table-column prop="rank" label="排名" align="center"></el-table-column>
            <el-table-column prop="name" label="玩家名称" align="center"></el-table-column>
            <el-table-column prop="level" label="玩家等级" align="center"></el-table-column>
            <el-table-column prop="data" label="汽车实力" align="center"></el-table-column>
          </el-table>
        </el-row>

        <el-row style="margin-top: 10px">
          <el-table :data="guildDataList" stripe border>
            <el-table-column prop="rank" label="排名" align="center"></el-table-column>
            <el-table-column prop="name" label="商会名称" align="center"></el-table-column>
            <el-table-column prop="level" label="商会等级" align="center"></el-table-column>
            <el-table-column prop="data" label="商会实力" align="center"></el-table-column>
          </el-table>
        </el-row>

        <el-row style="margin-top: 10px">
          <el-table :data="estateDataList" stripe border>
            <el-table-column prop="rank" label="排名" align="center"></el-table-column>
            <el-table-column prop="name" label="玩家名称" align="center"></el-table-column>
            <el-table-column prop="level" label="玩家等级" align="center"></el-table-column>
            <el-table-column prop="data" label="地产层数" align="center"></el-table-column>
          </el-table>
        </el-row>


      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'GameRank',

    data() {
      return {
        serverId : '',
        type : '',
        gameConfigList: [],
        rankConfigList : [
          {
            id : 1 ,
            name: '挣钱榜'
          },
          {
            id : 2 ,
            name: '实力榜'
          },
          {
            id : 3 ,
            name: '驾座榜'
          },
          {
            id : 4 ,
            name: '商会榜'
          },
          {
            id : 5 ,
            name: '地产榜'
          },
        ],
        moneyDataList : [],
        powerDataList : [],
        carDataList : [],
        guildDataList : [],
        estateDataList : [],

      }
    },

    created () {
      this.queryGameConfig();
    },

    methods : {
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

      // 查询数据
      async queryData(){

        if(!this.serverId){
          return this.$message.error("请选择服务器！")
        }


        if(!this.type){
          return this.$message.error("请选择排行榜类型")
        }

        let param = {
          serverId : this.serverId ,
          type : this.type,
        }

        const {data : res} = await this.$http.post("/gm/game/data/rank",param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败!')
        }

        console.log(res.data)
        let rankType = res.data.type ;

        this.moneyDataList  = []
        this.powerDataList  = []
        this.carDataList = []
        this.guildDataList = []
        this.estateDataList = []

        let dataList = res.data.mapList
        if(!dataList || dataList == 0){
          this.$message.warning("没有查询出数据！")
        }

        if(rankType === 1){
          this.moneyDataList = dataList ;
        }else if(rankType === 2){
          this.powerDataList = dataList ;
        }else if(rankType === 3){
          this.carDataList = dataList ;
        }else if(rankType === 4){
          this.guildDataList = dataList ;
        }else if(rankType === 5){
          this.estateDataList = dataList ;
        }


      }



    }
  }
</script>

<style scoped>

</style>
