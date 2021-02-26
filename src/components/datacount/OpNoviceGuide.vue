<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>运营新手引导</el-breadcrumb-item>
      </el-breadcrumb>


      <el-card>
        <el-row>
          <el-col :span="4" style="margin-right: 20px">
            <el-select v-model="selectGame" placeholder="请选择游戏服务器">
              <el-option
                v-for="item in gameConfigList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="8">
            <el-date-picker
              v-model="dayRange"
              type="date"
              placeholder="选择日期"
              value-format="yyyy-MM-dd"
              @change="daySelect">
            </el-date-picker>
          </el-col>

          <el-col :span="4" >
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>

          <el-col :span="4">
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

        <el-table :data="dataList" border stripe>

          <el-table-column prop="serverName" label="服务名称"  align="center"></el-table-column>
          <el-table-column prop="serverId" label="服务器id"  align="center"></el-table-column>
          <el-table-column prop="key" label="新手引导步骤"  align="center"></el-table-column>
          <el-table-column prop="value" label="完成人数"  align="center"></el-table-column>
<!--          <el-table-column prop="percentage" label="完成率"  align="center"></el-table-column>-->
          <el-table-column prop="time" label="最新统计时间"  align="center"></el-table-column>
        </el-table>
      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'OpNoviceGuide',

    data() {
      return {

        exportName: '玩家新手引导完成分布',
        jsonFields: {
          "服务器名称": "serverName",    //常规字段
          "服务器id": "serverId", //支持嵌套属性
          "新手引导步骤":"key",
          "人数":"value",
          // "完成率": "percentage",
          "时间":"time",
          "日期":"day",
        },


        dayRange : '',
        gameConfigList : [],
        selectGame: '-1',
        // 数据集合
        dataList : [],



      }
    },

    created () {
      this.queryGameConfig()
    },
    methods: {
      daySelect() {
        // console.log(this.dayRange)
      },

      // 查询游戏配置
      async queryGameConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/game")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏配置失败！')
        }
        this.gameConfigList = res.data
        // console.log(this.gameConfigList)

      },


      async queryData() {

        if(this.selectGame == '-1'){
          return this.$message.error('请选择具体的游戏！')
        }

        if(!this.dayRange){
          return this.$message.error('请选择日期!')
        }

        let param = {
          serverId : this.selectGame,
          day : this.dayRange ,
        }

        const {data : res} = await this.$http.post('/gm/op/novice/guide' , param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;
        if(this.dataList.length > 0 ){
          this.dataList.splice(0 , 1)
        }
      }
    }
  }
</script>

<style scoped>

</style>
