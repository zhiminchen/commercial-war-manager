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

      <el-row style="margin-top: 25px">
<!--        <div class="r-echarts-line">-->
<!--        <div id="myChart" ref="myChart" style="width: 100%;height:400px;"  ></div>-->
        <div id="myChart" ref="myChart" v-bind:style="styleObject"  ></div>
<!--        <div id="myChart" ref="myChart" v-bind:style="'width: 100%;height:400px;"  ></div>-->
      </el-row>




      <el-table :data="dataList" border stripe>
        <el-table-column v-if="selectGame !== '-1' " prop="serverId" label="服务器" width="180" align="center"></el-table-column>
        <el-table-column v-if="selectChannel !== '-1' " prop="channelId" label="渠道"  align="center"></el-table-column>
        <el-table-column prop="day" label="日期"  align="center"></el-table-column>
        <el-table-column prop="add" label="新增"  align="center"></el-table-column>
        <el-table-column prop="effectiveUser" label="有效用户"  align="center"></el-table-column>
        <el-table-column prop="dau" label="活跃"  align="center"></el-table-column>
        <el-table-column prop="averagePlayTime" label="平均时长（分）"  align="center"></el-table-column>

      </el-table>
    </el-card>
  </div>
</template>

<script>
  import macarons from 'echarts/theme/macarons'
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
        // dau 相关数据
        dauDayList : [] ,
        dauValueList : [],
        addValueList :[],
        effectPlayerList : [],
        avgTimeList : [] ,


        styleObject: {
          width: '100%',
          height: '400px'
        },

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
        this.dauDayList = []
        this.dauValueList = []
        this.addValueList = []
        this.effectPlayerList = []
        this.avgTimeList = []

        if(this.dataList.length > 0){
          let length = this.dataList.length
          for(let i = 0 ;i < length ;i++){
            let one = this.dataList[i]
            this.dauDayList.push(one.day)
            this.dauValueList.push(one.dau)
            this.addValueList.push(one.add)
            this.effectPlayerList.push(one.effectiveUser)
            this.avgTimeList.push(one.averagePlayTime)

          }
          this.drawLineChart()

        }else{
        }


        if(this.dataList.length == 0){
          this.$message.warning("没有查询出数据！")
        }

      },


      // https://segmentfault.com/a/1190000022096665

      // 绘制线条图
      drawLineChart() {
        let chartLine = this.$echarts.init(document.getElementById('myChart'));// 基于准备好的dom，初始化echarts实例
        // let chartLine = this.$echarts.init(this.refs.myChart);// 基于准备好的dom，初始化echarts实例

        let option = {
          tooltip : {
            trigger: 'axis'
          },
          legend: {
            data:['DAU', 'ADD' , '有效用户', '平均时长']
          },
          calculable : true,
          xAxis : [
            {
              type : 'category',
              boundaryGap : false,
              axisTick: {
                show: false
              },
              data : this.dauDayList
            }
          ],
          yAxis : [
            {
              type : 'value',
              axisTick: {
                show: false
              },
              name: '(人数)'
            }
          ],
          series : [
            {
              name:'DAU',
              type:'line',
              smooth: false,
              stack: '总量',
              data: this.dauValueList
            },
            {
              name:'ADD',
              type:'line',
              smooth: false,
              stack: '总量',
              data: this.addValueList
            },
            {
              name:'有效用户',
              type:'line',
              smooth: false,
              stack: '总量',
              data: this.effectPlayerList
            },
            {
              name:'平均时长',
              type:'line',
              smooth: false,
              stack: '总量',
              data: this.avgTimeList
            },

          ]
        };
        // 使用刚指定的配置项和数据显示图表
        chartLine.setOption(option);
      } ,


    }
  }
</script>

<style scoped>

</style>
