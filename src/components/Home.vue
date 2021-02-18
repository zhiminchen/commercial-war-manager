<template>

  <el-container class="home-container">
    <el-header>
      <div>
        <img src="../assets/forjoin-logo.png" alt="">
        <span>王牌商战后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <el-container>
      <el-aside :width="isCollapse ? '64px': '200px' ">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" :unique-opened="true"
          :collapse="isCollapse" :collapse-transition="false" router
          :default-active="activePath">
          <!--          <el-submenu index="1">-->
          <!--            <template slot="title">-->
          <!--              <i class="el-icon-location"></i>-->
          <!--              <span>导航一</span>-->
          <!--            </template>-->

          <!--            <el-submenu index="1-4">-->
          <!--              <template slot="title">-->
          <!--                <i class="el-icon-location"></i>-->
          <!--                <span>导航一</span>-->
          <!--              </template>-->
          <!--            </el-submenu>-->
          <!--          </el-submenu>-->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <template slot="title">
              <!--                <i class="el-icon-location"></i>-->
              <i :class="item.icon"></i>
              <span>{{item.authName}}</span>
            </template>

            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id"
                          @click="saveNavState(subItem.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <!--                <i :class="subItem.icon"></i>-->
                <span>{{subItem.authName}}</span>
              </template>

            </el-menu-item>

          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!--  路由占位符号  -->
        <router-view></router-view>
      </el-main>
    </el-container>

  </el-container>


</template>

<script>
  export default {
    name: 'Home',
    data () {
      return {
        menulist: [],
        isCollapse: false,
        activePath: '',
      }
    },
    created () {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
      logout () {
        window.sessionStorage.clear()
        this.$router.push('/login')
      },
      async getMenuList () {
        var userName = window.sessionStorage.getItem('userName')
        var token = window.sessionStorage.getItem('token')
        var id = window.sessionStorage.getItem('id')

        const {data: res} = await this.$http.get('/gm/enums', {
          params: {
            id: id,
            token: token,
            userName: userName
          }
        })

        if (res.meta.status != 200) {
          return this.$message.error(res.meta.msg)
        }
        // console.log(res.data)
        this.menulist = res.data

      },
      // 点击按钮切花折叠
      toggleCollapse () {
        this.isCollapse = !this.isCollapse
      },
      // 保存链接的激活状态
      saveNavState (activePath) {
        window.sessionStorage.setItem('activePath', activePath)
        this.activePath = activePath
      }
    }
  }
</script>

<style scoped lang="less">
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    > div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;

    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #EAEDF1;
  }

  .home-container {
    height: 100%;
  }

  .iconfont {
    margin-right: 10px;
  }

  .toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
