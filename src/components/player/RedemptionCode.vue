<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>兑换码生成</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row >
        <el-col :span="6">
          <el-select v-model="selectType" placeholder="请选择礼包码类型">
            <el-option
              v-for="item in giftType"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-input v-model='vip' type='number' oninput="value=value.replace(/[^\d]/g,'')" maxLength='9' clearable  placeholder="请输入vip等级,范围[0,20]" max="20" min="0" style="width: 300px"/>
        </el-col>


        <el-col :span="6" >
          <el-date-picker
            v-model="advertisingTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:SS">
          </el-date-picker>
        </el-col>


      </el-row>

      <el-row style="margin-top: 20px">
        <el-col :span="6">
          <el-input v-model='number' type='number' oninput="value=value.replace(/[^\d]/g,'')" maxLength='9' clearable  placeholder="请输入生成数量,范围[100,10000]" max="10000" min="100"  style="width: 300px"/>
        </el-col>


        <el-col :span="6" style="margin-right: 10px">
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

      <el-row style="margin-top: 25px">
        <el-col :span="6">
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

        <el-col :span="6">
          <el-button type="primary" size="medium" icon="el-icon-s-promotion" @click="createCode">发送</el-button>
        </el-col>

      </el-row>


      <el-row style="margin-top: 25px">
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


      <el-row style="margin-top: 25px">
        <el-table :data="dataList" style="width: 100%" stripe border>
<!--          <el-table-column prop="id" label="编号" align="center"></el-table-column>-->
          <el-table-column prop="code" label="兑换码" align="center"></el-table-column>
          <el-table-column prop="repeat" label="类型" align="center"></el-table-column>
          <el-table-column prop="rewards" label="奖励" align="center"></el-table-column>
          <el-table-column prop="channels" label="渠道" align="center"></el-table-column>
          <el-table-column prop="servers" label="服务器" align="center"></el-table-column>
          <el-table-column prop="vipLevel" label="vip等级" align="center"></el-table-column>
          <el-table-column prop="startTime" label="开始时间" align="center"></el-table-column>
          <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>
        </el-table>
      </el-row>


    </el-card>

  </div>
</template>

<script>
  export default {
    name: 'RedemptionCode',
    data () {
      return {
        awardNum: '',

        dataList: [],
        resourceList: [],
        selectResource: '',

        exportName: '兑换码数据',
        jsonFields: {
          "编号": "id",    //常规字段
          "兑换码": "code", //支持嵌套属性
          "名称": "name",
          "重复类型":"repeat",
          "类型": "type",
          "奖励":"rewards",
          // "完成率": "percentage",
          "开始时间":"startTime",
          "结束时间":"endTime",
          "渠道":"channels",
          "服务器":"servers",
          "vip等级":"vipLevel",
        },

        vip: '' ,
        giftType : [
          {
          id: 1,
          name : '一对多'
        }, {
            id : 2,
            name : '一对一'
          }
          ],
        selectType: '',
        advertisingTime: '',
        number: '',

        // 邮件资源列表
        mailResourceList : []
      }
    },
    created () {
      this.queryResource()
    },

    methods: {

      async createCode() {

        if(!this.selectType){
          return this.$message.error("请选择兑换码类型!")
        }

        if(!this.vip){
          return this.$message.error("请输入vip等级")
        }

        if(this.vip <0 || this.vip > 20){
          return this.$message.error("输入的vip等级范围为[0,20]")
        }


        if(!this.advertisingTime){
          return this.$message.error("请选择时间！")
        }

        if(!this.number){
          return this.$message.error("请输入生成数量的范围[100,10000]")
        }

        if(this.number < 100 || this.number > 10000){
          return this.$message.error("请输入生成数量的范围[100,10000]")
        }


        if(!this.resourceList || this.resourceList.length <= 0){
          return this.$message.error("请添加道具!")
        }


        let strList = []
        let awardList = []
        this.mailResourceList.forEach(x => {
          let item = x.name + " : " + x.num ;
          strList.push(item);
          let one = x.id +"_"+x.num
          awardList.push(one)
        })
        // var s = '你好 {0} {1}'.formar('value1', 123)
        let content = " <strong> 兑换码奖励为 : _3 </strong> </br>"
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

        let param = {
          giftType : this.selectType,
          vipLevel : this.vip,
          beginTime : this.advertisingTime[0],
          endTime : this.advertisingTime[1],
          number: this.number ,
          awards : awardList.join("|")

        }

        console.log(param)

        const {data: res} = await this.$http.post('/gm/op/create/code', param)
        if (res.meta.status !== 200) {
          return this.$message.error('获取资源列表错误！')
        }

        this.dataList = res.data

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
