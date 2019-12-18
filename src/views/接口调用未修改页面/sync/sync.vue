<template>
  <page-layout id="home">
    <div slot="extra"
         class="extraImg">
      <img :src="setting.extraImage" />
    </div>
    <transition name="page-toggle">
      <keep-alive>
        <a-card class="content">
          <a-list itemLayout="horizontal"
                  split
                  :loading="list.isLoading"
                  :dataSource="list.data">
            <a-list-item slot="renderItem"
                         slot-scope="item">
              <h3 style="width:100%;display:flex;flex-direct:row;justify-content:space-between;">
                {{item.schoolName}}
                <a-button size="small"
                          @click="onSync(item.schoolCode)"
                          type="primary">
                  同步
                </a-button>
              </h3>
            </a-list-item>
          </a-list>
        </a-card>
      </keep-alive>
    </transition>
    <a-modal class="add-modal"
             :visible="sync.isVisible"
             title="注意"
             okText="确定"
             cancelText="取消"
             @cancel="cancelSync"
             @ok="saveSync"
             :okButtonProps="{ props: { loading: sync.isLoading } }">
      <!-- `sync -->
      确认同步吗?
    </a-modal>
    <a-modal :visible="syncModal.isVisible"
             @cancel="syncModal.isVisible=false"
             title="注意">
      <div>
        <p>每分钟只能同步一次</p>
        <p>还剩: {{syncModal.count}} 秒</p>
      </div>
      <template slot="footer">
        <a-button type="primary"
                  @click="syncModal.isVisible = false">确定</a-button>
      </template>
    </a-modal>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
import { formatObjKey } from "@/assets/js/common";

export default {
  name: "QueryList",
  components: { PageLayout },
  data() {
    return {
      // 全局配置
      setting: {
        title: "",
        desc: "",
        linkList: [],
        extraImage: ""
      },
      // `sync 新增form
      sync: {
        // 是否显示同步
        isVisible: false,
        // 学校id
        schoolCode: null,
        // 新增确定loading
        isLoading: false,
      },
      // 倒计时提醒对话框
      syncModal: {
        // 倒计时
        count: -1,
        interval: null,
        isVisible: false
      },
      // `table
      list: {
        // 项目列表
        data: [
        ],
        // 表格loading
        isLoading: false
      }
    };
  },
  methods: {
    // 添加
    onSync(schoolCode) {
      this.sync.schoolCode = schoolCode
      // 同步节流
      const { syncModal } = this
      if (syncModal.count > 0) {
        syncModal.isVisible = true
      } else {
        this.sync.isVisible = true;
      }
    },
    // 添加.保存
    async saveSync() {
      await this.syncSchoolData()
    },
    // 添加.取消
    cancelSync() {
      this.sync.isVisible = false;
    },
    // api
    async syncSchoolData() {
      const { syncModal, sync } = this
      sync.isLoading = true;
      // 接口参数
      let data = { schoolCode: sync.schoolCode };
      // 请求接口
      await this.$api.syncSchoolData(data).then(res => {
        // 成功访问, 处理数据
        if (res.code === 0) {
          this.$message.success("同步成功")
          syncModal.count = 60
          syncModal.interval = setInterval(() => {
            syncModal.count -= 1
          }, 1000)
        }
      });
      sync.isLoading = false;
      sync.isVisible = false;
    },
    // api
    async findSchoolList() {
      this.list.isLoading = true
      await this.$api.findSchoolList().then(res => {
        // 成功访问, 处理数据
        if (res.code === 1 && res.data) {
          this.list.schoolCode = res ?.data[0] ?.schoolCode || "" 
          this.list.data = res.data;
        }
      });
      this.list.isLoading = false
    },
    // 初始数据
    async initData() {
      await this.findSchoolList()
    }
  },
  async created() {
    this.$npStart()
    await this.initData()
    this.$npDone()
  },
  watch: {
    'syncModal.count'() {
      const { syncModal } = this
      if (syncModal.count === 0) {
        clearInterval(syncModal.interval)
        syncModal.isVisible = false
      }
    },
  }

};
</script>
<style lang="scss">
@import "../../assets/style/mixin.scss";
#home {
  .ant-form-item-label label {
    font-weight: 800;
    font-size: 14px;
  }
  .content {
    min-width: $minWidth;
  }
  .table {
    margin-top: 2vh;
  }
  .ant-select {
    width: 200px;
  }
}
</style>

<style lang="less" scoped>
.operator {
  margin-bottom: 18px;
}
@media screen and (max-width: 900px) {
  .fold {
    width: 100%;
  }
}
.extraImg {
  margin-top: -60px;
  text-align: center;
  width: 195px;
  img {
    width: 100%;
  }
}
</style>
