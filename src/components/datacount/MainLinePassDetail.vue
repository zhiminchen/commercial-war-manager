<template>
    <div>
      <!--  面包屑导航区域  -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>主线关卡详情</el-breadcrumb-item>
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
              :picker-options="pickerOptions"
              @change="daySelect">
            </el-date-picker>
          </el-col>

          <el-col :span="4" >
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>

        </el-row>

        <el-table :data="dataList" border stripe>

          <el-table-column prop="serverName" label="服务名称"  align="center"></el-table-column>
          <el-table-column prop="serverId" label="服务器id"  align="center"></el-table-column>
          <el-table-column prop="passId" label="关卡id"  align="center"></el-table-column>
          <el-table-column prop="successNum" label="成功通关人数"  align="center"></el-table-column>
          <el-table-column prop="failTimes" label="挑战失败次数"  align="center"></el-table-column>
          <el-table-column prop="day" label="日期"  align="center"></el-table-column>
        </el-table>
      </el-card>



    </div>
</template>

<script>
  export default {
    name: 'MainLinePassDetail',

    data() {
      return {
        dayRange : '',
        gameConfigList : [],
        selectGame: '-1',
        // 数据集合
        dataList : [],
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

        const {data : res} = await this.$http.post('/gm/products/detail/chapter' , param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;
        if(this.dataList.length == 0){
          this.$message.warning("没有查询出数据！")
        }
        // console.log(this.dataList)

      }
    }


  }
</script>

<style scoped>

</style>
