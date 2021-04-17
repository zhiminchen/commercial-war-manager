<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏数据</el-breadcrumb-item>
        <el-breadcrumb-item>人才分布</el-breadcrumb-item>
      </el-breadcrumb>


      <el-card>
        <el-row>
          <el-col :span="4">
            <el-select v-model="beginServerId" placeholder="请选择起始服务器">
              <el-option v-for="item in gameConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="endServerId" placeholder="请选择结束服务器">
              <el-option v-for="item in gameConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="playerType" placeholder="请选择玩家类型">
              <el-option v-for="item in playerTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>

          </el-col>


          <el-col :span="4">
            <el-select v-model="levelType" placeholder="请选择等级类型">
              <el-option v-for="item in levelTypeList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>

          </el-col>


          <el-col :span="4">
            <el-select v-model="talentId" placeholder="请选择人才类型">
              <el-option v-for="item in talentList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>

          </el-col>

          <el-col :span="4" >
            <el-button icon="el-icon-search" type="primary" plain @click="queryData">查询</el-button>
          </el-col>


        </el-row>


        <el-row style="margin-top: 20px">

          <el-table :data="dataList" stripe border>
            <el-table-column prop="serverId" label="区服" align="center"></el-table-column>
            <el-table-column prop="dau" label="DAU" align="center"></el-table-column>
            <el-table-column prop="talentId" label="人才ID" align="center"></el-table-column>
            <el-table-column prop="level" label="等级" align="center"></el-table-column>
            <el-table-column prop="count" label="人数" align="center"></el-table-column>

          </el-table>
        </el-row>


      </el-card>


    </div>
</template>

<script>
  export default {
    name: 'TalentLevelDistribution',

    data() {
      return {
        beginServerId : '',
        endServerId: '' ,
        gameConfigList: [],
        // 玩家类型
        playerTypeList : [
          {id : 1 , name : '全部'},
          {id : 2 , name : '活跃玩家'},
          {id : 3 , name : '付费玩家'},
          {id : 4 , name : '流失玩家'},
        ],
        // 等级类型
        levelTypeList : [
          {id : 1 , name : '人才等级'},
          {id : 2 , name : '人才星级'},
          {id : 3 , name : '人才研读等级'},
          {id : 4 , name : '人才潜能等级'},
        ],
        playerType : 1,
        levelType : 1,
        talentId: '',
        dataList: [],
        // 人才列表
        talentList : [
          {id :  30001 ,name : '周懂'},
          {id :  30002 ,name : '杰凯成'},
          {id :  30003 ,name : '谭伯虎'},
          {id :  30004 ,name : '姚暗'},
          {id :  30005 ,name : '欧麦伽'},
          {id :  30006 ,name : '千子鹤'},
          {id :  30007 ,name : '古月郭'},
          {id :  30008 ,name : '亦帆'},
          {id :  30009 ,name : '龙传任'},
          {id :  30010 ,name : '倚子淇'},
          {id :  30011 ,name : '哆啦维娅'},
          {id :  30012 ,name : '范媚良'},
          {id :  30013 ,name : '颖宝'},
          {id :  30014 ,name : '杨天宝'},
          {id :  30015 ,name : '琦琦子'},
          {id :  30016 ,name : '柳圆圆'},
          {id :  30017 ,name : '狄丽'},
          {id :  30018 ,name : '杨函数'},
          {id :  30019 ,name : '茜茜'},
          {id :  30020 ,name : '杨锦鲤'},
          {id :  30021 ,name : '乃潇'},
          {id :  30022 ,name : '宋涓儿'},
          {id :  30023 ,name : '莱昂李'},
          {id :  30024 ,name : '西罗'},
          {id :  30025 ,name : '特兹拉'},
          {id :  30026 ,name : '艾恩曼'},
          {id :  30027 ,name : '帕菲特'},
          {id :  30028 ,name : '史莉嘉'},
          {id :  30029 ,name : '莓莓'},
          {id :  30030 ,name : '迪安娜'},
          {id :  30031 ,name : '大表姐'},
          {id :  30032 ,name : '银桑'},
          {id :  30035 ,name : '滨库贝'},
          {id :  30036 ,name : '智贤欧尼'},
          {id :  30038 ,name : '芭比莎'},
          {id :  30039 ,name : '结衣酱'},
          {id :  30040 ,name : '乔安'},
          {id :  30041 ,name : '可柔'},
          {id :  30101 ,name : '李乘风'}],
      }
    },

    created () {
      this.queryGameConfig()
    },

    methods : {
      // 查询游戏配置
      async queryGameConfig() {
        const {data : res} = await this.$http.get("/gm/ad/config/game")
        if(res.meta.status !== 200){
          return this.$message.error('获取游戏配置失败！')
        }
        this.gameConfigList = res.data
        if(this.gameConfigList.length){
          this.gameConfigList.splice(0,1);
        }


      },

      // 查询日期
      async queryData(){

        if(!this.beginServerId){
          return this.$message.error("请选择起始区服！")
        }

        if(!this.endServerId){
          return this.$message.error("请选择结束区服!")
        }

        if(!this.playerType){
          return this.$message.error("请选择玩家类型！")
        }

        if(!this.levelType){
          return this.$message.error("请选择等级类型！")
        }

        if(!this.talentId){
          return this.$message.error("请选择人才！")
        }

        let param = {
          startServerId : this.beginServerId ,
          endServerId : this.endServerId,
          playerType : this.playerType,
          levelType: this.levelType,
          talentId : this.talentId
        }
        this.dataList = []
        const {data : res} = await this.$http.post("/gm/game/data/talent/level",param)
        if(res.meta.status !== 200){
          return this.$message.error('获取数据失败!')
        }

        this.dataList = res.data ;
        if(!this.dataList  || this.dataList.length == 0){
          this.$message.warning("没有查询出数据！")
        }

        // console.log(this.dataList)

      }


    }

  }
</script>

<style scoped>

</style>
