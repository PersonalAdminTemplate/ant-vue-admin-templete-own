<template>
  <page-layout :desc="setting.desc"
               :title="setting.title"
               :linkList="setting.linkList"
               id="bill-record">
    <div slot="extra"
         class="extraImg">
      <img :src="setting.extraImage" />
    </div>
    <transition name="page-toggle">
      <keep-alive>
        <a-card class="content">
          <!-- `searchForm -->
          <a-form :form="searchForm.form"
                  id="search-form"
                  layout="inline"
                  @submit="onSearch">
            <a-row type="flex"
                   align="middle">
              <a-col>
                <a-spin :spinning="searchForm.isSchoolLoading">
                  <a-form-item label="学校">
                    <a-select v-decorator="[
                              'schoolCode',
                              {
                                initialValue: searchForm.schoolCode,
                                rules: [{ required: true, message: '请选择学校' }]
                              }
                            ]"
                              @change="onSchoolChange"
                              placeholder="请选择学校"
                              showArrow>
                      <a-select-option style="width:100px;"
                                       v-for="(item, index) in searchForm.schoolList"
                                       :key="index"
                                       :title="item.schoolName"
                                       :value="item.schoolCode">
                        {{ item.schoolName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-spin>
              </a-col>
              <a-col>
                <a-spin :spinning="searchForm.isProductLoading">
                  <a-form-item label="商品">
                    <a-select v-decorator="[
                              'productId',
                              {
                                initialValue: '全部',
                                rules: [{ required: true, message: '请选择商品' }]
                              }
                            ]"
                              placeholder="请选择项目"
                              showArrow>
                      <a-select-option style="width:100px;"
                                       v-for="(item, index) in searchForm.productList"
                                       :key="index"
                                       :title="item.productName"
                                       :value="item.id">
                        {{ item.productName }}
                      </a-select-option>
                    </a-select>
                  </a-form-item>
                </a-spin>
              </a-col>
              <a-col>
                <a-spin :spinning="searchForm.isDepartLoading">
                  <a-form-item label="部门">
                    <a-select v-decorator="[
                              'depart_name',
                              {
                                initialValue: '全部',
                                rules: [{ required: true, message: '请选择部门' }]
                              }
                            ]"
                              placeholder="请选择部门"
                              showArrow>
                      <a-select-option style="width:100px;"
                                       v-for="(item, index) in searchForm.departmentList"
                                       :key="index"
                                       :title="item.depart_name"
                                       :value="item.depart_name">
                        {{ item.depart_name }}
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
            </a-row>
          </a-form>
          <!-- `table -->
          <a-table class="table"
                   id="table"
                   :columns="table.columns"
                   :dataSource="table.productList"
                   rowKey="key"
                   bordered
                   :pagination="table.pagination"
                   @change="onPageChange"
                   :loading="table.isLoading">
            <template slot="payment">
              <div>
                <template>
                  已付款
                </template>
              </div>
            </template>
          </a-table>
        </a-card>
      </keep-alive>
    </transition>
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
        schoolList: [],
        // 学校code
        schoolCode: "",
        // 项目列表
        productList: [],
        // 部门列表
        departmentList: [],
        // 查询按钮loading
        isLoading: false,
        isSchoolLoading: false,
        isDepartLoading: false,
        isProductLoading: false
      },
      // 表格依赖
      table: {
        // 产品列表
        productList: [],
        // 缓存列表
        cacheList: [],
        // 表格loading
        isLoading: false,
        // 换页依赖
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        },
        // table表头
        columns: [
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
            title: "学生姓名",
            dataIndex: "student_name",
            scopedSlots: { customRender: "student_name" }
          },
          {
            title: "学号",
            dataIndex: "work_no",
            scopedSlots: { customRender: "work_no" }
          },
          {
            title: "部门名称",
            dataIndex: "depart_name",
            scopedSlots: { customRender: "depart_name" },
            align: "center"
          },
          {
            title: "家长联系方式",
            dataIndex: "account",
            scopedSlots: { customRender: "account" },
            align: "center"
          },
          {
            title: "订单金额",
            dataIndex: "orderPrice",
            scopedSlots: { customRender: "orderPrice" },
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
            dataIndex: "payment",
            scopedSlots: { customRender: "payment" },
            align: "center"
          }
        ]
      }
    };
  },
  methods: {
    // 查询
    async onSearch(e) {
      e.preventDefault()
      this.searchForm.isLoading = true;
      this.table.pagination.current = 1
      await this.getOrders()
      this.searchForm.isLoading = false;
    },
    // 学校改变 
    onSchoolChange(value, option) {
      this.searchForm.schoolCode = value
      this.getBillProductsByOrg()
      this.getSchoolDeparts()
    },
    // 页号改变
    onPageChange(pagination) {
      this.table.pagination.current = pagination.current
      this.getOrders()
    },
    // api
    async findSchoolList() {
      this.searchForm.isSchoolLoading = true
      await this.$api.findSchoolList().then(res => {
        // 成功访问, 处理数据
        if (res.code === 1 && res.data) {
          this.searchForm.schoolCode = res ?.data[0] ?.schoolCode || ""
          this.searchForm.schoolList = res.data;
        }
      });
      this.searchForm.isSchoolLoading = false
    },
    // api
    async getBillProductsByOrg() {
      this.searchForm.isProductLoading = true
      await this.$api
        .getBillProductsByOrg({
          orgNo: this.searchForm.schoolCode,
        })
        .then(res => {
          // 成功访问, 处理数据
          if (res.code === 1 && res.data) {
            let list = [{ productName: "全部", id: "全部" }]
            list = [...list, ...res.data]
            this.searchForm.productList = list;
          }
        });
      this.searchForm.isProductLoading = false
      this.searchForm.form.setFieldsValue({ productId: "全部" })
    },
    // api
    async getSchoolDeparts() {
      this.searchForm.isDepartLoading = true
      await this.$api
        .getSchoolDeparts({
          schoolCode: this.searchForm.schoolCode
        })
        .then(res => {
          // 成功访问, 处理数据
          if (res.code === 1 && res.data) {
            let list = [{ depart_name: "全部" }]
            list = [...list, ...res.data]
            this.searchForm.departmentList = list;
          }
        });
      this.searchForm.isDepartLoading = false
      this.searchForm.form.setFieldsValue({ depart_name: "全部" })
    },
    // api
    async getOrders() {
      this.table.isLoading = true;
      // 加载前清空相关数据
      this.table.productList = [];
      // 接口参数
      let data = {
        pageNum: this.table.pagination.current,
        pageSize: this.table.pagination.pageSize,
        orgNo: this.searchForm.schoolCode,
        status: 2
      }
      let err
      // 表单数据添加到参数中
      this.searchForm.form.validateFields((error, values) => {
        err = error
        data.productId = values.productId === "全部" ? null : values.productId
        data.depart = values.depart_name === "全部" ? null : values.depart_name
      });
      // 表单校验
      if (!err) {
        // 检索缓存, 如果存在目标页面数据, 则不调用api,而使用缓存数据
        const cacheFilters = this.table.cacheList.filter(item => {
          return item.pageNum === data.pageNum
            && item.orgNo === data.orgNo
            && item.productId === data.productId
            && item.depart === data.depart
        })

        if (cacheFilters.length > 0) {
          this.table.productList = cacheFilters[0].list
          this.table.pagination.total = cacheFilters[0].total
        } else {
          // 用于缓存已载入数据
          let cache = {
            pageNum: data.pageNum,
            orgNo: data.orgNo,
            productId: data.productId,
            depart: data.depart
          }
          // 请求接口
          await this.$api
            .getOrders(data)
            .then(res => {
              // 成功访问, 处理数据
              if (res.code === 1 && res.data) {
                // 加上key, 解决table组件渲染无key报错
                let list = [...(res ?.data ?.pageData || [])]
                list.forEach((item, index) => {
                  item.key = index
                })
                this.table.productList = list
                this.table.pagination.total = res.data.dataTotal
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
    // 初始化数据
    async initData() {
      this.table.isLoading = true
      await this.findSchoolList()
      this.getSchoolDeparts()
      this.getBillProductsByOrg()
      this.getOrders()
    },
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
#bill-record {
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
