<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>玩家批量邮件</el-breadcrumb-item>
      </el-breadcrumb>


      <el-card>

        <el-row>
          <el-col :span="5" style="margin-right: 10px">
            <el-select v-model="selectResource" placeholder="请选择资源" clearable  filterable >
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

          <el-col :span="5">
            <el-button type="primary" size="medium" icon="el-icon-s-promotion" @click="sendAward">发送</el-button>
          </el-col>


        </el-row>

        <el-row style="margin-top: 20px; width: 500px">
          <el-input
            type="text"
            placeholder="请输入邮件标题"
            v-model="mailTitle"
            maxlength="35"
            show-word-limit
            suffix-icon="el-icon-edit"
          >
          </el-input>
        </el-row>

        <el-row style="margin-top: 20px; width: 500px">
          <el-input
            type="textarea"
            placeholder="请输入邮件正文"
            v-model="mailContent"
            maxlength="400"
            show-word-limit
            suffix-icon="el-icon-edit"
          >
          </el-input>
        </el-row>


        <el-row style="margin-top: 20px">
          <el-table :data="mailResourceList" style="width: 100%" stripe border>
            <el-table-column prop="id" label="资源id" align="center"></el-table-column>
            <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
            <el-table-column prop="num" label="资源数量" align="center">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.num" :min="1" :max="10000000000" size="small" controls-position="center" />
              </template>
            </el-table-column>

            <el-table-column  label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delItem(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>


        <el-row style="margin-top: 40px">


          <el-col :span="12">
            <el-input
              type="textarea"
              :autosize="{minRow: 1 , maxRows:20}"
              placeholder="请输入玩家ID 一个玩家ID占据一行,粘贴复制进去就行"
              v-model="textarea" style="margin-top: 18px; width: 400px">
            </el-input>
          </el-col>

          <el-col :span="12">
            <el-table :data="dataList" style="width: 100%" stripe border>
              <el-table-column prop="playerId" label="玩家ID" align="center"></el-table-column>
              <el-table-column prop="success" label="是否成功" align="center" :formatter="formatBoolean"></el-table-column>
            </el-table>
          </el-col>


        </el-row>


      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'PlayerBatchMail',
    data () {
      return {
        resourceList : [],
        selectResource: '',
        resourceMap : {},
        awardNum : 0,
        // 邮件资源列表
        mailResourceList : [],

        mailTitle: '',
        mailContent: '',
        textarea:'',
        dataList : [],
      }
    },

    created () {
      this.queryResource()
    },

    methods : {

      formatBoolean: function (row, column, cellValue) {
        let ret = ''  //你想在页面展示的值
        if (cellValue) {
          ret = "是"  //根据自己的需求设定
        } else {
          ret = "否"
        }
        return ret;
      },

      async sendAward() {

        if(!this.mailTitle){
          return this.$message.error("请输入邮件标题！")
        }

        if(!this.mailContent){
          return this.$message.error("请输入邮件标题！")
        }

        if(!this.mailResourceList || this.mailResourceList.length == 0){
          return this.$message.error("请添加道具！")
        }

        if(!this.textarea){
          return this.$message.error("请输出玩家ID集合")
        }


        let strList = []
        this.mailResourceList.forEach(x => {
          let item = x.name + " : " + x.num ;
          strList.push(item);
        })
        // var s = '你好 {0} {1}'.formar('value1', 123)
        let lines = this.textarea.split(/[\s\n]/)
        let num = lines.length
        let numX = 0
        for(let i = 0 ;i<num ; i++){
          if(lines[i].trim().length != 0){
            numX ++
          }
        }

        let content = " <strong> 邮件标题为 : _1 </strong> </br> <strong> 邮件内容为 : _2 </strong> </br> <strong> 邮件奖励为 : _3 </strong> </br> <strong> 邮件接受人数为 : _4个人 </strong> </br> </br>"
        content = content.replace("_1" , this.mailTitle);
        content = content.replace("_2" , this.mailContent);
        content = content.replace("_3" , strList.join("\t"));
        content = content.replace("_4" , numX+'');

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
          playerIds: this.textarea,
          mailTitle : this.mailTitle,
          mailContent: this.mailContent,
          itemList: strList.join("|")
        }

        console.log(param)

        const {data: res} = await this.$http.post('/gm/op/batch/mail', param)

        if (res.meta.status !== 200) {
          return this.$message.error('发送批量奖励失败!')
        }

        // this.$message.success('发送全服邮件成功!')

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message:  "批量邮件成功！"
        })

        this.dataList = res.data
        console.log(this.dataList)

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

        // console.log(this.resourceList)
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

    }
  }
</script>

<style scoped>

</style>
