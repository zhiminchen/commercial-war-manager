<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>玩家行为</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <el-row>
        <el-col :span="8" style="margin-right: 20px">
          <el-input placeholder="请输入长ID" suffix-icon="el-icon-search" v-model="queryPlayerId" autosize
                    clearable></el-input>
        </el-col>


        <el-col :span="8">
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

        <el-col :span="4">
          <el-button icon="el-icon-search" type="primary" @click="queryPlayerAction">查询</el-button>
        </el-col>

      </el-row>

      <el-row style="margin-top: 20px">
        <el-table :data="dataList" stripe border>
          <el-table-column prop="playerName" label="玩家名称" align="center"></el-table-column>
          <el-table-column prop="time" label="时间" align="center"></el-table-column>
          <el-table-column prop="funMouldName" label="行为类型" align="center"></el-table-column>
          <el-table-column prop="action" label="请求参数" align="center"></el-table-column>
          <el-table-column prop="result" label="行为结果" align="center"></el-table-column>
        </el-table>
      </el-row>

    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'PlayerAction',
    created () {
    },

    data () {
      return {
        queryPlayerId: '',
        dayRange: '',
        dataList: [],

        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          //   {
          //   text: '最近一个月',
          //   onClick (picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          //     picker.$emit('pick', [start, end])
          //   }
          // }, {
          //   text: '最近三个月',
          //   onClick (picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          //     picker.$emit('pick', [start, end])
          //   }
          // }
          ],


        },
      }
    },

    methods: {
      // 查询玩家行为数据
      async queryPlayerAction () {

        if(!this.queryPlayerId){
          return this.$message.error('请输入玩家id')
        }

        if(isNaN(this.queryPlayerId)){
          return this.$message.error("玩家id必须是数值类型")
        }

        if(this.queryPlayerId.length < 16|| this.queryPlayerId.length > 18){
          return this.$message.error("玩家的长度必须不低于16位并且不能大于18位")
        }

        if(!this.dayRange){
          return this.$message.error("请选择日期范围")
        }

        let timeStart = new Date(this.dayRange[0]+" 00:00:00").getTime()/1000;
        let timeEnd  = new Date(this.dayRange[1]+" 00:00:00").getTime()/1000;
        let dayDiff = (timeEnd - timeStart)/(24 * 60 * 60)
        if(dayDiff > 7){
          return this.$message.error("只能选择7天范围之内的数据！")
        }

        let param = {
          playerId : this.queryPlayerId ,
          startDay : this.dayRange[0],
          endDay :   this.dayRange[1]
        }

        const {data: res} = await this.$http.post('/gm/player/action', param);
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        if(!res.data){
          return this.$message.warning("没有查找出数据!")
        }
        this.$message.success('玩家请求成功！')

         this.dataList = res.data ;

      }
    }
  }
</script>

<style scoped>

</style>
