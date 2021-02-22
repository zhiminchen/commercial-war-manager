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
            <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
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
              <el-button  size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
              <el-button  size="mini"  type="danger" icon="el-icon-delete" @click="removeRoleById(scope.row.id)">删除</el-button>
              <el-button  size="mini"  type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
            </template>
          </el-table-column>
        </el-table>

      </el-card>


      <!-- 添加用户对话框   -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="40%" @close="addDialogClosed"
      >

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
          <el-form-item label="角色名称" prop="userName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>

          <el-form-item label="角色描述" prop="password">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>


        </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>


      <!-- 修改角色对话框     -->
      <el-dialog
        title="修改角色对话框"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
          <el-form-item label="角色名">
            <el-input v-model="editForm.roleName" disabled></el-input>
          </el-form-item>

          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>

        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
      </el-dialog>



      <!--  分配权限的对话框  -->
      <el-dialog
        title="分配权限"
        :visible.sync="setRightDialogVisible"
        width="50%" @close="setRightDialogClosed"
      >
        <!-- 树形控件     -->
        <el-tree :data="rightList" :props="treeProps"node-key="id"  ref="treeRef" :default-checked-keys="defKeys" default-expand-all   show-checkbox >
        </el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>

    </div>
</template>

<script>
  export default {
    name: 'Character',

    data() {

      return {

        // 所有角色列表数据
        roleList: [],
        setRightDialogVisible : false,
        rightList: [],
        treeProps: {
          label: 'authName',
          children: 'children'
        },

        // 控制编辑对话框显示的变量
        editDialogVisible: false,
        // 查询到的角色信息对象
        editForm: {},

        // 编辑对话框验证规则
        editFormRules: {
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 2, max: 20, message: '角色描述的长度在2-20个 字符之间', trigger: 'blur'}
          ],
        },
        // 添加对话框
        addDialogVisible: false,
        // 添加角色表单对象
        addForm : {
          roleName : '',
          roleDesc : '',
        },
        // 添加表单的验证规则对象
        addFormRules: {
          roleName: [
            {required: true, message: '请输入角色名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名的长度在3-10个 字符之间', trigger: 'blur'}
          ],
          roleDesc: [
            {required: true, message: '请输入角色描述', trigger: 'blur'},
            {min: 2, max: 20, message: '角色描述的长度在2-20个 字符之间', trigger: 'blur'}
          ],

        },
        // 默认选中的节点id值数组
        defKeys: [] ,
        // 当前角色id
        roleId : 0 ,
      }

    },

    created () {
      this.getRoleList() ;
    },

    methods: {
      async getRoleList(){
        const {data : res} = await this.$http.get('/gm/rights/roles')
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
      async showSetRightDialog(role) {

        const {data: res} = await this.$http.get('/gm/rights/tree')
        if(res.meta.status !== 200){
          return this.$message.error("获取权限数据失败!")
        }
        this.rightList = res.data
        this.defKeys = []
        this.getLeafKeys(role, this.defKeys)
        this.setRightDialogVisible = true;
        // 保存当前角色id
        this.roleId = role.id ;
      },

      // 监听修改用户对话框的关闭事件
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },


      // 修改用户信息并提交
      editUserInfo () {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return

          const {data: res} = await this.$http.put(`/gm/rights/edit`, {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
            id: this.editForm.roleId
          })

          if (res.meta.status !== 200) {
            return this.$message.error('更新角色信息失败!')
          }

          this.editDialogVisible = false
          this.getRoleList()
          this.$message.success('更新角色信息成功!')

        })
      },

      // 编辑用户对话框
      async showEditDialog (id) {
        let param = {id: id}
        const {data: res} = await this.$http.post('/gm/rights/one', param)
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },

      // 监听添加用户对话框的关闭事件
      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },

      // 点击按钮，添加角色
      addRole () {
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) {
            return
          }

          const {data: res} = await this.$http.post('/gm/rights/role/add', this.addForm)
          if (res.meta.status !== 200) {
            this.$message.error('添加角色失败')
            return
          }

          this.$message.success('添加角色成功!')
          this.addDialogVisible = false
          await this.getRoleList()

        })
      },


      // 删除用户
      async removeRoleById (id) {
        const confirmResult = await this.$confirm.confirm('此操作将永久删除该角色, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除')
        }
        let param = {id: id}
        const {data: res} = await this.$http.post('/gm/rights/role/delete', param)

        if (res.meta.status !== 200) {
          return this.$message.error('删除角色失败！')
        }

        this.$message.success('删除角色成功!')
        this.getRoleList()

      },

      // 通过递归的形式获取所有角色下的三级权限
      getLeafKeys(node , arr){
          // 如果当前node节点不包含节点
          if(node.children.length === 0 ){
            return arr.push(node.id)
          }

          node.children.forEach( item => {
            this.getLeafKeys(item , arr)
          })

      },

      // 监听分配权限对话框的事件
      setRightDialogClosed() {
        this.defKeys = []
      },

      // 点击确定为角色分配权限
      async allotRights(){
        const keys = [
          ...this.$refs.treeRef.getCheckedKeys() ,
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]

        // 开始请求服务器设置权限
        const {data: res} = await  this.$http.post("/gm/rights/role/allocation" , {
          id : this.roleId,
          permissionSet : keys.join(",")
        })

        if(res.meta.status !== 200){
          return this.$message.error('分配权限失败!')
        }

        this.$message.success('分配权限成功!')
        this.getRoleList();
        this.setRightDialogVisible = false
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
