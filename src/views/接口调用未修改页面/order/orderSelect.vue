<template>
  <page-layout :desc="setting.desc"
               :title="setting.title"
               :linkList="setting.linkList"
               id="user-manager">
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
                <a-form-item label="账户">
                  <a-input @change="onAccountChange"
                           v-decorator="['account',
                            { initialValue: '',
                            rules:[{
                              required:true,
                              message: '请输入账户'
                            }] 
                           }]" />
                </a-form-item>
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
            </a-row>
          </a-form>
          <!-- `user-table -->
          <a-table class="table"
                   :pagination="table.userPagination"
                   :columns="table.userColumns"
                   :dataSource="table.userList"
                   rowKey="key"
                   bordered
                   :loading="table.isUserLoading">
          </a-table>
          <!-- `orderTable -->
          <a-table class="table"
                   :pagination="table.orderPagination"
                   :columns="table.orderColumns"
                   :dataSource="table.orderList"
                   rowKey="key"
                   @change="onPageChange"
                   bordered
                   :loading="table.isOrderLoading">
            <template slot="status"
                      slot-scope="text,record">
              {{record.status | transformStatus(record.status)}}
            </template>
          </a-table>
        </a-card>
      </keep-alive>
    </transition>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
const statusList = [{ status: 0, label: "未支付" }, { status: 1, label: "未支付" }, { status: 2, label: "已付款" }, { status: 3, label: "已发货" }, { status: 4, label: "已完成" }, { status: 5, label: "已取消" }, { status: 6, label: "已退款" },]
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
      searchForm: {
        // 查询form依赖
        form: this.$form.createForm(this, {
          name: "form"
        }),
        // 查询按钮loading
        isLoading: false,
        // 查询账户
        account: ""
      },
      table: {
        userId: "",
        // 用户表头
        userColumns: [
          {
            title: "学校编号",
            dataIndex: "orgNo",
            scopedSlots: { customRender: "orgNo" },
            align: "center"
          },
          {
            title: "班级编号",
            dataIndex: "departName",
            scopedSlots: { customRender: "departName" },
            align: "center"
          },
          {
            title: "身份",
            dataIndex: "identity",
            scopedSlots: { customRender: "identity" },
            align: "center"
          },
          {
            title: "学生姓名",
            dataIndex: "studentName",
            scopedSlots: { customRender: "studentName" },
            align: "center"
          },
          {
            title: "学号",
            dataIndex: "workNo",
            scopedSlots: { customRender: "workNo" },
            align: "center"
          }
        ],
        //订单表头
        orderColumns: [
          {
            title: "商品名称",
            dataIndex: "productName",
            scopedSlots: { customRender: "productName" },
            align: "center"
          },
          {
            title: "学校编号",
            dataIndex: "orgNo",
            scopedSlots: { customRender: "orgNo" },
            align: "center"
          },
          {
            title: "订单编号",
            dataIndex: "orderNo",
            scopedSlots: { customRender: "orderNo" },
            align: "center"
          },
          {
            title: "订单金额（元）",
            dataIndex: "price",
            scopedSlots: { customRender: "price" },
            align: "center"
          },
          {
            title: "缴费时间",
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" },
            align: "center"
          },
          {
            title: "订单状态",
            dataIndex: "status",
            scopedSlots: { customRender: "status" },
            align: "center"
          }
        ],
        // 表格loading
        isUserLoading: false,
        // 表格loading
        isOrderLoading: false,
        // 用户列表
        userList: [],
        // 订单列表
        orderList: [],
        userPagination: {
          total: 0,
          pageSize: 10,
          current: 1,
          hideOnSinglePage: true
        },
        orderPagination: {
          total: 0,
          current: 1,
          hideOnSinglePage: true,
          pageSize: 10
        },
      }
    };
  },
  methods: {
    // 搜索
    async onSearch(e) {
      e.preventDefault();
      this.searchForm.isLoading = true;
      let err
      this.searchForm.form.validateFields(error => {
        err = error
      })
      if (err) {
        this.searchForm.isLoading = false;
        return
      }
      this.table.orderPagination.current = 1
      await this.findUser()
      await this.getUserOrders()
      this.searchForm.isLoading = false;
    },
    // 查询账户改变
    onAccountChange(e) {
      const value = e.target.value
      this.searchForm.account = value
    },
    onPageChange(pagination) {
      this.table.orderPagination.current = pagination.current
      this.getUserOrders()
    },
    // api
    async findUser() {
      this.table.isUserLoading = true;
      // 加载前清空相关数据
      this.table.userList = [];
      this.table.userId = "";
      let data = { account: this.searchForm.account };
      await this.$api.findUser(data).then(res => {
        // 成功访问, 处理数据
        if (res.code === 1) {
          this.table.userId = res ?.data ?.userId || null
          // 加上key, 解决table组件渲染无key报错
          let list = [...(res ?.data ?.usrChildren || [])]
          let rList = []
          list.forEach((item, index) => {
            item.key = index
          })
          this.table.userList = list
        } 
      });
      this.table.isUserLoading = false;
    },
    // api 
    async getUserOrders() {
      this.table.isOrderLoading = true;
      // 加载前清空相关数据
      this.table.orderList = [];
      // 接口参数
      let data = {
        pageSize: this.table.orderPagination.pageSize,
        pageNum: this.table.orderPagination.current,
        buyerId: this.table.userId
        // buyerid: this.table.userId
      }
      let err
      // 表单数据添加到参数中
      this.searchForm.form.validateFields((error, values) => {
        err = error
      });
      // 表单校验
      if (err) {
        this.table.isOrderLoading = false;
      } else {
        // 请求接口
        await this.$api
          .getUserOrders(data)
          .then(res => {
            // 成功访问, 处理数据
            if (res.code === 1 && res.data) {
              // 加上key, 解决table组件渲染无key报错
              let list = [...res ?.data ?.pageData]
              let rList = []
              list.forEach((item, index) => {
                let obj =
                {
                  productName: item ?.product ?.productName || "",
                  orgNo: item ?.product ?.orgNo || "",
                  orderNo: item ?.orderNo || "",
                  price: item ?.product ?.price / 100 || "",
                  createTime: item ?.createTime || "",
                  status: item ?.status || 0,
                  key: index
                }
                rList = [...rList, obj]
              })
              this.table.orderList = rList
              this.table.orderPagination.total = res.data.dataTotal
            }
          });
        this.table.isOrderLoading = false;
      }
    }
  },
  filters: {
    transformStatus(status) {
      const list = statusList.filter(item => {
        return item.status === status
      })
      if (list.length > 0) {
        return list[0].label
      } else {
        return "未支付"
      }
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/style/mixin.scss";
#user-manager {
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
