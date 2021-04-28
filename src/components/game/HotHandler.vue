<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>游戏接口详情</el-breadcrumb-item>
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

        <el-row>

          <el-table :data="dataList" border stripe >
            <el-table-column prop="handlerName" label="api" align="center"></el-table-column>
            <el-table-column prop="count" label="出现次数" align="center"></el-table-column>

          </el-table>

        </el-row>

      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'HotHandler',

    data() {
      return {
        queryDay : '',
        dataList : [],
      }
    },

    methods : {
      async queryData() {
        if(!this.queryDay){
          return this.$message.error("请选择日期！")
        }

        // console.log(this.queryDay)

        const {data: res} = await this.$http.get('/gm/game/hot/call', {params : {
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
          e.runBody = e.handlerName.replace("com.zhuoqu.slg.game.handler.c2s." , "")
        })

      }

    }
  }
</script>

<style scoped>

</style>
