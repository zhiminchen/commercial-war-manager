<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>公告管理</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row >

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


          <el-col :span="6">
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-col>


          <el-col :span="6">
            <el-button icon="el-icon-edit" type="danger" @click="globalDialogVisible=true">全渠道更新</el-button>
          </el-col>

        </el-row>

        <el-row style="margin-top: 20px">
                  <el-row style="margin-top: 20px">
                    <el-table :data="dataList" stripe border >
                      <el-table-column prop="channelId" label="渠道ID" align="center" ></el-table-column>
<!--                      <el-table-column prop="channelName" label="渠道名称" align="center" ></el-table-column>-->
                      <el-table-column prop="announcementName" label="公告页签名称" align="center" ></el-table-column>
                      <el-table-column prop="title" label="公告标题" align="center" ></el-table-column>

                      <el-table-column prop="content" label="公告内容" align="center" >
                        <template slot-scope="scope">
                          <div v-html="scope.row.content"></div>
                        </template>
                      </el-table-column>

                      <el-table-column prop="sign" label="公告落款" align="center" ></el-table-column>
                      <el-table-column prop="time" label="公告时间" align="center" ></el-table-column>
                      <el-table-column prop="weight" label="公告权重" align="center" ></el-table-column>
                      <el-table-column  label="操作" align="center">
                        <template slot-scope="scope">
                          <el-button type="danger" icon="el-icon-edit" size="mini" @click="editItem(scope.row)">编辑</el-button>
                          <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row)">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>

                  </el-row>
        </el-row>

      </el-card>



      <el-dialog
        title="全渠道公告编辑对话框"
        :visible.sync="globalDialogVisible"
        width="65%" @close="globalDialogClose"
        :close-on-click-modal="false"
      >

        <el-row>
          <div>
            <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedChannel" @change="handleCheckedServerChange">
              <el-checkbox v-for="server in channelOptions" :label="server" :key="server">{{server}}</el-checkbox>
            </el-checkbox-group>
          </div>

        </el-row>

        <el-row style="margin-top: 20px">
          <el-select v-model="selectAdvertising" placeholder="请选择公告">
            <el-option
              v-for="item in advertisingList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-row>


        <el-row style="margin-top: 20px ">
          <el-form  :model="globalForm"   ref="globalFormRef" label-width="150px">

            <el-form-item label="公告标题">
              <el-input v-model="globalForm.advertisingTitle"></el-input>
            </el-form-item>

            <el-form-item label="公告内容">
              <el-input v-model="globalForm.advertisingContent" type="textarea" autosize ></el-input>
            </el-form-item>

            <el-form-item label="公告落款">
              <el-input v-model="globalForm.advertisingSign"></el-input>
            </el-form-item>

            <el-form-item label="公告权重">
              <!--            <el-input v-model="editForm.advertisingWeight"></el-input>-->
              <el-input-number v-model="globalForm.advertisingWeight" :min="1" :max="1000" ></el-input-number>
            </el-form-item>

            <el-form-item label="公告时间">
              <el-date-picker
                v-model="globalForm.advertisingTime"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>

          </el-form>
        </el-row>


        <span slot="footer" class="dialog-footer">
            <el-button @click="globalDialogVisible=false">取 消</el-button>
            <el-button type="primary" size="medium" @click="globalConfirmItem">确 定</el-button>
          </span>
      </el-dialog>


      <!-- 单条公告编辑框     -->
      <el-dialog
        title="公告编辑对话框"
        :visible.sync="editDialogVisible"
        width="65%" @close="editDialogClosed"
        :close-on-click-modal="false"
      >


        <el-form  :model="editForm"   ref="editFormRef" label-width="150px">

            <el-form-item label="公告标题">
              <el-input v-model="editForm.advertisingTitle"></el-input>
            </el-form-item>

          <el-form-item label="公告内容">
            <el-input v-model="editForm.advertisingContent" type="textarea" autosize ></el-input>
          </el-form-item>

          <el-form-item label="公告落款">
            <el-input v-model="editForm.advertisingSign"></el-input>
          </el-form-item>

          <el-form-item label="公告权重">
<!--            <el-input v-model="editForm.advertisingWeight"></el-input>-->
            <el-input-number v-model="editForm.advertisingWeight" :min="1" :max="1000" ></el-input-number>
          </el-form-item>

          <el-form-item label="公告时间">
            <el-date-picker
              v-model="editForm.advertisingTime"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
          </el-form-item>

        </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false">取 消</el-button>
            <el-button type="primary" size="medium" @click="confirmItem">确 定</el-button>
          </span>
      </el-dialog>


    </div>
</template>

<script>
  export default {
    name: 'Advertising',
    data() {
      return {
        channelConfigList : [],
        advertisingList : [],
        selectChannel : '-1',
        // 选择公告
        selectAdvertising : '',
        // 数据集合
        dataList : [],

        editDialogVisible : false,
        globalDialogVisible: false,
        //编辑框
        editForm: {
            channelId : '',
            advertisingId : '',
            advertisingTitle : '',
            advertisingContent: '',
            advertisingSign: '',
            advertisingWeight: '',
            advertisingTime : '',
        },
        // 全局编辑框
        globalForm : {
          advertisingId : '',
          advertisingTitle : '',
          advertisingContent: '',
          advertisingSign: '',
          advertisingWeight: '',
          advertisingTime : '',
        },

        isIndeterminate: true,
        checkAll: false,
        channelOptions: [],
        checkedChannel: [],

      }
    },

    created () {
      this.queryChannelConfig()
      this.queryAdvertisingConfig()
    },

    methods: {

      // 全选
      handleCheckAllChange (val) {
        this.checkedChannel = val ? this.channelOptions : []
        this.isIndeterminate = false
      },

      handleCheckedServerChange (value) {
        this.checkedChannel = value
        let checkedCount = this.checkedChannel.length
        this.checkAll = checkedCount === this.channelOptions.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.channelOptions.length
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

      // 获取公告信息
      async queryAdvertisingConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/announcement")
        if(res.meta.status !== 200){
          return this.$message.error('获取公告信息失败！')
        }
        this.advertisingList = res.data
      },

      // 查询数据
      async queryData() {
        let param = {
          channel : this.selectChannel
        }
        const {data : res} = await this.$http.post("/gm/player/advertising", param)
        if(res.meta.status !== 200){
          return this.$message.error('获取公告数据失败！')
        }



        this.dataList = res.data
      },

      // 编辑条目
      editItem(record) {

        this.editDialogVisible = true;
        this.editForm.advertisingTitle = record.title
        this.editForm.advertisingContent = record.content
        this.editForm.advertisingSign = record.sign
        this.editForm.advertisingTime = record.time
        this.editForm.advertisingWeight = record.weight
        this.editForm.channelId = record.channelId
        this.editForm.advertisingId = record.announcementId


      },


      // 全局确认
      async globalConfirmItem(){

        let title = this.globalForm.advertisingTitle
        if(!title){
          return this.$message.error("广告标题不能为空")
        }

        let content = this.globalForm.advertisingContent
        if(!content){
          return this.$message.error("广告内容不能为空")
        }

        let sign = this.globalForm.advertisingSign
        if(!sign){
          return this.$message.error("广告落款不能为空")
        }

        let time = this.globalForm.advertisingTime
        if(!time){
          return this.$message.error("广告时间不能为空")
        }

        let weight = this.globalForm.advertisingWeight
        if(!weight){
          return this.$message.error("广告权重不能为空")
        }

        if(this.checkedChannel.length <= 0){
          return this.$message.error("至少要选择一个渠道")
        }

        if(!this.selectAdvertising){
          return this.$message.error("请选择一个广告")
        }

        const confirmResult = await this.$confirm.confirm("确认把这条公告同步到选定的渠道吗", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除')
        }


        let param = {
          channelNames : this.checkedChannel.join(","),
          content : this.globalForm.advertisingContent,
          title : this.globalForm.advertisingTitle,
          sign : this.globalForm.advertisingSign,
          weight : this.globalForm.advertisingWeight,
          advertisingId : this.selectAdvertising,
          time : this.globalForm.advertisingTime
        }

        const {data : res} = await this.$http.post("/gm/player/update/same/advertising", param)
        if(res.meta.status !== 200){
          return this.$message.error('更新公告失败！')
        }
        this.globalDialogVisible = false
        if(this.selectChannel){
          this.queryData();
        }

      },

      // 确认编辑
      async confirmItem(){

        let title = this.editForm.advertisingTitle
        if(!title){
          return this.$message.error("广告标题不能为空")
        }

        let content = this.editForm.advertisingContent
        if(!content){
          return this.$message.error("广告内容不能为空")
        }

        let sign = this.editForm.advertisingSign
        if(!sign){
          return this.$message.error("广告落款不能为空")
        }

        let time = this.editForm.advertisingTime
        if(!time){
          return this.$message.error("广告时间不能为空")
        }

        let weight = this.editForm.advertisingWeight
        if(!weight){
          return this.$message.error("广告权重不能为空")
        }


        let param = {
          channelId : this.editForm.channelId,
          content : this.editForm.advertisingContent,
          title : this.editForm.advertisingTitle,
          sign : this.editForm.advertisingSign,
          weight : this.editForm.advertisingWeight,
          advertisingId : this.editForm.advertisingId,
          time : this.editForm.advertisingTime
        }

        const {data : res} = await this.$http.post("/gm/player/update/advertising", param)
        if(res.meta.status !== 200){
          return this.$message.error('更新公告失败！')
        }
        this.editDialogVisible = false
        this.queryData();

      },

      // 删除条目
      async delItem(record){

        let content = "确定要删除"+record.channelName + "下的"+record.announcementName+ "?" ;

        const confirmResult = await this.$confirm.confirm(content, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除')
        }

        let param = {
          channelId : record.channelId,
          advertisingId : record.announcementId,
        }
        const {data : res} = await this.$http.post("/gm/player/del/advertising", param)
        if(res.meta.status !== 200){
          return this.$message.error('删除公告失败失败！')
        }
        this.queryData();

      },

      // 对话框关闭
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
        this.editDialogVisible = false
        this.editForm.advertisingTitle = ''
        this.editForm.advertisingContent = ''
        this.editForm.advertisingSign = ''
        this.editForm.advertisingTime = ''
        this.editForm.advertisingWeight = ''
      },

      globalDialogClose(){
        this.globalDialogVisible = false
        this.$refs.globalFormRef.resetFields()
        this.globalForm.advertisingTitle = ''
        this.globalForm.advertisingContent = ''
        this.globalForm.advertisingSign = ''
        this.globalForm.advertisingTime = ''
        this.globalForm.advertisingWeight = ''
      }



    }
  }
</script>

<style scoped lang="less">
  .el-table .cell {
    text-align: center;
    white-space: pre-line;
  }

</style>
