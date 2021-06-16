<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>日常运营数据</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>
          <el-col :span="5" style="margin-right: 20px">
            <el-select v-model="selectGame" placeholder="请选择游戏服务器">
              <el-option
                v-for="item in gameConfigList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="5" style="margin-right: 20px">
            <el-select v-model="selectChannel" placeholder="请选择游戏服务器">
              <el-option
                v-for="item in channelConfigList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>


          <el-col :span="5" style="margin-right: 40px">
            <el-date-picker
              v-model="dayRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>


        </el-row>

        <el-row style="margin-top: 25px">

          <el-col :span="5" >
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>


          <el-col :span="5">
            <download-excel
              :fields="jsonFields"
              :data="dataList"
              type="xls"
              :name="exportName"
              worksheet="导出信息"
            >
              <el-button icon="el-icon-download" type="primary" plain >导出数据</el-button>
            </download-excel>
          </el-col>

        </el-row>


        <el-row style="margin-top: 25px">
          <el-table :data="dataList" border stripe>
            <el-table-column prop="day" label="日期"  align="center"></el-table-column>
            <el-table-column prop="newAdd" label="注册数"  align="center"></el-table-column>
            <el-table-column prop="effectiveNewAdd" label="有效注册用户数"  align="center"></el-table-column>
            <el-table-column prop="dau" label="活跃用户数"  align="center"></el-table-column>

            <el-table-column prop="payNum" label="充值人数"  align="center"></el-table-column>
            <el-table-column prop="payTotal" label="充值金额"  align="center"></el-table-column>
            <el-table-column prop="arPPU" label="arppu"  align="center"></el-table-column>
            <el-table-column prop="dauPPU" label="活跃arpu值"  align="center"></el-table-column>
            <el-table-column prop="payRate" label="付费率(%)"  align="center"></el-table-column>
            <el-table-column prop="newAddPayNum" label="首次注册充值人数"  align="center"></el-table-column>
            <el-table-column prop="newAddPayTotal" label="首次注册充值金额"  align="center"></el-table-column>
            <el-table-column prop="newAddArPPU" label="首次注册充值arppu"  align="center"></el-table-column>
            <el-table-column prop="firstPayNum" label="首次充值人数"  align="center"></el-table-column>
            <el-table-column prop="firstPayTotal" label="首次充值金额"  align="center"></el-table-column>
            <el-table-column prop="firstArPPU" label="首次充值arppu"  align="center"></el-table-column>

            <el-table-column prop="firstPayRate" label="首次充值付费率(%)"  align="center"></el-table-column>
            <el-table-column prop="avgPlayTime" label="平均在线时长(秒)"  align="center"></el-table-column>

          </el-table>
        </el-row>



      </el-card>





    </div>
</template>

<script>
  export default {
    name: 'DailyOperation',
    data() {
      return {

        exportName: '日常运营数据',
        jsonFields: {
          "日期"  :"day" ,
          "注册数"  :"newAdd",
          "有效注册用户数" : "effectiveNewAdd"  ,
          "活跃用户数" :"dau"  ,
          "充值人数" :"payNum" ,
          "充值金额" :"payTotal"  ,
          "arppu"  :"arPPU"  ,
          "活跃arpu值"  :"dauPPU"  ,
          "付费率(%)"  :"payRate"  ,
          "首次注册充值人数" :"newAddPayNum"  ,
          "首次注册充值金额" :"newAddPayTotal"  ,
          "首次注册充值arppu"  :"newAddArPPU"  ,
          "首次充值人数" :"firstPayNum"  ,
          "首次充值金额" :"firstPayTotal"  ,
          "首次充值arppu"  :"firstArPPU"  ,
          "首次充值付费率(%)" : "firstPayRate"  ,
          "平均在线时长(秒)"  :"avgPlayTime"
        },

        dayRange : '',
        selectGame: '-1',
        gameConfigList: [],
        selectChannel : '-1',
        channelConfigList : [],
        dataList : [],
      }
    },

    created () {
      this.queryGameConfig()
      this.queryChannelConfig()
    },

    methods : {
      // 查询游戏配置
      async queryGameConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/game")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏配置失败！')
        }
        this.gameConfigList = res.data
        // console.log(this.gameConfigList)

      },

      async queryChannelConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/channel")
        if(res.meta.status !== 200){
          return this.$message.error('获取渠道置失败！')
        }
        this.channelConfigList = res.data
      },
      // 查询数据
      async queryData(){

        if(!this.dayRange){
          return this.$message.error("请选择日期！")
        }

        let param = {
          startServerId : this.selectGame ,
          endServerId: this.selectGame,
          channelId : this.selectChannel,
          startDay : this.dayRange[0],
          endDay: this.dayRange[1],
        }
        const {data : res} = await this.$http.post("/gm/op/query/data", param)
        if(res.meta.status !== 200){
          return this.$message.error('获取获取数据失败！')
        }
        this.dataList = res.data

        if(!this.dataList || this.dataList.length == 0){
          this.$message.warning("没有查询出数据！")
        }

        console.log(this.dataList)

      },
    }
  }
</script>

<style scoped>

</style>
