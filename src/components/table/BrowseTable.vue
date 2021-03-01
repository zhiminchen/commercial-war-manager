<template>
    <div>

      <!--  面包屑导航区域  -->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>导表管理</el-breadcrumb-item>
        <el-breadcrumb-item>数据表预览</el-breadcrumb-item>
      </el-breadcrumb>

      <el-row>
        <el-button type="warning" plain @click="back()">回到配置表分类</el-button>
      </el-row>
      <el-row>
        <el-tag type="info" size="medium" disable-transitions >{{this.$story.configDBName}}</el-tag>
        <el-tag type="info" size="medium" disable-transitions >{{this.$story.configTableName}}</el-tag>
      </el-row>

      <el-card>
        <el-table :data="this.$story.tableRowList.slice((currentPage-1)*pageSize,currentPage*pageSize)" border stripe show-header highlight-current-row>
          <el-table-column v-for="item in this.$story.tableTitle" :key="item" :prop="item" :label="item" >
<!--            {{item}}-->
          </el-table-column>
        </el-table>

        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[500, 1000, 1500, 2000, 2500 , 3000, 3500, 4500]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>

      </el-card>
    </div>
</template>

<script>
  export default {
    name: 'browsetable',
    data () {
      return {
        dbName: 'config',
        tableName: 't_s_car',
        titleList: [],
        rowList : [],
        currentPage :  1 ,
        total: 1000,
        pageSize: 500,
      }
    },


    created () {
      this.dbName = this.$story.configDBName
      this.total = this.$story.tableRowList.length
      console.log(this.total)
    },

    methods : {
      back() {
        this.$router.push('/classifytable')
      },
      handleSizeChange(val) {
        // console.log(`每页 ${val} 条`);
        // 改变每页显示的条数
        this.PageSize=val
        // 注意：在改变每页显示的条数时，要将页码显示到第一页
        this.currentPage=1
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`);
        this.currentPage=val
      }
    }

  }
</script>

<style scoped>
    .el-row {
      margin: 10px 0px;
    }
    .el-tag {
      width: 360px;
      text-align: center;
      font-size: larger;
      font-family: "Arial Black";
    }
</style>
