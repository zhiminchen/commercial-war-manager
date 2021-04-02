<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>玩家管理</el-breadcrumb-item>
      <el-breadcrumb-item>玩家查询</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="8" style="margin-right: 20px">
          <el-input placeholder="请输入长ID或玩家名称" suffix-icon="el-icon-search" v-model="queryFiled" autosize
                    clearable></el-input>
        </el-col>

        <el-col :span="4">
          <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
        </el-col>

      </el-row>


      <el-table :data="dataList" border stripe show-header highlight-current-row ref="multipleTable"
                tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange">>
        <el-table-column v-if="dataList.length > 0"
                         type="selection"
                         width="55">
        </el-table-column>


        <el-table-column v-for="item in tableTitle" :key="item" :prop="item" :label="item">
        </el-table-column>
      </el-table>

      <el-row style="margin-top: 45px">
        <el-col :span="4">
          <el-button size="medium" type="danger" @click="sealDialogVisible=true">封号</el-button>
        </el-col>

        <el-col :span="4">
          <el-button size="medium" type="warning" @click="banTalkDialogVisible=true">禁言</el-button>
        </el-col>

        <el-col :span="4">
          <el-button size="medium" type="info" @click="kickPlayer">踢人</el-button>
        </el-col>


        <el-col :span="4">
          <el-button size="medium" type="primary" @click="queryPlayerInfo">详情</el-button>
        </el-col>

        <el-col :span="4">
          <el-button size="medium" type="success" @click="awardDialogVisible=true">奖励</el-button>
        </el-col>


      </el-row>

    </el-card>


    <!-- 封号对话框     -->
    <el-dialog
      title="封号对话框"
      :visible.sync="sealDialogVisible"
      width="50%" @close="sealDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form ref="sealFormRef" :model="sealForm" label-width="150px">

        <div class="block">
          <el-date-picker
            v-model="sealForm.dateTimeSelect"
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
            <el-button @click="sealDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="sealPlayer">确 定</el-button>
          </span>
    </el-dialog>

    <!-- 禁言对话框     -->
    <el-dialog
      title="禁言对话框"
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




    <!-- 奖励对话话框     -->
    <el-dialog
      title="奖励对话话框"
      :visible.sync="awardDialogVisible"
      width="65%" @close="awardDialogClosed"
      :close-on-click-modal="false"
    >
      <el-form ref="awardFormRef" :model="awardForm" label-width="150px">
        <div class="block">
          <el-row>
            <el-col :span="5" style="margin-right: 10px">
              <el-select v-model="selectResource" placeholder="请选择资源" clearable filterable >
                <el-option
                  v-for="item in resourceList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>

            <el-col :span="5" style="margin-right: 10px">
              <el-input-number v-model="awardNum"  :min="0" :max="10000000000" label="描述文字"></el-input-number>
            </el-col>
            <el-col :span="5">
              <el-button type="primary" size="medium" icon="el-icon-plus" @click="addAward">确认添加</el-button>
            </el-col>

          </el-row>

          <el-row style="margin-top: 20px">
            <el-input
              type="text"
              placeholder="请输入邮件标题"
              v-model="awardForm.mailTitle"
              maxlength="35"
              show-word-limit
              suffix-icon="el-icon-edit"
            >
            </el-input>
          </el-row>
          <el-row style="margin-top: 20px">
            <el-input
              type="textarea"
              placeholder="请输入邮件正文"
              v-model="awardForm.mailContent"
              maxlength="400"
              show-word-limit
              suffix-icon="el-icon-edit"
            >
            </el-input>
          </el-row>

          <el-row>
            <el-table :data="awardList" style="width: 100%" stripe border>
                <el-table-column prop="id" label="资源id" align="center"></el-table-column>
                <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
                <el-table-column prop="num" label="资源数量" align="center"></el-table-column>
                <el-table-column  label="操作" align="center">
                  <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row)">编辑</el-button>
                  </template>
                </el-table-column>

            </el-table>
          </el-row>

        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="awardDialogClosed">取 消</el-button>
            <el-button type="primary" size="medium" @click="sendPlayerAward">确 定</el-button>
          </span>
    </el-dialog>



    <!-- 玩家详情对话框     -->
    <el-dialog
      title="玩家详情对话框"
      :visible.sync="playerInfoDialogVisible"
      width="65%" @close="playerInfoDialogVisible=false"
      :close-on-click-modal="false"
    >
      <el-form ref="playerInfoFormRef"  label-width="150px">
        <div class="block">
          <el-row>
            <el-table :data="playerInfoList" style="width: 100%" stripe border>
              <el-table-column prop="key" label="字段名" align="center"></el-table-column>
              <el-table-column prop="value" label="字段值" align="center"></el-table-column>
            </el-table>
          </el-row>

        </div>
      </el-form>

      <span slot="footer" class="dialog-footer">
            <el-button @click="playerInfoDialogVisible=false">取 消</el-button>
            <el-button type="primary" size="medium" @click="playerInfoDialogVisible=false">确 定</el-button>
          </span>
    </el-dialog>





  </div>
</template>

<script>
  export default {
    name: 'PlayerQuery',
    data () {
      return {
        queryFiled: '',
        dataList: [],
        tableTitle: [],
        multipleSelection: '',
        sealDialogVisible: false,
        banTalkDialogVisible: false,
        awardDialogVisible: false,
        playerInfoDialogVisible: false,
        sealForm: {
          dateTimeSelect: ''
        },

        banTalkForm: {
          dateTimeSelect: ''
        },
        // 奖励form
        awardForm : {
          mailTitle : '',
          mailContent: '',
        },

        selectResource : '',
        // 资源列表
        resourceList: [],
        resourceMap : {},
        // 奖励列表
        awardList : [],
        awardNum : 0 ,
        // 玩家信息列表
        playerInfoList : [],

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
      this.queryResource()
    },

    methods: {

      // 查询玩家信息
      async queryPlayerInfo() {

        if (!this.multipleSelection) {
          return this.$message.error('还没有选择玩家信息！')
        }

        let param = {
          playerId: this.multipleSelection.player_id,
          serverId: this.multipleSelection.server_id,
        }
        // console.log(param)
        this.$story.queryPlayerId = this.multipleSelection.player_id
        this.$router.push('/player/data')

        // const {data: res} = await this.$http.post('/gm/player/info', param);
        // if (res.meta.status !== 200) {
        //   return this.$message.error('玩家请求失败！')
        // }
        // this.playerInfoList = res.data
        // // console.log(this.playerInfoList)
        // this.$message.success('玩家请求成功！')

        this.playerInfoDialogVisible=true

      },

      // 查询资源
      async queryResource () {
        const {data: res} = await this.$http.get('/gm/player/resources')
        if (res.meta.status !== 200) {
          return this.$message.error('获取资源列表错误！')
        }

        this.resourceList = res.data
        this.resourceMap = new Map();
        this.resourceList.forEach(x => {
          this.resourceMap.set(x.id , x.name)
        })
      },

      handleSelectionChange (val) {
        if (val.length > 1) {
          this.$refs.multipleTable.clearSelection()
          this.$refs.multipleTable.toggleRowSelection(val[val.length - 1])
        }
        this.multipleSelection = val[val.length - 1]
        // console.log(this.multipleSelection)
      },

      // 查询数据
      async queryData () {

        if (!this.queryFiled) {
          return this.$message.error('请输入查询数据!')
        }

        const {data: res} = await this.$http.get('/gm/player/find', {
          params: {
            'key': this.queryFiled
          }
        })

        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }

        this.dataList = res.data.tableRowList
        this.tableTitle = res.data.tableTitle
        // console.log(this.tableTitle)

      },

      // 封号对话框关闭
      sealDialogClosed () {
        this.$refs.sealFormRef.resetFields()
        this.sealForm.dateTimeSelect = ''
      },

      // 禁言对话框关闭
      banTaskDialogClosed () {
        this.$refs.banTalkFormRef.resetFields()
        this.banTalkForm.dateTimeSelect = ''
      },

      // 奖励对话框关闭
      awardDialogClosed () {
        this.$refs.awardFormRef.resetFields()
        this.awardForm.mailTitle = '';
        this.awardForm.mailContent = '';

        this.selectResource = '';
        this.awardList = [];
        this.awardNum = 0 ;

        this.awardDialogVisible = false;

      },

      // 封号
      async sealPlayer () {
        // console.log(this.sealForm.dateTimeSelect)
        if (!this.multipleSelection) {
          return this.$message.error('还没有选择玩家信息！')
        }

        if (!this.sealForm.dateTimeSelect) {
          return this.$message.error('还没有选择封号的时间！')
        }

        let param = {
          playerId: this.multipleSelection.player_id,
          serverId: this.multipleSelection.server_id,
          name: this.multipleSelection.name,
          beginTime: this.sealForm.dateTimeSelect[0],
          closeTime: this.sealForm.dateTimeSelect[1]
        }
        // console.log(this.multipleSelection)
        // console.log(param)

        const {data: res} = await this.$http.post('/gm/player/seal', param)
        if (res.meta.status !== 200) {
          return this.$message.error('封号请求失败！')
        }

        this.$message.success('封号成功！')
        this.sealDialogVisible = false
        this.sealDialogClosed()

      },

      // 禁言
      async banTalkPlayer () {
        if (!this.multipleSelection) {
          return this.$message.error('还没有选择玩家信息！')
        }

        if (!this.banTalkForm.dateTimeSelect) {
          return this.$message.error('还没有选择禁言的时间！')
        }

        let param = {
          playerId: this.multipleSelection.player_id,
          serverId: this.multipleSelection.server_id,
          name: this.multipleSelection.name,
          beginTime: this.banTalkForm.dateTimeSelect[0],
          closeTime: this.banTalkForm.dateTimeSelect[1]
        }

        const {data: res} = await this.$http.post('/gm/player/ban/talk', param)
        if (res.meta.status !== 200) {
          return this.$message.error('禁言请求失败！')
        }

        this.$message.success('禁言成功！')
        this.banTalkDialogVisible = false
        this.banTaskDialogClosed()
      },

      // 发送玩家奖励
      async sendPlayerAward(){

        if(!this.awardForm.mailTitle){
          return this.$message.error("请输入邮件标题！")
        }

        if(!this.awardForm.mailContent){
          return this.$message.error("请输入邮件标题！")
        }

        if(!this.awardList || this.awardList.length == 0){
          return this.$message.error("请添加道具！")
        }
        let strList = []
        this.awardList.forEach(x => {
          let item = x.name + " : " + x.num ;
          strList.push(item);
        })
        // var s = '你好 {0} {1}'.formar('value1', 123)
        let content = "<strong> 邮件标题为 : _1 </strong> </br> <strong> 邮件内容为 : _2 </strong> </br> <strong> 邮件奖励为 : _3 </strong> </br>"
        content = content.replace("_1" , this.awardForm.mailTitle);
        content = content.replace("_2" , this.awardForm.mailContent);
        content = content.replace("_3" , strList.join("\t"));

        const confirmResult = await this.$confirm.confirm(content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除')
        }

        strList = []
        this.awardList.forEach(x => {
          let item = x.id + "_" + x.num ;
          strList.push(item);
        })

        let param = {
          playerId: this.multipleSelection.player_id,
          serverId: this.multipleSelection.server_id,
          mailTitle : this.awardForm.mailTitle,
          mailContent: this.awardForm.mailContent,
          itemList: strList.join("|")
        }

        // console.log(param)

        const {data: res} = await this.$http.post('/gm/player/mail', param)

        if (res.meta.status !== 200) {
          return this.$message.error('发送用户邮件失败!')
        }

        this.$message.success('发送用户邮件成功!')
        this.awardDialogVisible = false
        this.awardDialogClosed()

      },

      // 添加奖励
      addAward() {

        if(!this.selectResource){
          return this.$message.error("请选择资源！")
        }

        if(!this.awardNum || this.awardNum <= 0){
          return this.$message.error("请输入正确的数额!")
        }

        let one = {
          id : this.selectResource ,
          name : this.resourceMap.get(this.selectResource),
          num : this.awardNum
        }

        this.awardList.push(one);
      },

      // 踢掉玩家
      async kickPlayer() {
        if (!this.multipleSelection) {
          return this.$message.error('还没有选择玩家信息！')
        }

        if(this.multipleSelection.online === 0  || this.multipleSelection.online === '0'){
          return this.$message.error('玩家下线状态不能踢人！')
        }


        let param = {
          playerId: this.multipleSelection.player_id,
          serverId: this.multipleSelection.server_id,
          name: this.multipleSelection.name,
          beginTime: '',
          closeTime: '' ,
        }

        const {data: res} = await this.$http.post('/gm/player/kick', param)
        if (res.meta.status !== 200) {
          return this.$message.error('踢人请求失败！')
        }

        this.$message.success('踢人成功！')

      },

      // 删除斗剧
      delItem(item){
        if(this.awardList.length <= 0){
          return this.$message.error("没有道具无法删除")
        }

        let index = -1 ;
        for(let i = 0 ;i<this.awardList.length; i++){
          index ++ ;
          let x = this.awardList[i] ;
          if( x === item){
            break;
          }
        }

        if(index >= 0 ){
          this.awardList.splice(index , 1) ;
        }

      }

    }
  }
</script>

<style scoped>

</style>
