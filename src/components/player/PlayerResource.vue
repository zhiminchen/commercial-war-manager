<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>玩家资源追踪</el-breadcrumb-item>
    </el-breadcrumb>


    <el-card>
      <el-row>
        <el-col :span="4" style="margin-right: 20px">
          <el-input placeholder="请输入长ID" suffix-icon="el-icon-search" v-model="queryPlayerId" autosize
                    clearable></el-input>
        </el-col>

        <el-col :span="4">
          <el-select v-model="resourceId" placeholder="请选择物资"  clearable filterable>
            <el-option
              v-for="item in resourceList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
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

      <el-row style="margin-top: 20px">
        <el-table :data="this.dataList.slice((currentPage-1)*pageSize,currentPage*pageSize)" stripe border>
          <el-table-column prop="playerName" label="玩家名称" align="center"></el-table-column>
          <el-table-column prop="time" label="时间" align="center"></el-table-column>
          <el-table-column prop="resourceName" label="物品名" align="center"></el-table-column>
          <el-table-column prop="change" label="变化" align="center"></el-table-column>
          <el-table-column prop="after" label="变更后" align="center"></el-table-column>
          <el-table-column prop="way" label="途径" align="center"></el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[500, 1000, 1500, 2000, 2500 , 3000, 3500, 4500, 5500,6000,6500,7000,7500,80000,8500,9000,9500 , 10000]"
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
    name: 'PlayerResource',
    created () {
      this.queryResource();
    },

    data () {
      return {

        exportName: '物资表更数据',
        jsonFields: {
          "玩家名称"  :"playerName" ,
          "时间" : "time",
          "物品名"  :"resourceName",
          "变化" : "change"  ,
          "变更后" :"after"  ,
          "途径" :"way" ,
        },

        queryPlayerId: '',
        dayRange: '',
        dataList: [],
        resourceList: [],
        resourceId : 0,
        querying: false,
        currentPage :  1 ,
        total: 1000,
        pageSize: 500,
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
          endDay :   this.dayRange[1],
          resourceId : this.resourceId
        }

        // console.log(param)
        if(this.querying){
          return this.$message.error("数据查询中")
        }
        this.querying = true
        const {data: res} = await this.$http.post('/gm/player/resource/trace', param);
        this.querying = false
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        if(!res.data){
          return this.$message.warning("没有查找出数据!")
        }
        this.$message.success('玩家请求成功！')

        this.dataList = res.data ;
        this.total = this.dataList.length

      },

      // 查询资源
      async queryResource () {
        const {data: res} = await this.$http.get('/gm/player/resources')
        if (res.meta.status !== 200) {
          return this.$message.error('获取资源列表错误！')
        }

        this.resourceList = res.data

        let one = {
          id : 0 ,
          name : '全部物资'
        }
        // console.log(this.resourceList)
        this.resourceList.unshift(one)
        // this.resourceMap = new Map();
        // this.resourceList.forEach(x => {
        //   this.resourceMap.set(x.id , x.name)
        // })
      },

    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      // 改变每页显示的条数
      this.PageSize=val
      // 注意：在改变每页显示的条数时，要将页码显示到第一页
      this.currentPage=1
    },
    handleCurrentChange(val) {
      this.currentPage=val
    }
    }
  }
</script>

<style scoped>

</style>
