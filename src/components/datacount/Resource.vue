<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>数据统计</el-breadcrumb-item>
        <el-breadcrumb-item>物资列表</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>
          <el-col :span="4">
            <el-select v-model="selectGame" placeholder="请选择游戏服务器" clearable filterable >
              <el-option
                v-for="item in gameConfigList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="selectChannel" placeholder="请选择渠道" clearable filterable >
              <el-option
                v-for="item in channelConfigList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>


          <el-col :span="4">
            <el-select v-model="selectResource" placeholder="请选择物资" clearable filterable >
              <el-option
                v-for="item in resourceConfigList"
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
              value-format="yyyy-MM-dd"
              placeholder="请选择日期"
              >
            </el-date-picker>
          </el-col>

          <el-col :span="4" >
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>

        </el-row>

        <el-table :data="dataList" border stripe>
<!--          <el-table-column v-if="selectGame !== '-1' " prop="serverId" label="服务器" width="180" align="center"></el-table-column>-->
<!--          <el-table-column v-if="selectChannel !== '-1' " prop="channelId" label="渠道"  align="center"></el-table-column>-->
          <el-table-column prop="opName" label="操作类型"  align="center"></el-table-column>
          <el-table-column prop="gainCount" label="总获取"  align="center"></el-table-column>
          <el-table-column prop="consumeCount" label="总消耗"  align="center"></el-table-column>
          <el-table-column prop="count" label="总共"  align="center"></el-table-column>
<!--          <el-table-column prop="day" label="日期"  align="center"></el-table-column>-->
        </el-table>

      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'Resource',
    data() {
      return {
        dayRange : '',
        gameConfigList : [],
        channelConfigList : [],
        resourceConfigList : [],
        selectGame: '-1',
        selectChannel: '-1',
        selectResource: 101,
        // 数据集合
        dataList : [],
      }
    },

    created () {
      this.queryGameConfig()
      this.queryChannelConfig()
      this.queryResourceConfig()
    },

    methods: {


      // 查询游戏配置
      async queryResourceConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/resource")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏物资失败！')
        }
        this.resourceConfigList = res.data

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

      // 查询数据
      async queryData() {

        if(this.selectChannel !== '-1'){
          if(this.selectGame === '-1'){
            return this.$message.error('请选择具体的游戏！')
          }
        }

        if(!this.dayRange){
          return this.$message.error('请选择日期!')
        }

        if(!this.selectResource){
          return this.$message.error("请选择资源")
        }

        if(!this.selectChannel){
          return this.$message.error("请选择渠道")
        }

        if(!this.selectGame){

          return this.$message.error("请选择游戏")
        }




        let param = {
          serverId : this.selectGame,
          channelId : this.selectChannel,
          resourceId : this.selectResource,
          day: this.dayRange,
        }

        const {data : res} = await this.$http.post('/gm/ad/resource' , param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;

        if(this.dataList.length == 0){
          this.$message.warning("没有查询出数据！")
        }

      },

    }


  }
</script>

<style scoped>

</style>
