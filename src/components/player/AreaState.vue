<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>区服状态</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row>


          <el-col :span="4">
            <el-input-number v-model="fromServerId" controls-position="right" :min="1" :max="100000000" placeholder="开始服务器ID"></el-input-number>
          </el-col>

          <el-col :span="4">
            <el-input-number v-model="toServerId" controls-position="right" :min="1" :max="100000000" placeholder="结束服务器ID"></el-input-number>
          </el-col>

          <el-col :span="4">
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-col>


        </el-row>

        <el-row style="margin-top:  20px;">
          <el-table :data="dataList" stripe border>
            <el-table-column prop="serverId" label="服务器ID" align="center"></el-table-column>
            <el-table-column prop="totalPlayerNum" label="累计注册人数" align="center"></el-table-column>
            <el-table-column prop="totalEffectPlayerNum" label="累计有效创角数" align="center"></el-table-column>
            <el-table-column prop="totalPayNum" label="累计付费用户数" align="center"></el-table-column>
            <el-table-column prop="stateDesc" label="状态选择" align="center"></el-table-column>
            <el-table-column prop="recommend" label="是否推荐" align="center"></el-table-column>
            <el-table-column prop="prohibit" label="是否禁止注册" align="center"></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" icon="el-icon-edit" @click="edit(scope.row)">编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-card>


      <el-dialog
        title="区服状态对话框"
        :visible.sync="editDialogVisible"
        width="45%" @close="editDialogClose"
        :close-on-click-modal="false"
      >

        <div>
          <h3>状态选择</h3>
          <el-select v-model="selectState" placeholder="请选状态">
            <el-option
              v-for="item in stateList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </div>

        <div>
          <h3>推荐选择</h3>
          <el-select v-model="selectRecommend" placeholder="请选推荐">
            <el-option
              v-for="item in recommendList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

        </div>

        <div>

          <h3>禁止注册选择</h3>
          <el-select v-model="selectForbid" placeholder="请选推荐">
            <el-option
              v-for="item in forbidList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>

        </div>


        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible=false">取 消</el-button>
            <el-button type="primary" size="medium" @click="putData">确 定</el-button>
          </span>
      </el-dialog>


    </div>
</template>

<script>
  export default {
    name: 'AreaState',
    data() {
      return {
        fromServerId : 1 ,
        toServerId : 1000000,
        dataList: [],
        editDialogVisible: false,

        stateList : [{
          id : 0,
          name : '维护'
        },{
          id : 1,
          name : '正常'
        }],

        selectState : '',
        forbidList : [
          {id : 0,
            name : '-'
          },
          {id : 1,
            name : '禁止'
          }
        ],

        selectForbid: '',

        recommendList : [
          {
            id : 0,
            name : '-'
          },
          {id : 1,
            name : '推荐'

          }
        ],
        // 推荐
        selectRecommend: '',
        // 选中的服务器ID
        selectServerId : '',

      }
    },

    created () {
    },

    methods : {
      //查询数据
      async queryData() {

        if(!this.fromServerId || ! this.toServerId){
          return this.$message.error("请输入服务器ID")
        }

        let param = {
          fromServerId : this.fromServerId,
          toServerId : this.toServerId
        }

        const {data : res} = await this.$http.post("/gm/op/area/info", param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败')
        }

        this.dataList = res.data
        if(!this.dataList || this.dataList.length <= 0){
          this.$message.warning("没有查询出数据！")
        }

      },

      // 编辑区域
      edit(data){
        this.editDialogVisible = true
        this.selectRecommend = 0
        this.selectServerId = data.serverId

        let state = data.state
        if(state == 0){
          this.selectState = 0
        }else if(state == 1){
          this.selectState = 1
        }else if(state == 2){
          this.selectRecommend = 1 ;
        }
        this.selectForbid = 0
        if(data.isProhibit){
          this.selectForbid = 1
        }



      },

      editDialogClose() {
        this.editDialogVisible  = false
        this.selectForbid= ''
        this.selectRecommend = ''
        this.selectState = ''
      },

      // 添加跑马灯
      async putData(){

        const confirmResult = await this.$confirm.confirm("确定要要修改数据吗", '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          dangerouslyUseHTMLString: true
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除')
        }
        let state =  this.selectRecommend === 1 ? 2 : this.selectState

        let param  = {
          serverId : this.selectServerId,
          state : state,
          forbid : this.selectForbid
        }

        const {data : res} = await this.$http.post("/gm/op/edit/area", param)
        if(res.meta.status !== 200){
          return this.$message.error('设置失败')
        }
        this.$message.success("更新数据成功！")
        this.editDialogVisible = false
        this.queryData()

      } ,

    }
  }
</script>

<style scoped>

</style>
