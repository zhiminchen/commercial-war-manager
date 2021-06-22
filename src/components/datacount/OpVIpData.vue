<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>财务管理</el-breadcrumb-item>
        <el-breadcrumb-item>vip数据</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>
          <el-col :span="4">
            <el-select v-model="beginServerId" placeholder="请选择起始服务器">
              <el-option v-for="item in gameConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="endServerId" placeholder="请选择结束服务器">
              <el-option v-for="item in gameConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
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

        <el-row style="margin-top: 25px">

          <el-table :data="this.dataList.slice((currentPage-1)*pageSize,currentPage*pageSize)" border stripe>

            <el-table-column prop="serverId" label="区服ID"  align="center"></el-table-column>
            <el-table-column prop="playerId" label="角色ID"  align="center"></el-table-column>
            <el-table-column prop="name" label="昵称"  align="center"></el-table-column>
            <el-table-column prop="vipLevel" label="vip等级"  align="center"></el-table-column>
            <el-table-column prop="vipExp" label="vip经验"  align="center"></el-table-column>
            <el-table-column prop="totalRecharge" label="总金额"  align="center"></el-table-column>

            <el-table-column prop="power" label="战斗力"  align="center"></el-table-column>
            <el-table-column prop="moneySpeed" label="赚钱速度"  align="center"></el-table-column>
            <el-table-column prop="cumulateGainDiamond" label="历史钻石数"  align="center"></el-table-column>
            <el-table-column prop="currDiamond" label="剩余钻石"  align="center"></el-table-column>

          </el-table>


          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[500, 1000, 1500, 2000, 2500 , 3000, 3500, 4500,5000,5500,6000,6500,7000,7500,8000,8500,9000,9500,10000,10500,11000,11500,12000,12500,13000,13500,14000,14500,15000]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>

        </el-row>

      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'OpVIpData',

    data() {
      return {
        beginServerId : '',
        endServerId: '' ,
        gameConfigList: [],
        dataList: [],

        currentPage :  1 ,
        total: 1000,
        pageSize: 500,

        exportName: 'vip数据',
        jsonFields: {
          "区服ID"  :"serverId" ,
          "角色ID" : "playerId",
          "昵称"  :"name",
          "vip等级" : "vipLevel"  ,
          "vip经验" :"vipExp"  ,
          "总金额" :"totalRecharge" ,
          "战斗力"  :"power"  ,
          "赚钱速度"  :"moneySpeed"  ,
          "历史钻石数"  :"cumulateGainDiamond"  ,
          "剩余钻石" :"currDiamond"
        },

      }
    },

    created () {
      this.queryGameConfig();
    },

    methods : {


      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        // 改变每页显示的条数
        this.PageSize=val
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.currentPage=1
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage=val
      },

      // 查询游戏配置
      async queryGameConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/game")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏配置失败！')
        }
        this.gameConfigList = res.data
        if(this.gameConfigList.length){
          this.gameConfigList.splice(0,1);
        }

      },

      // 查询日期
      async queryData(){

        if(!this.beginServerId){
          return this.$message.error("请选择起始区服！")
        }

        if(!this.endServerId){
          return this.$message.error("请选择结束区服!")
        }

        let param = {
          startServerId : this.beginServerId ,
          endServerId : this.endServerId,
        }

        const {data : res} = await this.$http.post("/gm/op/vip/data",param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;
        if(!this.dataList  || this.dataList.length == 0){
          this.$message.warning("没有查询出数据！")
        }

        this.total = this.dataList.length

        // console.log(this.dataList)

      }



    }
  }
</script>

<style scoped>

</style>
