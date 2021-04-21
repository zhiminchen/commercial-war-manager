<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>低性能api</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <el-row >
          <el-col :span="8">
            <el-date-picker
              v-model="queryDay"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
            >
            </el-date-picker>
          </el-col>

          <el-col :span="8">
            <el-button  size="medium" type="primary" style="float: left" icon="el-icon-search" @click="queryData">查询</el-button>
          </el-col>

      </el-row>

      <el-table :data="dataList" border stripe >
        <el-table-column prop="runBody" label="api" align="center"></el-table-column>
        <el-table-column prop="sumTime" label="总时间" align="center"></el-table-column>
        <el-table-column prop="avgTime" label="平均时间" align="center"></el-table-column>
        <el-table-column prop="maxTime" label="最大执行时间" align="center"></el-table-column>
        <el-table-column prop="minTime" label="最小执行时间" align="center"></el-table-column>
        <el-table-column prop="count" label="出现次数" align="center"></el-table-column>

      </el-table>

    </el-card>

  </div>
</template>

<script>
  export default {
    name: 'LowPerformance',

    created () {
    },

    data() {
      return {
        // 查询日期
        queryDay : '',
        // 数据列表
        dataList : [],
      }
    },

    methods : {
      // 查询数据
      async queryData() {

        if(!this.queryDay){
          return this.$message.error("请选择日期！")
        }

        // console.log(this.queryDay)

        const {data: res} = await this.$http.get('/gm/game/low/performance', {params : {
          day :  this.queryDay
          }})
        if (res.meta.status != 200) {
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;
        if(this.dataList.length <= 0){

          return this.$message.warning("没有查询出数据！")
        }

        this.dataList.forEach(e => {
          e.runBody = e.runBody.replace("com.zhuoqu.slg.game.handler.c2s." , "")
        })

      }

    }
  }
</script>

<style scoped>

</style>
