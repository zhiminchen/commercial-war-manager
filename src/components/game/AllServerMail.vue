<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>全服邮件</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-tag>全服服务器列表:</el-tag>
      </el-row>

      <el-row>
        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <div style="margin: 15px 0;"></div>
        <el-checkbox-group v-model="checkedServers" @change="handleCheckedServerChange">
          <el-checkbox v-for="server in serverOptions" :label="server" :key="server">{{server}}</el-checkbox>
        </el-checkbox-group>
      </el-row>

      <div class="row-mail">
        <el-row>
          <el-tag>邮件模板区域</el-tag>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-select v-model="currMailId" placeholder="请选择">
              <el-option
                v-for="item in mailList"
                :key="item.id"
                :label="item.title"
                :value="item.id">
              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-input placeholder="请输入奖励配置" v-model="mailAward" clearable></el-input>
          </el-col>

          <el-col :span="5" style="float: right">
            <el-button type="success" icon="el-icon-message" round @click="sendServersMail">发送邮件</el-button>
          </el-col>

        </el-row>

      </div>


      <div class="row-mail">
        <el-row>
          <el-tag>邮件自由区域</el-tag>
        </el-row>

        <el-row style="margin-top: 20px ">
          <el-col :span="4">
            <el-button type="success" plain @click="open">自由发送邮件</el-button>
          </el-col>
        </el-row>


      </div>

    </el-card>


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
            <el-table :data="mailResourceList" style="width: 100%" stripe border>
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




  </div>
</template>

<script>
  const def_not_select_mail = '没有选中邮件'
  export default {
    name: 'allservermail',
    data () {
      return {
        serverOptions: [],
        checkedServers: [],
        // 是否全选
        checkAll: false,
        isIndeterminate: true,
        // 当前邮件模板id
        currMailId: def_not_select_mail,
        // 邮件模板列表
        mailList: [],
        // 邮件奖励
        mailAward: '',

        awardDialogVisible: false,
        // 奖励form
        awardForm : {
          mailTitle : '',
          mailContent: '',
        },
        selectResource : '',
        // 资源列表
        resourceList: [],
        resourceMap : {},
        awardNum : 0,
        // 邮件资源列表
        mailResourceList : []

      }
    },

    created () {
      this.queryAllGameServer()
      this.queryAllMailList()
      this.queryResource()
    },

    methods: {

      // 获取所有服务器列表
      async queryAllGameServer () {
        const {data: res} = await this.$http.get('/gm/game/servers', {params: {}})
        if (res.meta.status != 200) {
          return this.$message.error('获取游戏服务器列表失败!')
        }

        this.serverOptions = res.data.map(e => e.value)
        // console.log(this.serverOptions)

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

      // 查询邮件列表
      async queryAllMailList () {
        const {data: res} = await this.$http.get('/gm/game/mails', {params: {}})
        if (res.meta.status != 200) {
          return this.$message.error('获取邮件模板列表失败!')
        }

        this.mailList = res.data
        console.log(this.mailList)
      },

      // 全选
      handleCheckAllChange (val) {
        this.checkedServers = val ? this.serverOptions : []
        this.isIndeterminate = false
      },

      handleCheckedServerChange (value) {
        let checkedCount = this.checkedServers.length
        this.checkAll = checkedCount === this.serverOptions.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.serverOptions.length
      },

      // 发送服务器邮件
      async sendServersMail () {
        if (this.checkedServers.length === 0) {
          return this.$message.error('至少要选择一个游戏服务器!')
        }

        if (this.mailAward === '' || this.mailAward == "undefined" || this.mailAward == "" ) {
          return this.$message.error('需要输入邮件奖励！')
        }

        if(this.currMailId === def_not_select_mail){
          return this.$message.error("还没有选择邮件模板!")
        }

        const {data: res} = await this.$http.get('/gm/game/mail/award',{
          params : {
            servers: this.checkedServers.join(","),
            mailTitle: this.currMailId,
            awards: this.mailAward
          }
        })

        if(res.meta.status != 200 ){
          return this.$message.error("发送全服邮件失败!")
        }

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message:  res.data
        })

        // return this.$message.success("这些服务器发送全服邮件成功 ! " +res.data)

      },

      // 奖励对话框关闭
      awardDialogClosed () {
        this.$refs.awardFormRef.resetFields()
        this.awardForm.mailTitle = '';
        this.awardForm.mailContent = '';

        this.selectResource = '';
        this.mailResourceList = [];
        this.awardNum = 0 ;

        this.awardDialogVisible = false;

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

        this.mailResourceList.push(one);
      },

      // 删除道具
      delItem(item){
        if(this.mailResourceList.length <= 0){
          return this.$message.error("没有道具无法删除")
        }

        let index = -1 ;
        for(let i = 0 ;i<this.mailResourceList.length; i++){
          index ++ ;
          let x = this.mailResourceList[i] ;
          if( x === item){
            break;
          }
        }
        if(index >= 0 ){
          this.mailResourceList.splice(index , 1) ;
        }

      },

      // 打开对话框
      open(){
        if(!this.checkedServers || this.checkedServers.length <= 0){
          return this.$message.error("请勾选服务器列表！")
        }
        this.awardDialogVisible = true;
      },

      // 发送玩家奖励
      async sendPlayerAward(){

        if(!this.awardForm.mailTitle){
          return this.$message.error("请输入邮件标题！")
        }

        if(!this.awardForm.mailContent){
          return this.$message.error("请输入邮件标题！")
        }

        if(!this.mailResourceList || this.mailResourceList.length == 0){
          return this.$message.error("请添加道具！")
        }



        let strList = []
        this.mailResourceList.forEach(x => {
          let item = x.name + " : " + x.num ;
          strList.push(item);
        })
        // var s = '你好 {0} {1}'.formar('value1', 123)
        let content = "<strong> 服务器列表为 : _0 </strong> </br> <strong> 邮件标题为 : _1 </strong> </br> <strong> 邮件内容为 : _2 </strong> </br> <strong> 邮件奖励为 : _3 </strong> </br>"
        // let content = "<strong> 邮件标题为 : _1 </strong> </br> <strong> 邮件内容为 : _2 </strong> </br> <strong> 邮件奖励为 : _3 </strong> </br>"
        content = content.replace("_1" , this.awardForm.mailTitle);
        content = content.replace("_2" , this.awardForm.mailContent);
        content = content.replace("_3" , strList.join("\t"));
        content = content.replace("_0" , this.checkedServers.join(","));

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
        this.mailResourceList.forEach(x => {
          let item = x.id + "_" + x.num ;
          strList.push(item);
        })

        let param = {
          serverList: this.checkedServers.join(","),
          mailTitle : this.awardForm.mailTitle,
          mailContent: this.awardForm.mailContent,
          itemList: strList.join("|")
        }

        // console.log(param)

        const {data: res} = await this.$http.post('/gm/game/server/mail', param)

        if (res.meta.status !== 200) {
          return this.$message.error('发送全服邮件失败!')
        }

        // this.$message.success('发送全服邮件成功!')

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message:  res.data
        })


        this.awardDialogVisible = false
        this.awardDialogClosed()

      },

    }
  }
</script>

<style scoped>
  .el-row {
    margin-top: 10px;
  }

  .row-mail {
    margin-top: 20px;
    padding-top: 30px;
  }
</style>
