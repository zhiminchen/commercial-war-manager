<template>
  <div>
    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域   -->
    <el-card>
      <!--  添加用户区域    -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!--  角色列表区域    -->
      <el-table :data="roleList" border stripe>
        <!--  展开列       -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbottom', i1 === 0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id" >
              <!--  渲染一级权限            -->
              <el-col  :span="5">
                <el-tag>
                  {{item1.authName}}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--  渲染二,三级权限            -->
              <el-col :span="19"  >
                  <el-row :class="[i2 === 0 ? 'bdtop': '',  'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                    <el-col :span="6">
                      <el-tag type="success">
                        {{item2.authName}}
                      </el-tag>
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                    <el-col :span="18">
                      <el-tag v-for="(item3, i3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById()">
                        {{item3.authName}}
                      </el-tag>
                    </el-col>
                  </el-row>
              </el-col>
            </el-row>
<!--            <pre>-->
<!--              {{scope.row}}-->
<!--            </pre>-->
          </template>
        </el-table-column>
        <!--  索引列      -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button  size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button  size="mini"  type="danger" icon="el-icon-delete">删除</el-button>
            <el-button  size="mini"  type="warning" icon="el-icon-setting" @click="showSetRightDialog">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-card>

    <!--  分配权限的对话框  -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      >
     <!-- 树形控件     -->
      <el-tree :data="rightList" :props="treeProps">

      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      // 所有角色列表数据
      roleList: [],
      setRightDialogVisible : false,
      rightList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      }
    }

  },

  created () {
    this.getRoleList() ;
  },

  methods: {
    async getRoleList(){
       const {data : res} = await this.$http.get('/api/roles')
      if(res.meta.status != 200){
        return this.$message.error('获取角色列表失败!')
      }
      this.roleList = res.data ;
    },


    // 更具id删除对应的权限
    async removeRightById(){
      const confirmResult = await this.$confirm.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err);

      if(confirmResult !== 'confirm'){
        return this.$message.info('取消了删除用户权限');
      }


    },
    // 展示分配权限对象
    showSetRightDialog() {
      this.setRightDialogVisible = true;
    }

  },

}
</script>

<style scoped>
  .el-tag {
    margin: 7px ;
  }
  .bdtop {
    border-top: 1px solid #eee ;
  }

  .bdbottom {
    border-bottom: 1px solid;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
