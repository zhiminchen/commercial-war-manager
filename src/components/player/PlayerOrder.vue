<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>玩家订单</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
        <el-row>
          <el-col :span="5" style="margin-right: 50px">
            <el-input v-model="playerId" placeholder="请输玩家ID" clearable></el-input>
          </el-col>

          <el-col :span="5" style="margin-right: 50px">
            <el-input v-model="orderId" placeholder="请输订单号" clearable></el-input>
          </el-col>

          <el-col :span="5" style="margin-right: 50px">
            <el-date-picker
              v-model="dayRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </el-col>

          <el-col :span="5">
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-col>

        </el-row>

      <el-row style="margin-top: 25px">
        <el-table :data="this.dataList" stripe border>
          <el-table-column prop="playerId" label="玩家ID" align="center"></el-table-column>
          <el-table-column prop="orderId" label="充值订单号" align="center"></el-table-column>
          <el-table-column prop="channelName" label="充值渠道" align="center"></el-table-column>
          <el-table-column prop="price" label="充值金额" align="center"></el-table-column>
          <el-table-column prop="rechargeName" label="充值内容" align="center"></el-table-column>
          <el-table-column prop="time" label="充值时间" align="center"></el-table-column>
          <el-table-column prop="stateName" label="订单状态" align="center"></el-table-column>
          <el-table-column prop="platformName" label="平台" align="center"></el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" icon="el-icon-edit" @click="replenishmentOrder(scope.row)">
                补单
              </el-button>
            </template>
          </el-table-column>


        </el-table>
      </el-row>

    </el-card>

  </div>
</template>

<script>
  export default {
    name: 'PlayerOrder',
    data() {
      return {
        playerId : '',
        orderId : '',
        dayRange : '',
        dataList: [],
      }
    },

    methods: {

      async replenishmentOrder(record) {

        if(record.state >= 4){
          return this.$message.error("该订单为发货到账的订单， 所以不能补单！")
        }

        const {data: res} = await this.$http.post('/gm/player/replenishment/order', record);
        // if (res.meta.status !== 200) {
        //   return this.$message.error(res.meta.msg)
        // }
        return this.$message.info(res.meta.msg)
        this.queryData();


      },


      // 查询玩家行为数据
      async queryData () {



        if(!this.playerId && !this.orderId){
          return this.$message.error('玩家ID和订单号必须提供一项')
        }


        if(!this.dayRange){
          return this.$message.error("请选择日期范围！")
        }

        if(this.playerId){
          if(isNaN(this.playerId)){
            return this.$message.error("玩家id必须是数值类型")
          }

          if(this.playerId.length < 16|| this.playerId.length> 18){
            return this.$message.error("玩家的长度必须不低于16位并且不能大于18位")
          }

        }


        let queryPlayerId = this.playerId
        if(!queryPlayerId){
          queryPlayerId = 0
        }

        let param = {
          playerId : queryPlayerId,
          orderId : this.orderId,
          startDay: this.dayRange[0],
          endDay : this.dayRange[1],
        }

        // // 标记数据查询中
        // this.querying = true
        const {data: res} = await this.$http.post('/gm/player/query/order', param);
        // this.querying = false
        //
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        if(!res.data){
          return this.$message.warning("没有查找出数据!")
        }
        this.$message.success('玩家请求成功！')

        this.dataList = res.data ;
        // this.total = this.dataList.length

      },


    }
  }
</script>

<style scoped>

</style>
