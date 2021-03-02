<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>导表管理</el-breadcrumb-item>
      <el-breadcrumb-item>配置表分类</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col :span="20">
          <el-select v-model="configDBValue" placeholder="请选择" @change="selectChange">
            <el-option
              v-for="item in configDBList"
              :key="item.key"
              :label="item.value"
              :value="item.value">
            </el-option>
          </el-select>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="20">
          <div>
            <el-upload
              class="upload-demo"
              ref="upload"
              action="#"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :auto-upload="false"
              :before-upload="beforeUpload"
              :on-exceed="handleExceed"
              list-type="text"
              accept=".xls,.xlsx"
              :limit="200"
              multiple>
              <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入到数据中</el-button>
              <el-button style="margin-left: 10px;" size="small" type="warning" @click="filterExcelFile">
                只能上传策划表excel文件!
              </el-button>
              <el-button style="margin-left: 10px;" size="small" type="danger" @click="fileList=[]">一件清空文件列表!
              </el-button>
            </el-upload>
          </div>
        </el-col>

      </el-row>


      <el-table ref="multipleTable" :data="configTableList" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange" border>
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="数据库中表名"
          width="240" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.tableName }}</template>
        </el-table-column>

        <el-table-column
          prop="excelFullName"
          label="策划表名"
          show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="excelName"
          label="简介表名"
          show-overflow-tooltip>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-search" @click="previewTableData(scope.row.tableName)">
              预览数据
            </el-button>
<!--            <el-button size="mini" type="danger" icon="el-icon-edit">从新加载数据</el-button>-->

            <!--              </el-upload>-->
          </template>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
  export default {
    name: 'ConfigTableClassify',

    data () {
      return {
        configDBList: [],
        configDBValue: '选项1',
        configDBIndex: 1,
        configTableList: [],
        // 多选项
        multipleSelection: [],
        fileList: [],
      }
    },

    created () {
      this.configList()
      this.tableList()
    },

    methods: {

      handleExceed (file, fileList) {
      },

      beforeUpload (file) {
        let fileType = file.name.substring(file.name.lastIndexOf('.') + 1)
        const isFile =
          fileType === 'xls' ||
          fileType === 'xlsx'
        if (!isFile) {
          this.$message.error('请选择正确的文件格式')
          return false
        }

        const isLt50M = file.size / 1024 / 1024 < 50
        if (!isLt50M) {
          this.$message.error('上传文件大小不能超过 50MB!')
        }
        return isLt50M && isFile
      },

      // 过滤想要的数据表
      filterExcelFile () {
        this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
      },

      //上传文件
      async submitUpload () {
        let formData = new FormData();
        let uploadFiles = this.$refs.upload.uploadFiles;
        if(uploadFiles.length <= 0){
          return this.$message.error("没有文件选中,就上传了文件")
        }

        formData.append("id" , this.configDBIndex);

        uploadFiles.forEach(e => {
          formData.append("file" , e.raw);
        })

        // let file = this.$refs.upload.uploadFiles.pop().raw ;

        const {data: res} = await this.$http.put('/gm/import', formData, {headers: {'Content-Type':'multipart/form-data'}})

        if (res.meta.status != 200) {
          return this.$message.error('导入数据失败!')
        }
        let desc = res.data
        // this.$message.success(desc)

        this.$message({
          dangerouslyUseHTMLString: true,
          showClose: true ,
          duration: 10 * 1000 ,
          type: 'success',
          message: desc
        })

        this.fileList = []

      },

      handleRemove (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview (file) {
        // console.log(file);
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = file.name
        a.href = file.url
        a.dispatchEvent(event)
        console.log(file)
      },

      async configList () {
        const {data: res} = await this.$http.get('/gm/config/list')
        if (res.meta.status != 200) {
          return this.$message.error('获取配置表列表失败!')
        }

        this.configDBList = res.data
        if (Array.prototype.isPrototypeOf(this.configDBList) && this.configDBList.length !== 0) {
          this.configDBValue = this.configDBList[0].value
          this.configDBIndex = this.configDBList[0].key
          // console.log(this.configDBIndex, '   ' , this.configDBValue)
        }

      },

      async tableList () {
        const {data: res} = await this.$http.get('/gm/config/tables')
        if (res.meta.status != 200) {
          return this.$message.error('获取配置表失败！')
        }
        this.configTableList = res.data
      },
      // 选择函数
      toggleSelection (rows) {
        if (rows) {
          rows.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row)
          })
        } else {
          this.$refs.multipleTable.clearSelection()
        }
      },
      // 选择改变函数
      handleSelectionChange (val) {
        this.multipleSelection = val
      },

      // 预览表数据
      async previewTableData (tableName) {
        // console.log(tableName)
        const {data: res} = await this.$http.get('/gm/preview/table', {
          params: {
            config_db_id: this.configDBIndex,
            table_name: tableName
          }
        })
        if (res.meta.status != 200) {
          return this.$message.error('获取具体表数据错误')
        }

        // console.log(res.data)
        this.$story.configDBName = res.data.configDBName
        this.$story.configTableName = res.data.configTableName
        this.$story.tableTitle = res.data.tableTitle
        this.$story.tableRowList = res.data.tableRowList

        this.$router.push('/browsetable')

      },
      // 菜单选择改变
      selectChange (selected) {

        this.configDBList.forEach(e => {
          if (e.value === selected) {
            this.configDBIndex = e.key
          }
        })

      }

    }
  }

</script>

<style scoped>
  .el-upload {
    display: inline;
    margin-left: 10px;
    margin-right: 10px;
  }

  .el-row {
    margin-bottom: 10px;
  }

  .float-right {
    float: right;
  }

</style>
