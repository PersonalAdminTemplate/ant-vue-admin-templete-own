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
                <a-spin :spinning="searchForm.isBillLoading">
                  <a-form-item label="项目">
                    <a-select v-decorator="[
                              'billId',
                              {
                                initialValue: '全部',
                                rules: [{ required: true, message: '请选择项目' }]
                              }
                            ]"
                              placeholder="请选择项目"
                              showArrow>
                      <a-select-option style="width:100px;"
                                       v-for="(item, index) in searchForm.billList"
                                       :key="index"
                                       :title="item.billName"
                                       :value="item.id">
                        {{ item.billName }}
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
                   id="tabkle"
                   :columns="table.columns"
                   :dataSource="table.billList"
                   rowKey="id"
                   bordered
                   :pagination="table.pagination"
                   @change="onPageChange"
                   :loading="table.isLoading">
            <template v-for="col in [
                      'id',
                      'billId',
                      'orgNo',
                      'orgName',
                      'depart',
                      'studentName',
                      'contact',
                      'orderNo',
                      'payment',
                      'createTime']"
                      :slot="col"
                      slot-scope="text, record">
              <div :key="col">
                <template v-if="col === 'payment'">
                  <template v-if="record.payment === 1">
                    已付款
                  </template>
                  <template v-else>
                    未付款
                  </template>
                </template>
                <template v-else>{{ text }}</template>
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
        billList: [],
        // 部门列表
        departmentList: [],
        // 查询按钮loading
        isLoading: false,
        isSchoolLoading: false,
        isDepartLoading: false,
        isBillLoading: false
      },
      table: {
        // 项目列表
        billList: [],
        cacheList: [],
        // 表格loading
        isLoading: false,
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        },
        // table标题列表
        columns: [
          {
            title: "ID",
            dataIndex: "id",
            scopedSlots: { customRender: "id" },
            align: "center",
            width: 80
          },
          {
            title: "项目ID",
            dataIndex: "billId",
            scopedSlots: { customRender: "billId" },
            align: "center",
            width: 80
          },
          {
            title: "学校编号",
            dataIndex: "orgNo",
            scopedSlots: { customRender: "orgNo" },
            width: 100
          },
          {
            title: "学校名称",
            dataIndex: "orgName",
            scopedSlots: { customRender: "orgName" },
            width: 100
          },
          {
            title: "部门",
            dataIndex: "depart",
            scopedSlots: { customRender: "depart" },
            align: "center",
            width: 80
          },
          {
            title: "被缴费人",
            dataIndex: "studentName",
            scopedSlots: { customRender: "studentName" },
            align: "center",
            width: 100
          },
          {
            title: "联系电话",
            dataIndex: "contact",
            scopedSlots: { customRender: "contact" },
            align: "center",
            width: 100
          },
          {
            title: "订单号",
            dataIndex: "orderNo",
            scopedSlots: { customRender: "orderNo" },
            align: "center",
            width: 80
          },
          {
            title: "付款状态",
            dataIndex: "payment",
            scopedSlots: { customRender: "payment" },
            align: "center",
            width: 100
          },
          {
            title: "缴费时间",
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" },
            align: "center",
            width: 180
          }
        ]
      }
    };
  },
  methods: {
    // 查询
    async onSearch(e) {
      e && e.preventDefault()
      this.searchForm.isLoading = true;
      this.table.pagination.current = 1
      await this.getBillsBy()
      this.searchForm.isLoading = false;
    },
    // 学校改变 
    onSchoolChange(value, option) {
      this.searchForm.schoolCode = value
      this.getBillConfigBy()
      this.getSchoolDeparts()
    },
    // 页号改变
    async onPageChange(pagination) {
      this.table.pagination.current = pagination.current
      this.getBillsBy()
    },
    // api
    async findSchoolList() {
      this.searchForm.isSchoolLoading = true
      await this.$api.findSchoolList().then(res => {
        // 成功访问, 处理数据
        if (res.code === 1 && res.data) {
          this.searchForm.schoolCode = res ?.data[0] ?.schoolCode || "" // optional chaining
          this.searchForm.schoolList = res.data;
        }
      });
      this.searchForm.isSchoolLoading = false
    },
    // api
    async getBillConfigBy() {
      this.searchForm.isBillLoading = true
      await this.$api
        .getBillConfigBy({
          orgNo: this.searchForm.schoolCode,
          status: null
        })
        .then(res => {
          // 成功访问, 处理数据
          if (res.code === 1 && res.data) {
            let list = [{ billName: "全部", id: "全部" }]
            list = [...list, ...res.data]
            this.searchForm.billList = list;
          }
        });
      this.searchForm.isBillLoading = false
      this.searchForm.form.setFieldsValue({ billId: "全部" })
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
    async getBillsBy() {
      this.table.isLoading = true;
      // 加载前清空相关数据
      this.table.billList = [];
      // 接口参数
      let data = {
        pageNum: this.table.pagination.current,
        pageSize: this.table.pagination.pageSize,
        orgNo: this.searchForm.schoolCode
      }
      let err
      // 表单数据
      this.searchForm.form.validateFields((error, values) => {
        err = error
        data.billId = values.billId === "全部" ? null : values.billId
        data.depart = values.depart_name === "全部" ? null : values.depart_name
      });
      // 表单校验
      if (!err) {
        // 检索缓存, 如果存在目标页面数据, 则不调用api,而使用缓存数据
        const cacheFilters = this.table.cacheList.filter(item => {
          return item.pageNum === data.pageNum
            && item.orgNo === data.orgNo
            && item.billId === data.billId
            && item.depart === data.depart
        })

        if (cacheFilters.length > 0) {
          this.table.billList = cacheFilters[0].list
          this.table.pagination.total = cacheFilters[0].total
        } else {
          // 用于缓存已载入数据
          let cache = {
            pageNum: data.pageNum,
            orgNo: data.orgNo,
            billId: data.billId,
            depart: data.depart
          }
          // 请求接口
          await this.$api
            .getBillsBy(data)
            .then(res => {
              // 成功访问, 处理数据
              if (res.code === 1 && res.data) {
                this.table.billList = res ?.data ?.pageData || [] // optional chaining
                this.table.pagination.total = res ?.data ?.dataTotal || 10 // optional chaining
                // 已载入数据进行缓存
                cache.list = res.data.pageData
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
      await this.getBillConfigBy()
      await this.getSchoolDeparts()
      this.getBillsBy()
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
