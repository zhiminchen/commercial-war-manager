<template>

  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>玩家封号禁言管理</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-row>
        <el-col :span="6">
          <el-select v-model="selectGame" placeholder="请选择游戏服务器">
            <el-option
              v-for="item in gameConfigList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>


        <el-col :span="6">
          <el-select v-model="selectAction" placeholder="请选择查询方式">
            <el-option
              v-for="item in actionTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-button icon="el-icon-search" type="primary" @click="queryAction">查询</el-button>
        </el-col>

      </el-row>


      <el-row style="margin-top: 20px">
        <el-table :data="dataList" stripe border>
          <el-table-column prop="serverId" label="服务器ID" align="center"></el-table-column>
          <el-table-column prop="playerId" label="玩家ID" align="center"></el-table-column>
          <el-table-column prop="name" label="玩家名称" align="center"></el-table-column>
          <el-table-column prop="beginTime" label="开始时间" align="center"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>

          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button size="mini" type="danger" icon="el-icon-edit" @click="edit(scope.row)">
                编辑
              </el-button>
            </template>
          </el-table-column>

        </el-table>

      </el-row>
    </el-card>



    <!-- 对话框     -->
    <el-dialog
      title="编辑对话框"
      :visible.sync="banTalkDialogVisible"
      width="50%" @close="banTaskDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form ref="banTalkFormRef" :model="banTalkForm" label-width="150px">

        <div class="block">
          <el-date-picker
            v-model="banTalkForm.dateTimeSelect"
            type="datetimerange"
            value-format="yyyy-MM-dd HH:mm:SS"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right">
          </el-date-picker>
        </div>

      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="banTalkDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="banTalkPlayer">确 定</el-button>
          </span>

    </el-dialog>



  </div>



</template>

<script>
  export default {
    name: 'PlayerSealTalk',
    data() {
      return {
        gameConfigList : [],
        selectGame: '-1',
        selectAction: '',
        actionTypeList : [
          {id : 1 , name: '封号'},
          {id : 2 , name: '禁言'},
        ],
        dataList : [],
        banTalkDialogVisible : false,

        banTalkForm: {
          dateTimeSelect: '',
          type : '',
          playerId : '',
          serverId : '',
          playerName: '',
        },


        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
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

      },

      // 查询行为数据
      async  queryAction(){

        if(!this.selectAction){
          return this.$message.error("请选择查询类型")
        }

        let param = {
          serverId : this.selectGame ,
          type : this.selectAction
        }

        const {data : res} = await this.$http.post("/gm/player/seal/talk", param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败！')
        }
        this.dataList = res.data


      },

      // 编辑
      async edit(data){
        this.banTalkDialogVisible = true
        this.banTalkForm.type = data.type
        this.banTalkForm.playerId  = data.playerId
        this.banTalkForm.serverId = data.serverId
        this.banTalkForm.playerName = data.name
      },

      // 禁言对话框关闭
      banTaskDialogClosed () {
        this.$refs.banTalkFormRef.resetFields()
        this.banTalkForm.dateTimeSelect = ''
        this.banTalkForm.type = ''
        this.banTalkForm.playerId  = ''
        this.banTalkForm.serverId = ''
        this.banTalkForm.playerName = ''

      },

      // 禁言或封号玩家
      async banTalkPlayer() {

        let type = this.banTalkForm.type ;
        if (!this.banTalkForm.dateTimeSelect) {
          return this.$message.error('还没有选择时间！')
        }

        let param = {
          playerId: this.banTalkForm.playerId,
          serverId: this.banTalkForm.serverId,
          name: this.banTalkForm.playerName,
          beginTime: this.banTalkForm.dateTimeSelect[0],
          closeTime: this.banTalkForm.dateTimeSelect[1]
        }

        // 封号
        if(type === 1){
          const {data: res} = await this.$http.post('/gm/player/seal', param)
          if (res.meta.status !== 200) {
            return this.$message.error('封号请求失败！')
          }

          this.$message.success('封号成功！')

        }else{
          // 禁言
          const {data: res} = await this.$http.post('/gm/player/ban/talk', param)
          if (res.meta.status !== 200) {
            return this.$message.error('禁言请求失败！')
          }

          this.$message.success('禁言成功！')
        }

        this.banTalkDialogVisible = false
        this.banTaskDialogClosed()

      }

    }
  }
</script>

<style scoped>

</style>
