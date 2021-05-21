<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>跑马灯</el-breadcrumb-item>
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
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-col>


          <el-col :span="6">
            <el-button icon="el-icon-document-add" type="primary" @click="globalDialogVisible=true">新增</el-button>
          </el-col>


        </el-row>


        <el-row style="margin-top: 20px">
          <el-table :data="dataList" stripe border>
            <el-table-column prop="serverId" label="服务器ID" align="center"></el-table-column>
            <el-table-column prop="channelName" label="渠道名称" align="center"></el-table-column>
            <el-table-column prop="runTimes" label="运行次数" align="center"></el-table-column>
            <el-table-column prop="loopTimes" label="总循环次数" align="center"></el-table-column>
            <el-table-column prop="beginTime" label="开始时间" align="center"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
            <el-table-column prop="content" label="跑马灯内容" align="center"></el-table-column>
          </el-table>

        </el-row>

      </el-card>

      <el-dialog
        title="跑马新增对话框"
        :visible.sync="globalDialogVisible"
        width="65%" @close="globalDialogClose"
        :close-on-click-modal="false"
      >

        <el-row>
          <div>

            <el-checkbox :indeterminate="isIndeterminateChannel" v-model="checkAllChannel" @change="handleCheckAllChannel">全选    渠道</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedChannel" @change="handleCheckedChannelChange">
              <el-checkbox v-for="channel in channelOptions" :label="channel" :key="channel">{{channel}}</el-checkbox>
            </el-checkbox-group>
          </div>

        </el-row>

        <el-row style="margin-top: 30px">

          <div>

            <el-checkbox :indeterminate="isIndeterminateServer" v-model="checkAllServer" @change="handleCheckAllServer">全选    服务器</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedServer" @change="handleCheckedServerChange">
              <el-checkbox v-for="server in serverOptions" :label="server" :key="server">{{server}}</el-checkbox>
            </el-checkbox-group>
          </div>

        </el-row>


        <el-row style="margin-top: 20px">
          <div>
            <h4>跑马灯内容：</h4>
            <el-input v-model="marqueeContent" placeholder="请输入跑马灯内容">></el-input>
          </div>
        </el-row>

        <el-row style="margin-top: 20px">
          <div>
            <h4>跑马灯循环次数 :</h4>
            <el-input-number v-model="loopNum"  :min="1" :max="1000" label="跑马灯循环次数" ></el-input-number>
          </div>
        </el-row>

        <el-row style="margin-top: 20px">
          <div>
            <h4>跑马灯时间范围选择器：</h4>
            <el-date-picker
              v-model="timeRange"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
            </el-date-picker>
          </div>

        </el-row>

        <span slot="footer" class="dialog-footer">
            <el-button @click="globalDialogVisible=false">取 消</el-button>
            <el-button type="primary" size="medium" @click="putMarquee">确 定</el-button>
          </span>
      </el-dialog>


    </div>
</template>

<script>
  export default {
    name: 'Marquee',
    data() {
      return {
        selectGame: '-1',
        gameConfigList: [],
        dataList : [],
        globalDialogVisible: false,

        checkedChannel: [],
        channelOptions: [],
        isIndeterminateChannel: true,
        checkAllChannel: false,


        checkedServer: [],
        serverOptions: [],
        isIndeterminateServer: true,
        checkAllServer: false,

        loopNum : 1,
        timeRange: [],
        marqueeContent : '',


      }
    },

    created () {
      this.queryGameConfig()
      this.queryChannelConfig()
    },

    methods : {

      // 添加跑马灯
      async putMarquee(){

        if(!this.checkedChannel){
          return this.$message.error("至少要选择一个渠道!")
        }

        if(!this.checkedServer){
          return this.$message.error("至少选择一个服务器！")
        }

        if(!this.marqueeContent){
          return this.$message.error("跑马灯内容不能为空!")
        }

        if(!this.timeRange){
          return this.$message.error("没有选择时间")
        }


        const confirmResult = await this.$confirm.confirm("确定要把跑马灯同步到游戏服务器吗", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除')
        }

        let param  = {
          servers : this.checkedServer.join(","),
          channelIds: this.checkedChannel.join(","),
          loopNum : this.loopNum,
          beginTime : this.timeRange[0],
          closeTime: this.timeRange[1],
          msg: this.marqueeContent
        }

        const {data : res} = await this.$http.post("/gm/player/marquee/put", param)
        if(res.meta.status !== 200){
          return this.$message.error('设置公告失败')
        }
        this.globalDialogVisible = false
        if(this.selectGame){
          this.queryData();
        }


      } ,

      // 全选
      handleCheckAllChannel (val) {
        this.checkedChannel = val ? this.channelOptions : []
        this.isIndeterminateChannel = false
      },

      handleCheckedChannelChange (value) {
        this.checkedChannel = value
        let checkedCount = this.checkedChannel.length
        this.checkAllChannel = checkedCount === this.channelOptions.length
        this.isIndeterminateChannel = checkedCount > 0 && checkedCount < this.channelOptions.length
      },


      // 全选
      handleCheckAllServer (val) {
        this.checkedServer = val ? this.serverOptions : []
        this.isIndeterminateServer = false
      },

      handleCheckedServerChange (value) {
        this.checkedServer = value
        let checkedCount = this.checkedServer.length
        this.checkAllServer = checkedCount === this.serverOptions.length
        this.isIndeterminateServer = checkedCount > 0 && checkedCount < this.serverOptions.length
      },


      // 查询游戏配置
      async queryGameConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/game")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏配置失败！')
        }
        this.gameConfigList = res.data

        this.serverOptions = []
        length = res.data.length
        for(let i = 1; i< length; i++){
          this.serverOptions.push(res.data[i].name)
        }
        // console.log(this.serverOptions)

      },

      // 查询数据
      async queryData(){

        let param = {
          serverId : this.selectGame,
          day : '',
        }
        const {data : res} = await this.$http.post("/gm/player/marquee/list", param)
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏跑马灯列表失败！')
        }

        if(!res.data || res.data.length <= 0){
          this.dataList = []
          return this.$message.warning("没有查询出数据！")
        }

        this.dataList = res.data

      },

      globalDialogClose() {
          this.loopNum = 1
          this.timeRange = []
          this.marqueeContent = ''
          this.globalDialogVisible = false
      },

      // 查询渠道配置信息
      async queryChannelConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/channel")
        if(res.meta.status !== 200){
          return this.$message.error('获取渠道配置信息失败！')
        }
        this.channelConfigList = res.data
        let length = res.data.length

        this.channelOptions = []
        for(let i = 1; i< length; i++){
          this.channelOptions.push(res.data[i].name)
        }

      },

    }
  }
</script>

<style scoped>

</style>
