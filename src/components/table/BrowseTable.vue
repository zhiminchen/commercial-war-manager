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
        <el-table :data="this.$story.tableRowList" border stripe show-header highlight-current-row>
          <el-table-column v-for="item in this.$story.tableTitle" :key="item" :prop="item" :label="item" >
<!--            {{item}}-->
          </el-table-column>
        </el-table>
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
      }
    },


    created () {
      this.dbName = this.$story.configDBName
    },

    methods : {
      back() {
        this.$router.push('/classifytable')
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
