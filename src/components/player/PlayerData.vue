<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>游戏管理</el-breadcrumb-item>
      <el-breadcrumb-item>玩家数据</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <el-row>
        <el-col :span="8" style="margin-right: 20px">
          <el-input placeholder="请输入长ID" suffix-icon="el-icon-search" v-model="queryPlayerId" autosize
                    clearable></el-input>
        </el-col>

        <el-col :span="4" >
          <el-button icon="el-icon-search" type="primary" @click="queryPlayerData">查询</el-button>
        </el-col>
      </el-row>


      <el-row style="margin-top: 20px">
        <el-col :span="4">
          <el-tag type="success" effect="plain">
            基础信息 :
          </el-tag>
        </el-col>
        <el-col :span="24">
          <el-table :data="playerData.kvList" stripe border>
            <el-table-column prop="key" label="字段" align="center"></el-table-column>
            <el-table-column prop="value" label="基础信息" align="center"></el-table-column>
          </el-table>
        </el-col>
      </el-row>


      <el-row style="margin-top: 20px">
        <el-col :span="4">
          <el-tag type="success" effect="plain">
            产业信息 :
          </el-tag>
        </el-col>
        <el-col :span="24">
          <el-table :data="playerData.playerBuildingInfoList" stripe border>
            <el-table-column prop="shopName" label="店名" align="center"></el-table-column>
            <el-table-column prop="moneySpeed" label="赚钱速度" align="center"></el-table-column>
            <el-table-column prop="level" label="等级" align="center"></el-table-column>
            <el-table-column prop="employeeCount" label="员工数" align="center"></el-table-column>
            <el-table-column prop="talent1" label="人才1" align="center"></el-table-column>
            <el-table-column prop="talent2" label="人才2" align="center"></el-table-column>
            <el-table-column prop="talent3" label="人才3" align="center"></el-table-column>
            <el-table-column prop="talent4" label="人才4" align="center"></el-table-column>
          </el-table>
        </el-col>
      </el-row>


      <el-row style="margin-top: 20px">
        <el-col :span="4">
          <el-tag type="success" effect="plain">
            人才信息 :
          </el-tag>
        </el-col>
        <el-col :span="24">
          <el-table :data="playerData.playerTalentInfoList" stripe border>
            <el-table-column prop="name" label="人才名" align="center"></el-table-column>
            <el-table-column prop="state" label="状态" align="center"></el-table-column>
            <el-table-column prop="power" label="战斗力" align="center"></el-table-column>
            <el-table-column prop="operating" label="经营值" align="center"></el-table-column>
            <el-table-column prop="level" label="等级" align="center"></el-table-column>
            <el-table-column prop="star" label="星级" align="center"></el-table-column>
            <el-table-column prop="studyLevel" label="研读等级" align="center"></el-table-column>
            <el-table-column prop="potential" label="潜能等级" align="center"></el-table-column>
            <el-table-column prop="carName" label="座驾" align="center"></el-table-column>
            <el-table-column prop="carLevel" label="汽车等级" align="center"></el-table-column>
            <el-table-column prop="carRefit" label="汽车改装等级" align="center"></el-table-column>543528596097388544
            <el-table-column prop="carMaster" label="汽车改装大师" align="center"></el-table-column>
          </el-table>
        </el-col>
      </el-row>



      <el-row style="margin-top: 20px">
        <el-col :span="4">
          <el-tag type="success" effect="plain">
            环游世界 :
          </el-tag>
        </el-col>
        <el-col :span="24">
          <el-table :data="playerData.playerAroundWorldInfoList" stripe border>
            <el-table-column prop="lineName" label="路线名" align="center"></el-table-column>
            <el-table-column prop="level" label="等级" align="center"></el-table-column>
            <el-table-column prop="closeness1" label="人才1亲密度" align="center"></el-table-column>
            <el-table-column prop="closeness2" label="人才2亲密度" align="center"></el-table-column>
            <el-table-column prop="closeness3" label="人才3亲密度" align="center"></el-table-column>
            <el-table-column prop="closeness4" label="人才4亲密度" align="center"></el-table-column>
            <el-table-column prop="closeness5" label="人才5亲密度" align="center"></el-table-column>
            <el-table-column prop="closeness6" label="人才6亲密度" align="center"></el-table-column>
            <el-table-column prop="closeness7" label="人才7亲密度" align="center"></el-table-column>
          </el-table>
        </el-col>
      </el-row>


      <el-row style="margin-top: 20px">
        <el-col :span="4">
          <el-tag type="success" effect="plain">
            历史订单 :
          </el-tag>
        </el-col>
        <el-col :span="24">
          <el-table :data="playerData.rechargeOrderEntityList" stripe border>
            <el-table-column prop="orderIdStr" label="游戏内订单号" align="center"></el-table-column>
            <el-table-column prop="rechargeId" label="充值档位" align="center"></el-table-column>
            <el-table-column prop="stateName" label="订单状态名称" align="center"></el-table-column>
            <el-table-column prop="channelName" label="渠道名称" align="center"></el-table-column>
            <el-table-column prop="platformName" label="平台名称" align="center"></el-table-column>
            <el-table-column prop="paperPrice" label="账面金额" align="center"></el-table-column>
            <el-table-column prop="actualPrice" label="实际金额" align="center"></el-table-column>
            <el-table-column prop="orderCreateTime" label="订单创建时间" align="center"></el-table-column>

          </el-table>
        </el-col>
      </el-row>

      <el-row style="margin-top: 20px">
        <el-col :span="4">
          <el-tag type="success" effect="plain">
            玩家邮件 :
          </el-tag>
        </el-col>
        <el-col :span="24">
          <el-table :data="playerData.playerMailList" stripe border>
            <el-table-column prop="title" label="标题" align="center"></el-table-column>
            <el-table-column prop="content" label="内容" align="center"></el-table-column>
            <el-table-column prop="attachment" label="附件" align="center"></el-table-column>
            <el-table-column prop="type" label="类型" align="center"></el-table-column>
            <el-table-column prop="hide" label="标志" align="center"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
            <el-table-column prop="endTime" label="结束时间" align="center"></el-table-column>

          </el-table>
        </el-col>
      </el-row>


    </el-card>


  </div>
</template>

<script>
  export default {
    name: 'PlayerData',
    data() {
      return {
        queryPlayerId: '',
        playerData : {
          kvList : [] ,
          playerBuildingInfoList : [] ,
          playerTalentInfoList : [],
          playerAroundWorldInfoList: [],
          rechargeOrderEntityList: [],
          playerMailList: [],

        }
      }

    },

    created () {
      this.queryPlayerId =this.$story.queryPlayerId
      if(this.queryPlayerId){
        this.queryPlayerData()
      }
    },

    methods : {
      // 查询玩家数据
      async queryPlayerData() {
        if(!this.queryPlayerId){
          return this.$message.error('请输入玩家id')
        }

        if(isNaN(this.queryPlayerId)){
          return this.$message.error("玩家id必须是数值类型")
        }

        if(this.queryPlayerId.length < 16|| this.queryPlayerId.length > 18){
          return this.$message.error("玩家的长度必须不低于16位并且不能大于18位")
        }


        let param = {
          playerId: this.queryPlayerId,
          serverId: 0,
        }

        const {data: res} = await this.$http.post('/gm/player/info', param);
        if (res.meta.status !== 200) {
          return this.$message.error('玩家请求失败！')
        }

        if(!res.data){
          return this.$message.warning("没有查找出数据!")
        }

        // this.playerInfoList = res.data
        this.$message.success('玩家请求成功！')

        this.playerData.kvList =  res.data.kvList ;
        this.playerData.playerBuildingInfoList =  res.data.playerBuildingInfoList ;
        this.playerData.playerTalentInfoList =  res.data.playerTalentInfoList ;
        this.playerData.playerAroundWorldInfoList =  res.data.playerAroundWorldInfoList ;
        this.playerData.rechargeOrderEntityList = res.data.rechargeOrderEntityList;
        this.playerData.playerMailList = res.data.playerMailList;

      }
    }
  }
</script>

<style scoped>

</style>
