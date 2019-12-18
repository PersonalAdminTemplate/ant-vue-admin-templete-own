<template>
  <page-layout :desc="setting.desc"
               :title="setting.title"
               :linkList="setting.linkList"
               id="inform">
    <div slot="extra"
         class="extraImg">
      <img :src="setting.extraImage" />
    </div>
    <transition name="page-toggle">
      <keep-alive>
        <a-card class="content">
          <!-- `searchForm -->
          <a-form :form="searchForm.form"
                  layout="inline"
                  @submit="onSearch">
            <a-row type="flex"
                   align="middle">
              <a-col>
                <a-spin :spinning="searchForm.isClassLoading">
                  <a-form-item label="班级">
                    <a-select v-decorator="[
                              'clazz',
                              {
                                initialValue: searchForm.className,
                                rules: [{ required: true, message: '请选择班级' }]
                              }
                            ]"
                              @change="onClassChange"
                              placeholder="请选择班级"
                              showArrow>
                      <a-select-option style="width:100px;"
                                       v-for="(item, index) in searchForm.classList"
                                       :key="index"
                                       :title="item.className"
                                       :value="item.className">
                        {{ item.className }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-spin>
              </a-col>
              <a-col style="flex-grow:1">
                <a-form-item>
                  <a-button type="primary"
                            html-type="submit"
                            :loading="searchForm.isLoading"
                            :disabled="searchForm.isLoading">
                    查询
                  </a-button>
                </a-form-item>
              </a-col>
              <a-col>
                <a-button type="primary"
                          @click="onAdd">
                  新增通知
                </a-button>
              </a-col>
            </a-row>
          </a-form>
          <!-- `table -->
          <a-table class="table"
                   :columns="table.columns"
                   :dataSource="table.list"
                   rowKey="key"
                   :pagination="table.pagination"
                   @change="onPageChange"
                   bordered
                   :loading="table.isLoading">
            <template slot="content"
                      slot-scope="text">
              <a-tooltip placement="bottomRight"
                         :title="text"
                         overlayClassName="overlay"
                         :autoAdjustOverflow="true">
                <p class="desc">
                  {{text}}
                </p>
              </a-tooltip>
            </template>
            <template slot="operation"
                      slot-scope="text, record">
              <div class="editable-row-operations">
                <span>
                  <a @click="() => onDelete(record.id)"
                     style="color:#f5222d;">删除</a>
                </span>
              </div>
            </template>
          </a-table>
        </a-card>
      </keep-alive>
    </transition>
    <a-modal class="add-modal"
             :visible="addForm.isVisible"
             title="新增通知"
             okText="确定"
             cancelText="取消"
             @cancel="cancelAdd"
             @ok="saveAdd"
             :okButtonProps="{ props: { loading: addForm.isLoading } }">
      <!-- `addForm -->
      <a-form layout="vertical"
              :form="addForm.form">
        <a-form-item label="班级"
                     v-if="searchForm.classList.length > 0">
          <a-select v-decorator="[
                      'className',
                      {
                        initialValue: searchForm.className,
                        rules: [{ required: true, message: '请选择班级' }]
                      }
                    ]"
                    placeholder="请选择班级"
                    showArrow>
            <a-select-option style="width:100px;"
                             v-for="(item, index) in searchForm.classList"
                             :key="index"
                             :title="item.className"
                             :value="item.className">
              {{ item.className }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="通知标题">
          <a-input autoFocus
                   oninput="value=value.substr(0,20)"
                   v-decorator="[
              'title',
              {
                rules: [
                  {
                    required: true,
                    message: '请填写通知标题'
                  }
                ]
              }
            ]" />
        </a-form-item>
        <a-form-item label="通知内容">
          <a-input type="textarea"
                   rows="5"
                   style="resize:none;"
                   v-decorator="[
              'desc',
              {
                rules: [
                  {
                    required: true,
                    message: '请填写通知内容'
                  }
                ]
              }
            ]" />
        </a-form-item>
      </a-form>
    </a-modal>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";

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
      // 查询form
      searchForm: {
        // form创建依赖
        form: this.$form.createForm(this, {
          name: "form"
        }),
        //学校列表
        classList: [],
        // 学校code
        className: "",
        // 查询按钮loading
        isLoading: false,
        isClassLoading: false
      },
      addForm: {
        // 新增form依赖
        form: this.$form.createForm(this, {
          name: "addForm"
        }),
        // 项目产品列表
        billProductsList: [],
        // 是否显示新增form
        isVisible: false,
        // 新增确定loading
        isLoading: false
      },
      editForm: {
        // 修改form依赖
        form: this.$form.createForm(this, {
          name: "editForm"
        }),
        // 修改按钮依赖数据
        data: {},
        // 是否显示修改form
        isVisible: false,
        // 修改确定loading
        isLoading: false
      },
      table: {
        // 项目列表
        list: [],
        // 缓存
        cacheList: [],
        // 分页依赖
        pagination: {
          current: 1,
          total: 1,
          pageSize: 10
        },
        // 表格loading
        isLoading: false,
        // table标题列表
        columns: [
          {
            title: "日期",
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" },
            align: "center",
            width: 180
          },
          {
            title: "通知标题",
            dataIndex: "title",
            scopedSlots: { customRender: "title" },
            width: 180,
          },
          {
            title: "通知内容",
            dataIndex: "content",
            scopedSlots: { customRender: "content" }
          },
          {
            title: "通知对象",
            dataIndex: "clazz",
            align: "center",
            width: 100,
            scopedSlots: { customRender: "clazz" }
          },
          {
            title: "操作",
            dataIndex: "operation",
            width: 80,
            scopedSlots: { customRender: "operation" },
            align: "center"
          }
        ]
      }
    };
  },
  methods: {
    // 删除
    onDelete(id) {
      this.$info({
        title: '此功能还未启用',
        onOk() { }
      });
    },
    // 查询
    async onSearch(e) {
      e.preventDefault();
      this.searchForm.isLoading = true;
      await this.getUserNotifications();
      this.searchForm.isLoading = false;
    },
    // 班级改变
    async onClassChange(value) {
      this.searchForm.className = value
    },
    // 改变页面
    onPageChange(pagination) {
      this.table.pagination.current = pagination.current
      this.getUserNotifications()
    },
    // 添加
    onAdd() {
      this.addForm.isVisible = true;
    },
    // 添加.保存
    saveAdd() {
      this.$info({
        title: '此功能还未启用',
        onOk() { }
      });
    },
    // 添加.取消
    cancelAdd() {
      this.addForm.isVisible = false;
    },
    // api
    async getClassByUserId() {
      this.searchForm.isClassLoading = true
      await this.$api.getClassByUserId(
        {
          type: 1,
          userId: this.$store.state.account.userInfo.userId
        }
      ).then(res => {
        // 成功访问, 处理数据
        if (res.code === 0 && res.data) {
          this.searchForm.className = res ?.data[0] ?.className || ""
          this.searchForm.classList = res.data;
        }
      });
      this.searchForm.isClassLoading = false
    },
    // api
    async getUserNotifications() {
      this.table.isLoading = true;
      // 加载前清空相关数据
      this.table.list = [];
      // 接口参数
      let data = {
        pageNum: this.table.pagination.current,
        pageSize: this.table.pagination.pageSize,
        userId: this.$store.state.account.userInfo.userId,
        type: 1 // 1:根据班级查询, 2:根据sendId查询, 3: clazz=null查询
      }
      let err
      this.searchForm.form.validateFields((error, values) => {
        err = error
        data.clazz = values.clazz;
      });
      // 表单校验成功则继续
      if (!err) {
        // 检索缓存, 如果存在目标页面数据, 则不调用api,而使用缓存数据
        const cacheFilters = this.table.cacheList.filter(item => {
          return item.pageNum === data.pageNum
            && item.clazz === data.clazz
            && item.userId === data.userId
        })
        if (cacheFilters.length > 0) {
          this.table.list = cacheFilters[0].list
          this.table.pagination.total = cacheFilters[0].total
        } else {
          // 用于缓存已载入数据
          let cache = {
            pageNum: data.pageNum,
            clazz: data.clazz,
            userId: data.userId
          }
          // fetch api
          await this.$api.getUserNotifications(data).then(res => {
            // 成功访问, 处理数据
            if (res.code === 1 && res.data) {
              let list = res ?.data ?.pageData || []
              //添加key( 解决table组件渲染无key报错)
              list.forEach((item, index) => {
                item.key = index
              });
              this.table.list = list;
              this.table.pagination.total = res ?.data ?.dataTotal || 1
              // 已载入数据进行缓存
              cache.list = list
              cache.total = res.data.dataTotal
              this.table.cacheList.push(cache)
            }
          });
        }
      }
      this.table.isLoading = false;
    },
    // 初始数据
    async initData() {
      await this.getClassByUserId()
      this.getUserNotifications()
    }
  },
  async created() {
    this.$npStart()

    await this.initData()
    this.$npDone()
  }

};
</script>
<style lang="scss">
@import "../../assets/style/mixin.scss";
#inform {
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
  .desc {
    @include ellipsis(3);
  }
}
.overlay .ant-tooltip-inner {
  overflow: auto;
  height: 200px;
}
.overlay .ant-tooltip-inner::-webkit-scrollbar {
  width: 4px;
}
.overlay .ant-tooltip-inner::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255);
}
.overlay .ant-tooltip-inner::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 0;
  background: rgba(0, 0, 0, 0.75);
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
