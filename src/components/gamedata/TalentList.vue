<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>游戏数据</el-breadcrumb-item>
        <el-breadcrumb-item>人才-玩家列表</el-breadcrumb-item>
      </el-breadcrumb>


      <el-card>
        <el-row>
          <el-col :span="4">
            <el-select v-model="serverId" placeholder="请选择服务器">
              <el-option v-for="item in gameConfigList"
                         :key="item.id"
                         :label="item.name"
                         :value="item.id" >

              </el-option>
            </el-select>
          </el-col>

          <el-col :span="4">
            <el-select v-model="quality" placeholder="请选择品质">
              <el-option v-for="item in qualityList"
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
          <el-col :span="4">
            <el-tag>起始等级: </el-tag>
            <el-input-number v-model="startLevel" :min="1" :max="5000" label="描述文字" size="small"></el-input-number>
          </el-col>
          <el-col :span="4">
            <el-tag>终止等级: </el-tag>
            <el-input-number v-model="endLevel"  :min="1" :max="5000" label="终止等级" size="small" ></el-input-number>
          </el-col>

          <el-col :span="4">
            <el-tag>起始星级: </el-tag>
            <el-input-number v-model="startStarLevel" :min="1" :max="5000" label="起始星级" size="small"></el-input-number>
          </el-col>
          <el-col :span="4">
              <el-tag>终止星级: </el-tag>
              <el-input-number v-model="endStarLevel"  :min="1" :max="5000" label="终止星级" size="small"></el-input-number>
          </el-col>


        </el-row>

        <el-row style="margin-top: 20px">

          <el-table :data="dataList" stripe border>
            <el-table-column prop="playerId" label="玩家ID" align="center"></el-table-column>
            <el-table-column prop="playerName" label="玩家名称" align="center"></el-table-column>
            <el-table-column prop="serverId" label="区服" align="center"></el-table-column>

            <el-table-column prop="level" label="身份等级" align="center"></el-table-column>
            <el-table-column prop="moneySpeed" label="赚钱速度" align="center"></el-table-column>
            <el-table-column prop="power" label="战斗力" align="center"></el-table-column>
            <el-table-column prop="recharge" label="付费金额" align="center"></el-table-column>
            <el-table-column prop="loss" label="流失时间" align="center"></el-table-column>
            <el-table-column prop="talentNum" label="满足数量" align="center"></el-table-column>

          </el-table>
        </el-row>


      </el-card>


    </div>
</template>

<script>
  export default {
    name: 'TalentList',

    data() {
      return {
        serverId : '',
        quality: 0 ,
        talentId: 0,
        gameConfigList: [],
        startLevel: 1,
        endLevel : 1,
        startStarLevel : 1 ,
        endStarLevel : 1,
        // 玩家类型
        playerTypeList : [
          {id : 1 , name : '全部'},
          {id : 2 , name : '活跃玩家'},
          {id : 3 , name : '付费玩家'},
          {id : 4 , name : '流失玩家'},
        ],

        qualityList : [
          {id : 0 , name : '全部品质'},
          {id : 1 , name : '绿色'},
          {id : 2 , name : '蓝色'},
          {id : 3 , name : '紫色'},
          {id : 4 , name : '橙色'},
          {id : 5 , name : '红色'},
        ],

        talentList : [
          {id :  0 ,name : '全部人才'},
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

        playerType : 1,
        dataList: [],
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

        if(!this.serverId){
          return this.$message.error("请选择区服！")
        }

        let param = {
          serverId : this.serverId ,
          quality : this.quality,
          talentId : this.talentId,
          startLevel: this.startLevel,
          endLevel : this.endLevel,
          startStarLevel : this.startStarLevel ,
          endStarLevel : this.endStarLevel,

        }

        const {data : res} = await this.$http.post("/gm/game/data/talent/list",param)
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
