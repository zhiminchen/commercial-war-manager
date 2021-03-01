<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>日活跃列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="4">
          <el-select v-model="selectGame" placeholder="请选择游戏服务器">
            <el-option
              v-for="item in gameConfigList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="4">
          <el-select v-model="selectChannel" placeholder="请选择渠道">
            <el-option
              v-for="item in channelConfigList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
              @change="daySelect">
            </el-date-picker>
        </el-col>

        <el-col :span="4" >
          <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
        </el-col>

      </el-row>

      <el-table :data="dataList" border stripe>
        <el-table-column v-if="selectGame !== '-1' " prop="serverId" label="服务器" width="180" align="center"></el-table-column>
        <el-table-column v-if="selectChannel !== '-1' " prop="channelId" label="渠道"  align="center"></el-table-column>
        <el-table-column prop="count" label="日活跃用户数"  align="center"></el-table-column>
        <el-table-column prop="day" label="日期"  align="center"></el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'DAU',
    data() {
      return {
        dayRange : '',
        gameConfigList : [],
        channelConfigList : [],
        selectGame: '-1',
        selectChannel: '-1',
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
      this.queryChannelConfig()
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
      // 查询渠道配置
      async queryChannelConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/channel")
        if(res.meta.status !== 200){
          return this.$message.error('获取渠道配置失败！')
        }
        this.channelConfigList = res.data
        // console.log(this.channelConfigList)
      },

      async queryData() {

        if(this.selectChannel !== '-1'){
          if(this.selectGame === '-1'){
            return this.$message.error('请选择具体的游戏！')
          }
        }

        if(!this.dayRange){
          return this.$message.error('请选择日期!')
        }

        let param = {
          serverId : this.selectGame,
          channelId : this.selectChannel,
          fromDay : this.dayRange[0] ,
          endDay : this.dayRange[1]
        }

        const {data : res} = await this.$http.post('/gm/ad/dau' , param)
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
