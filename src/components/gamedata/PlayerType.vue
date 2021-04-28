<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏数据</el-breadcrumb-item>
        <el-breadcrumb-item>玩家分类</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>

        <el-row>
          <el-col :span="4">
          <el-select v-model="serverId" placeholder="请选择起始服务器">
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


          <el-col :span="6">
            <el-date-picker
              v-model="dayRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            >
            </el-date-picker>

          </el-col>


          <el-col :span="4" >
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>


        </el-row>



        <el-row>
          <el-table :data="dataList" stripe border>
              <el-table-column prop="day" label="日期" align="center"></el-table-column>
              <el-table-column prop="serverId" label="服务器ID" align="center"></el-table-column>
              <el-table-column prop="serverName" label="服务器名称" align="center"></el-table-column>
              <el-table-column prop="count" label="人数" align="center"></el-table-column>
          </el-table>
        </el-row>

      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'PlayerType',
    data() {
      return {
        serverId: '-1',
        gameConfigList: [],
        playerTypeList: [],
        playerType: 1 ,

        playerTypeList : [
          {id : 1 , name : '全部'},
          {id : 2 , name : '活跃玩家'},
          {id : 3 , name : '付费玩家'},
          {id : 4 , name : '流失玩家'},
        ],
        dataList: [],

        dayRange : '',
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },

      }
    },

    created () {
      this.queryGameConfig();
    },

    methods: {

      async queryGameConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/game")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏配置失败！')
        }
        this.gameConfigList = res.data

      },


      // 查询数据
      async  queryData(){

        if(!this.dayRange){
          return this.$message.error("请选择日期范围！")
        }

        let param = {
          serverId : this.serverId,
          playerType : this.playerType,
          startDay : this.dayRange[0],
          endDay : this.dayRange[1]
        }


        const {data : res} = await this.$http.post("/gm/game/data/player/type", param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败！')
        }

        this.dataList = res.data
        if(!this.dataList || this.dataList.length == 0){
          return this.$message.info("没有获取到数据!")
        }

      }
    }
  }
</script>

<style scoped>

</style>
