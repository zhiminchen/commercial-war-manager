<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据库对比</el-breadcrumb-item>
      </el-breadcrumb>


      <el-card>

        <el-row>

          <el-table :data="dbList" stripe border>
            <el-table-column prop="id" label="编号" align="center"></el-table-column>
            <el-table-column prop="fromDataBase" label="对比数据库" align="center"></el-table-column>
            <el-table-column prop="fromDesc" label="对比数据库描述" align="center"></el-table-column>
            <el-table-column prop="toDatabase" label="被对比数据库" align="center"></el-table-column>
            <el-table-column prop="toDesc" label="被对比数据库描述" align="center"></el-table-column>

            <el-table-column label="对比" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-search" @click="compareDB(scope.row.id)">
                  对比
                </el-button>
              </template>
            </el-table-column>


          </el-table>


          <el-table :data="dataList" stripe border style="margin-top: 40px">
            <el-table-column prop="key" label="对比结果" align="center"></el-table-column>
            <el-table-column prop="value" label="被对比结果" align="center"></el-table-column>
          </el-table>



        </el-row>

      </el-card>

    </div>
</template>

<script>
  export default {
    name: 'DataBaseDiff',
    data() {
      return {
        dbList : [],
        dataList : [] ,
      }
    },
    created () {

      this.queryAllDataBase()
    },

    methods : {

      // 查询所有数据库
      async queryAllDataBase(){

        const {data: res} = await this.$http.get('/gm/player/db/list')

        if (res.meta.status != 200) {
          return this.$message.error('获取数据失败!')
        }

        this.dbList = res.data ;
      },

      // 对比数据库
      async compareDB(id){
        let param = {
          id : id
        }

        const {data: res} = await this.$http.post('/gm/player/db/diff' , param)

        if (res.meta.status != 200) {
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;
      }
    }
  }
</script>

<style scoped>

</style>
