<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏数据</el-breadcrumb-item>
        <el-breadcrumb-item>超级工厂生产</el-breadcrumb-item>
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
            <el-select v-model="playerType" placeholder="请选择玩家类型">
              <el-option v-for="item in playerTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>

          </el-col>

          <el-col :span="4" >
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>


        </el-row>


        <el-row style="margin-top: 20px">

          <el-table :data="dataList" stripe border>
            <el-table-column prop="serverId" label="区服" align="center"></el-table-column>
            <el-table-column prop="dau" label="DAU" align="center"></el-table-column>

            <el-table-column prop="alloyTimes" label="合金次数" align="center"></el-table-column>
            <el-table-column prop="alloyTotal" label="合金总量" align="center"></el-table-column>

            <el-table-column prop="parePartsTimes" label="零件次数" align="center"></el-table-column>
            <el-table-column prop="parePartsTotal" label="零件总量" align="center"></el-table-column>

            <el-table-column prop="goldTimes" label="黄金次数" align="center"></el-table-column>
            <el-table-column prop="goldTotal" label="黄金总量" align="center"></el-table-column>

            <el-table-column prop="diamondTimes" label="钻石次数" align="center"></el-table-column>
            <el-table-column prop="diamondTotal" label="钻石总量" align="center"></el-table-column>

            <el-table-column prop="carTotal" label="车次数" align="center"></el-table-column>


            <el-table-column label="汽车详情" width="190px">
              <template slot-scope="scope">
                  <el-button type="primary" icon="el-icon-view" size="mini" @click="carDetail(scope.row)"></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>

      </el-card>


      <el-dialog
        title="汽车详情对话框"
        :visible.sync="carDialogVisible"
        width="25%" @close="carDialogClosed"
        :close-on-click-modal="false"
      >
      <div>
        <el-table :data="carInfoList" stripe border>
          <el-table-column prop="key" label="汽车名称" align="center"></el-table-column>
          <el-table-column prop="value" label="汽车数量" align="center"></el-table-column>
        </el-table>

      </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="carDialogClosed">取 消</el-button>
          </span>
      </el-dialog>



    </div>
</template>

<script>
  export default {
    name: 'SuperFactory',

    data() {
      return {
        beginServerId : '',
        endServerId: '' ,
        gameConfigList: [],
        // 玩家类型
        playerTypeList : [
          {id : 1 , name : '全部'},
          {id : 2 , name : '活跃玩家'},
          {id : 3 , name : '付费玩家'},

        ],
        playerType : 1,
        dataList: [],
        dayRange: '',
        carDialogVisible: false,
        carInfoList : [],

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

    methods : {
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

      // 查询数据
      async queryData(){

        if(!this.beginServerId){
          return this.$message.error("请选择起始区服！")
        }

        if(!this.endServerId){
          return this.$message.error("请选择结束区服!")
        }

        if(!this.playerType){
          return this.$message.error("请选择玩家类型")
        }

        if(!this.dayRange){
          return this.$message.error("请选择日期范围")
        }

        let param = {
          startServerId : this.beginServerId ,
          endServerId : this.endServerId,
          playerType : this.playerType,
          startDay : this.dayRange[0],
          endDay : this.dayRange[1]
        }

        const {data : res} = await this.$http.post("/gm/game/data/super/factory",param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;
        if(!this.dataList  || this.dataList.length == 0){
          this.$message.warning("没有查询出数据！")
        }

        // console.log(this.dataList)

      },

      carDetail(row){
        // console.log(row)
        this.carInfoList = row.carInfoList
        this.carDialogVisible = true
      } ,

      carDialogClosed(){
        this.carDialogVisible = false
      }


    }

  }
</script>

<style scoped>

</style>
