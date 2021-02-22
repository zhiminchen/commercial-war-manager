<template>
  <div>

    <!--  面包屑导航区域  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域   -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getUserList" clearable>
            <el-button slot="append" icon="el-icon-search"
                       @click="getUserList">
            </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!--  用户列表区域    -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="roleName"></el-table-column>
        <!--        <el-table-column label="状态" prop="mgState">-->
        <!--          <template slot-scope="scope">-->
        <!--            &lt;!&ndash;            {{scope.row}}&ndash;&gt;-->
        <!--            <el-switch v-model="scope.row.mgState" @change="userStateChanged(scope.row)"></el-switch>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="操作" width="190px">
          <template slot-scope="scope">

            <el-tooltip effect="dark" content="编辑角色" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini"
                         @click="showEditDialog(scope.row.id)"></el-button>
            </el-tooltip>

            <el-tooltip effect="dark" content="删除角色" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini"
                         @click="removeUserById(scope.row.id)"></el-button>
            </el-tooltip>


            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>

      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryInfo.pageNum"
        :page-sizes="[1,2,5,10]"
        :page-size="queryInfo.pageSize"
        layout="prev, pager, next, jumper"
        :total="total">
      </el-pagination>

      <!-- 添加用户对话框   -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="40%" @close="addDialogClosed"
      >

        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="120px">
          <el-form-item label="用户名" prop="userName">
            <el-input v-model="addForm.userName"></el-input>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>

          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>


        </el-form>

        <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户对话框     -->
      <el-dialog
        title="修改用户对话框"
        :visible.sync="editDialogVisible"
        width="50%" @close="editDialogClosed"
      >
          <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="80px">
            <el-form-item label="用户名">
              <el-input v-model="editForm.userName" disabled></el-input>
            </el-form-item>

            <el-form-item label="邮箱" prop="email">
              <el-input v-model="editForm.email"></el-input>
            </el-form-item>


            <el-form-item label="手机" prop="mobile">
              <el-input v-model="editForm.mobile"></el-input>
            </el-form-item>

          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="editUserInfo">确 定</el-button>
          </span>
      </el-dialog>


      <!-- 分配角色对话框     -->
      <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" >
        <div>
          <p>当前用户: {{userInfo.userName}}</p>
          <p>当前角色: {{userInfo.roleName}}</p>
          <p>分配新角色:
            <el-select v-model="selectedRoleId" placeholder="请选择">
              <el-option
                v-for="item in rolesList"
                :key="item.id"
                :label="item.roleName"
                :value="item.id">
              </el-option>
            </el-select>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
      </el-dialog>


    </el-card>
  </div>
</template>

<script>
  export default {
    name: 'Customer',
    data () {

      // 邮箱校验
      let checkEmail = (rule, value, cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        if (regEmail.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法的邮箱'))

      }

      // 手机校验
      let checkMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
        if (regMobile.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法的手机号'))

      }

      return {

        // 获取用户列表的参数对象
        queryInfo: {
          query: '',
          pageNum: 1,
          pageSize: 4
        },
        userList: [],
        total: 0,
        // 控制对话框的隐藏和显示
        addDialogVisible: false,
        // 添加用户的表单数据
        addForm: {
          userName: '',
          password: '',
          email: '',
          mobile: ''

        },
        // 添加表单的验证规则对象
        addFormRules: {
          userName: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 3, max: 10, message: '用户名的长度在3-10个 字符之间', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 6, max: 15, message: '密码的长度在6-15个 字符之间', trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}

          ],
        },
        // 编辑对话框验证规则
        editFormRules: {
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkEmail, trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: checkMobile, trigger: 'blur'}

          ]
        },

        // 控制编辑对话框显示的变量
        editDialogVisible: false,
        // 查询到的用户信息对象
        editForm: {},
        // 设置角色对话框的显示与隐藏
        setRoleDialogVisible : false,
        // 需要被分配角色的用户信息
        userInfo: {},
        // 角色列表
        rolesList : [],
        // 被选中的roleId
        selectedRoleId: ''
      }
    },
    created () {
      this.getUserList()
    },
    methods: {
      // 获取用户列表
      async getUserList () {
        let param = JSON.stringify(this.queryInfo)
        const {data: res} = await this.$http.post('/gm/user/list', param)
        if (res.meta.status !== 200) {
          return this.$message.error('获取用户列表失败！')
        }
        this.userList = res.data.users
        this.total = res.data.total
      },

      //
      handleSizeChange (newSize) {
        // console.log(newSize)
        this.queryInfo.pageSize = newSize
        this.getUserList()
      },

      // 监听页码值改变值
      handleCurrentChange (newPage) {
        console.log(newPage)
        this.queryInfo.pageNum = newPage
        this.getUserList()
      },

      // 状态改变函数
      async userStateChanged (userInfo) {

        const {data: res} = await this.$http.post(`/api/users/${userInfo.id}/state/${userInfo.mgState}`)
        console.log(res)
        if (res.meta.status !== 200) {
          userInfo.mgState = !userInfo.mgState
          return this.$message.error('更新用户状态失败!')
        }

        this.$message.success('更新用户状态成功！')
      },
      // 监听添加用户对话框的关闭事件
      addDialogClosed () {
        this.$refs.addFormRef.resetFields()
      },
      // 点击按钮，添加用户
      addUser () {
        this.$refs.addFormRef.validate(async valid => {
          // console.log(valid)
          if (!valid) {
            return
          }

          this.addForm.password = this.$md5(this.addForm.password)
          console.log(this.addForm)
          const {data: res} = await this.$http.post('/gm/user/add', this.addForm)
          if (res.meta.status !== 200) {
            this.$message.error('添加用户失败')
            return
          }

          this.$message.success('添加用户成功!')
          this.addDialogVisible = false
          await this.getUserList()

        })
      },

      // 编辑用户对话框
      async showEditDialog (id) {
        let param = {id: id}
        const {data: res} = await this.$http.post('/gm/user/one', param)
        if (res.meta.status !== 200) {
          return this.$message.error('查询用户信息失败')
        }
        this.editForm = res.data
        this.editDialogVisible = true
      },
      // 监听修改用户对话框的关闭事件
      editDialogClosed () {
        this.$refs.editFormRef.resetFields()
      },

      // 修改用户信息并提交
      editUserInfo () {
        this.$refs.editFormRef.validate(async valid => {
          if (!valid) return

          const {data: res} = await this.$http.put(`/gm/user/edit`, {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
            id: this.editForm.id
          })

          if (res.meta.status !== 200) {
            return this.$message.error('更新用户信息失败!')
          }

          this.editDialogVisible = false
          this.getUserList()
          this.$message.success('更新用户信息成功!')

        })
      },

      // 删除用户
      async removeUserById (id) {
        const confirmResult = await this.$confirm.confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)

        if (confirmResult !== 'confirm') {
          return this.$message.info('已经取消删除')
        }
        let param = {id: id}
        const {data: res} = await this.$http.post('/gm/user/delete', param)

        if (res.meta.status !== 200) {
          return this.$message.error('删除用户失败！')
        }

        this.$message.success('删除用户成功!')
        this.getUserList()

      },
      // 展示分配角色的对话框
      async setRole(userInfo) {
        this.userInfo = userInfo ;
        // 在展示兑换框之前，需要获取所有角色
        const {data : res } = await this.$http.get('/gm/rights/roles')
        if(res.meta.status !== 200){
          return this.$message.error('获取角色列表失败！')
        }
        this.rolesList = res.data

        this.setRoleDialogVisible = true
      },

      // 点击按钮分配角色
      async saveRoleInfo(){

        if(!this.selectedRoleId){
          return this.$message.error('请选择要分配的角色！')
        }

        const {data: res} = await this.$http.put('/gm/user/role' , {
          id : this.userInfo.id ,
          roleId : this.selectedRoleId
        })

        if(res.meta.status !== 200){
          return this.$message.error('更新角色失败！')
        }

        this.$message.success('更新角色成功！')
        this.getUserList()
        this.setRoleDialogVisible = false

      }
    }
  }
</script>

<style scoped lang="less">

</style>
