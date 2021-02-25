<template>
    <div>
      <!--  面包屑导航区域  -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>玩家管理</el-breadcrumb-item>
        <el-breadcrumb-item>玩家查询</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <el-row >
          <el-col :span="8" style="margin-right: 20px">
            <el-input placeholder="请输入长ID或玩家名称" suffix-icon="el-icon-search" v-model="queryFiled" autosize clearable ></el-input>
          </el-col>

          <el-col :span="4">
            <el-button icon="el-icon-search" type="primary" @click="queryData">查询</el-button>
          </el-col>

        </el-row>


        <el-table :data="dataList" border stripe show-header highlight-current-row  ref="multipleTable" tooltip-effect="dark" style="width: 100%"
                  @selection-change="handleSelectionChange">>
          <el-table-column v-if="dataList.length > 0"
            type="selection"
            width="55">
          </el-table-column>


          <el-table-column v-for="item in tableTitle" :key="item" :prop="item" :label="item" >
          </el-table-column>
        </el-table>

        <el-row style="margin-top: 45px">
            <el-col :span="4">
              <el-button size="medium" type="danger">封号</el-button>
            </el-col>

          <el-col :span="4">
            <el-button size="medium" type="warning">禁言</el-button>
          </el-col>

          <el-col :span="4">
            <el-button size="medium" type="info">踢人</el-button>
          </el-col>


          <el-col :span="4">
            <el-button size="medium" type="primary">详情</el-button>
          </el-col>

          <el-col :span="4">
            <el-button size="medium" type="success">奖励</el-button>
          </el-col>



        </el-row>

      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'PlayerQuery',
    data() {
      return {
        queryFiled: '',
        dataList : [],
        tableTitle : [],
        multipleSelection : '',
      }
    },

    created () {
    },

    methods: {

      handleSelectionChange(val) {
        if (val.length > 1) {
          this.$refs.multipleTable.clearSelection()
          this.$refs.multipleTable.toggleRowSelection(val[val.length-1])
        }
        this.multipleSelection = val[val.length-1];
        // console.log(this.multipleSelection)
      },

      // 查询数据
      async queryData() {

        if(!this.queryFiled){
          return this.$message.error('请输入查询数据!')
        }



        const {data : res} = await this.$http.get('/gm/player/find' , {params: {
            'key' : this.queryFiled
          }})

        console.log(res)
        if(res.meta.status !== 200){
          return this.$message.error(res.meta.msg)
        }

        this.dataList = res.data.tableRowList ;
        this.tableTitle = res.data.tableTitle
        console.log(this.tableTitle)

      }
    }
  }
</script>

<style scoped>

</style>
