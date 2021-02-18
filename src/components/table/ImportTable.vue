<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>导表管理</el-breadcrumb-item>
      <el-breadcrumb-item>导入策划表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-select v-model="configDBValue" placeholder="请选择" @change="selectChange">
          <el-option
            v-for="item in configDBList"
            :key="item.key"
            :label="item.value"
            :value="item.value" >
          </el-option>
        </el-select>
      </el-row>
    </el-card>


  </div>
</template>

<script>
  export default {
    name: 'importtable',

    data() {
      return {
        configDBList: [],
        configDBValue: '选项1',
        configDBIndex: 1,

      }
    },

    created () {
      this.configList();
    },

    methods : {
      async configList() {
        const {data : res} =  await this.$http.get("/gm/config/list") ;
        if(res.meta.status != 200){
          return this.$message.error("获取配置表列表失败!")
        }

        this.configDBList = res.data
        if(Array.prototype.isPrototypeOf(this.configDBList) && this.configDBList.length !== 0){
          this.configDBValue = this.configDBList[0].value
          this.configDBIndex = this.configDBList[0].key
          // console.log(this.configDBIndex, '   ' , this.configDBValue)
        }

      },

      // 菜单选择改变
      selectChange(selected){

        this.configDBList.forEach(e => {
          if(e.value === selected){
            this.configDBIndex = e.key ;
          }
        })

      }

    }

  }
</script>

<style scoped>

</style>
