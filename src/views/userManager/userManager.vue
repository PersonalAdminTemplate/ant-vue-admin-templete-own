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
                <a-spin :spinning="searchForm.isSchoolLoading">
                  <a-form-item style="width:100%"
                               label="学校">
                    <a-select v-decorator="[
                              'schoolCode',
                              {
                                initialValue: searchForm.schoolCode,
                                rules: [{ required: true }]
                              }
                            ]"
                              placeholder="请选择学校"
                              @change='onSchoolChange'
                              showArrow>
                      <a-select-option v-for="(item, index) in searchForm.schoolList"
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
                <a-form-item label="角色">
                  <a-radio-group name="role"
                                 v-decorator="[
                      'role',
                      {
                        rules: [
                          {
                            required: true
                          }
                        ],
                        initialValue: 1
                      }
                    ]">
                    <a-radio :value="1">家长</a-radio>
                    <a-radio :value="2">老师</a-radio>
                    <a-radio :value="3">管理员</a-radio>
                  </a-radio-group>
                </a-form-item>
              </a-col>
              <a-col>
                <a-form-item label="账户">
                  <a-input @change="onAccountChange"
                           oninput="value=value.replace(/[^\d]/g,'')"
                           v-decorator="['account', { initialValue: '' }]" />
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
          <!-- `table -->
          <a-table class="table"
                   :pagination="table.pagination"
                   :columns="table.columns"
                   :dataSource="table.list"
                   rowKey="userId"
                   @change="onPageChange"
                   bordered
                   :loading="table.isLoading">
            <template v-for="col in [
                'id',
                'schoolCode',
                'billName',
                'description',
                'role',
                'createTime',
                'updateTime'
              ]"
                      :slot="col"
                      slot-scope="text, record">
              <div :key="col">
                <template v-if="col === 'role'">
                  <template v-if="record.role === 1">
                    家长
                  </template>
                  <template v-if="record.role === 2">
                    老师
                  </template>
                  <template v-if="record.role === 3">
                    管理员
                  </template>
                </template>
                <template v-else>{{ text }}</template>
              </div>
            </template>
            <template slot="operation"
                      slot-scope="text, record">
              <div class="editable-row-operations">
                <span>
                  <a @click="() => onEdit(record.userId)">修改</a>
                </span>
                <span style="margin-left:12px;">
                  <a @click="() => onBind(record)">绑定班级</a>
                </span>
              </div>
            </template>
          </a-table>
        </a-card>
      </keep-alive>
    </transition>
    <!-- `editForm -->
    <a-modal class="change-modal"
             :visible="editForm.isVisible"
             title="修改用户信息"
             okText="确定"
             cancelText="取消"
             @cancel="cancelEdit"
             @ok="saveEdit"
             :okButtonProps="{ props: { loading: editForm.isLoading } }">
      <a-form layout="vertical"
              :form="editForm.form">
        <a-col>
          <a-form-item :wrapperCol="{span:12}"
                       label="学校">
            <a-select v-decorator="[
                        'orgno',
                        {
                          initialValue: searchForm.schoolCode,
                          rules: [{ required: true }]
                        }
                      ]"
                      placeholder="请选择学校"
                      showArrow>
              <a-select-option v-for="(item, index) in searchForm.schoolList"
                               :key="index"
                               :title="item.schoolName"
                               :value="item.schoolCode">
                {{ item.schoolName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="角色">
            <a-radio-group name="role"
                           v-decorator="[
                      'role',
                      {
                        rules: [
                          {
                            required: true
                          }
                        ],
                        initialValue: editForm.data.role
                      }
                    ]">
              <a-radio :value="1">家长</a-radio>
              <a-radio :value="2">老师</a-radio>
              <a-radio :value="3">管理员</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col>
          <a-form-item label="手机号码"
                       :wrapperCol="{span:12}">
            <a-input oninput="value=value.replace(/[^\d]/g,'')"
                     v-decorator="['phone', {
                        rules: [
                          {
                            required: true,
                            message: '请输入手机号码'
                          },
                        ], initialValue: editForm.data.phone }]" />
          </a-form-item>
        </a-col>
      </a-form>
    </a-modal>
    <!-- `bindForm -->
    <a-modal :visible="bindForm.isVisible"
             title="修改班级信息"
             okText="确定"
             cancelText="取消"
             @cancel="bindForm.isVisible = false"
             @ok="saveBind"
             :okButtonProps="{ props: { loading: bindForm.isLoading } }">
      <a-card hoverable
              style="width: 100%">
        <a-card-meta :title="bindForm.data.nickName || '###'">
          <a-avatar slot="avatar"
                    :src="bindForm.data.headPic" />
          <template slot="description">
            <h4><span style="font-weight:800;margin-right:8px;">学校名称:</span> {{bindForm.data.orgName || "#####"}}</h4>
            <h4><span style="font-weight:800;margin-right:8px;">手机号码:</span> {{bindForm.data.phone|| "################"}}</h4>
            <h4><span style="font-weight:800;margin-right:8px;">角色:</span> {{bindForm.data.roleName||"###"}}</h4>
          </template>
        </a-card-meta>
      </a-card>
      <a-form layout="vertical"
              style="margin-top:20px;"
              :form="bindForm.form">
        <a-form-item label="班级:"
                     style="width: 100%">
          <a-checkbox-group v-decorator="['clazz',{initialValue: bindForm.clazzList}]"
                            class="overlay">
            <a-checkbox :value="item.depart_name"
                        v-for="(item, index) in bindForm.departmentList"
                        :key="index">
              {{item.depart_name}}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
const roleMap = ["家长", "老师", "管理员"]
// 数组差集a-b
function difference(a, b) {
  if (!(a instanceof Array) || !(b instanceof Array)) {
    console.error('参数不是数组！')
    return false
  }
  return a.filter(function (v) { return b.indexOf(v) === -1 })
}

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
        //学校列表
        schoolList: [],
        // 学校code
        schoolCode: "",
        // 查询账户
        account: "",
        isSchoolLoading: false
      },
      editForm: {
        // 修改form依赖
        form: this.$form.createForm(this, {
          name: "changeForm"
        }),
        // 修改确定loading
        isLoading: false,
        // 是否显示修改form
        isVisible: false,
        // 修改按钮依赖数据
        data: {}
      },
      bindForm: {
        // form依赖
        form: this.$form.createForm(this, {
          name: "bindFrom"
        }),
        isLoading: false,
        // 是否显示form
        isVisible: false,
        // 按钮依赖数据
        data: {},
        departmentList: [],
        clazzList: []
      },
      // `table
      table: {
        // 表格loading
        isLoading: false,
        // 用户列表
        list: [],
        cacheList: [],
        pagination: {
          total: 0,
          current: 1,
          pageSize: 10
        },
        // table标题列表
        columns: [
          {
            title: "ID",
            dataIndex: "userId",
            scopedSlots: { customRender: "userId" },
            align: "center"
          },
          {
            title: "昵称",
            dataIndex: "nickName",
            scopedSlots: { customRender: "nickName" },
            align: "center"
          },
          {
            title: "学校编码",
            dataIndex: "orgno",
            scopedSlots: { customRender: "orgno" },
            align: "center"
          },
          {
            title: "手机号码",
            dataIndex: "phone",
            scopedSlots: { customRender: "phone" },
            align: "center"
          },
          {
            title: "角色",
            dataIndex: "role",
            scopedSlots: { customRender: "role" },
            align: "center"
          },
          {
            title: "创建时间",
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" },
            align: "center"
          },
          {
            title: "更新时间",
            dataIndex: "lastUpdateTime",
            scopedSlots: { customRender: "lastUpdateTime" },
            align: "center"
          },
          {
            title: "登录时间",
            dataIndex: "lastLoginTime",
            scopedSlots: { customRender: "lastLoginTime" },
            align: "center"
          },
          {
            title: "操作",
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" },
            align: "center"
          }
        ]
      }
    };
  },
  methods: {
    // 搜索
    async onSearch(e) {
      e.preventDefault();
      this.searchForm.isLoading = true;
      this.table.pagination.current = 1
      if (this.searchForm.account ?.length || -1 > 0) {
        await this.findUser();
      } else {
        await this.getUsers();
      }
      this.getSchoolDeparts()
      this.searchForm.isLoading = false;
    },
    // 学校改变 
    onSchoolChange(value) {
      this.searchForm.schoolCode = value
    },
    // 查询账户改变
    onAccountChange(e) {
      const value = e.target.value
      this.searchForm.account = value
    },
    // 修改
    onEdit(userId) {
      const newData = [...this.table.list];
      const target = newData.filter(item => userId === item.userId)[0];
      if (target) {
        this.editForm.data = target;
      }
      this.editForm.form.resetFields()
      this.editForm.isVisible = true;
    },
    // 修改.保存
    async saveEdit() {
      let isSuccess = await this.updateUserInfo()
      if (isSuccess) {
        this.table.cacheList = []
        this.table.pagination.current = 1
      }
      // 清空缓存, 否则会导致修改的信息不呈现
      this.getUsers();
    },
    // 修改.取消
    cancelEdit() {
      this.editForm.data = {};
      this.editForm.isVisible = false;
    },
    onBind(record) {
      record.orgName = this.searchForm.schoolList.filter(item => {
        return item.schoolCode === record.orgno
      })[0].schoolName
      record.roleName = roleMap[record.role - 1]
      this.bindForm.data = record
      this.getTeacherClazzList()
      this.bindForm.isVisible = true
    },
    async saveBind() {
      this.bindForm.isLoading = true
      await this.updateClazzList()
      this.bindForm.isLoading = false
    },
    onPageChange(pagination) {
      this.table.pagination.current = pagination.current
      this.getUsers()
    },
    // api
    async updateClazzList() {
      const beforeList = this.bindForm.clazzList
      let afterList = []
      this.bindForm.form.validateFields((err, value) => {
        afterList = value.clazz
      })
      // 计算删除的班级
      const deleteList = difference(beforeList, afterList)
      // 计算新增的班级
      const addList = difference(afterList, beforeList)
      await this.$api.addClassRelationV3({
        userId: this.bindForm.data.userId,
        classList: addList
      }).then(res => {
        // 成功访问, 处理数据
      });
      await this.$api.deleteClassRelationV2({
        userId: this.bindForm.data.userId,
        classList: deleteList
      }).then(res => {
        // 成功访问, 处理数据
        if (res.code === 1) {
          this.$message.success("修改成功");
          this.bindForm.isVisible = false;
          this.table.cacheList = []
          this.getUsers()
        }
      });
    },
    // api
    async updateUserInfo() {
      this.editForm.isLoading = true;
      // 接口参数
      let data;
      let err;
      let isSuccess
      // 表单数据添加到参数中
      this.editForm.form.validateFields((error, values) => {
        err = error;
        data = {
          userId: this.editForm.data.userId,
          phone: values.phone,
          role: values.role,
          orgno: values.orgno
        };
      });
      // 表单校验
      if (err) {
        this.editForm.isLoading = false;
      } else {
        // 请求接口
        await this.$api.updateUserInfo(data).then(res => {
          // 成功访问, 处理数据
          if (res.code === 1) {
            this.$message.success("修改成功");
            isSuccess = true
          }
        });
        // 成功访问, 处理数据
        this.editForm.data = {};
        this.editForm.isLoading = false;
        this.editForm.isVisible = false;
      }
      return isSuccess
    },
    // api
    async getUsers() {
      this.table.isLoading = true;
      // 加载前清空相关数据
      this.table.list = [];
      // 接口参数
      let data = {
        pageSize: this.table.pagination.pageSize,
        pageNum: this.table.pagination.current
      }
      let isSuccess = false
      let err
      this.searchForm.form.validateFields((error, values) => {
        err = error
        data.orgno = values.schoolCode;
        data.role = values.role;
      });
      // 表单校验成功则继续
      if (!err) {
        // 检索缓存, 如果存在目标页面数据, 则不调用api,而使用缓存数据
        const cacheFilters = this.table.cacheList.filter(item => {
          return item.pageNum === data.pageNum
            && item.role === data.role
            && item.orgno === data.orgno
        })
        if (cacheFilters.length > 0) {
          this.table.list = cacheFilters[0].list
          this.table.pagination.total = cacheFilters[0].total
        } else {
          // 用于缓存已载入数据
          let cache = {
            pageNum: data.pageNum,
            role: data.role,
            orgno: data.orgno
          }
          // fetch api
          await this.$api.getUsers(data).then(res => {
            // 成功访问, 处理数据
            if (res.code === 1 && res.data) {
              isSuccess = true
              let list = res ?.data ?.pageData || []
              // 去除chirldren(会渲染出多层表格), 添加key( 解决table组件渲染无key报错)
              list.forEach((item, index) => {
                item.children && delete item.children;
                item.key = index
              });
              this.table.list = list;
              this.table.pagination.total = res ?.data ?.dataTotal || 1
              // 已载入数据进行缓存
              cache.list = list
              cache.total = res ?.data ?.dataTotal || 1
              this.table.cacheList.push(cache)
            }
          });
        }
      }

      this.table.isLoading = false;
      return isSuccess
    },
    // api
    async findUser() {
      this.table.isLoading = true;
      // 加载前清空相关数据
      this.table.list = [];
      let data = { account: this.searchForm.account };
      await this.$api.findUser(data).then(res => {
        // 成功访问, 处理数据
        if (res.code === 1) {
          let result = res ?.data || null
          result ?.children && delete result.children
          result && this.table.list.push(result)
          this.searchForm.schoolCode = result.orgno
          // this.searchForm.form.setFieldsValue({ schoolCode: this.searchForm.schoolCode })
          this.searchForm.form.resetFields(['schoolCode'])
          this.table.pagination.total = 1
        }
      });
      this.table.isLoading = false;
    },
    // api
    async findSchoolList() {
      this.searchForm.isSchoolLoading = true
      await this.$api.findSchoolList().then(res => {
        // 成功访问, 处理数据
        if (res.code === 1 && res.data) {
          this.searchForm.schoolList = res.data;
          this.searchForm.schoolCode = res ?.data[0] ?.schoolCode || ""
        }
      });
      this.searchForm.isSchoolLoading = false
    },
    // api
    async getTeacherClazzList() {
      this.bindForm.isSchoolLoading = true
      const data = {
        userId: this.bindForm.data.userId
      }
      await this.$api.getTeacherClazzList(data).then(res => {
        // 成功访问, 处理数据
        if (res.code === 1 && res.data) {
          this.bindForm.clazzList = res.data
          this.bindForm.form.resetFields(['clazz'])
        }
      });
      this.bindForm.isSchoolLoading = false
    },
    // api
    async getSchoolDeparts() {
      const data = {}
      this.searchForm.form.validateFields((error, values) => {
        data.schoolCode = values.schoolCode;
      })
      await this.$api
        .getSchoolDeparts(data)
        .then(res => {
          // 成功访问, 处理数据
          if (res.code === 1 && res.data) {
            this.bindForm.departmentList = res.data;
          }
        });
      this.bindForm.form.setFieldsValue({ depart_name: "全部" })
    },
    async initData() {
      await this.findSchoolList()
      this.getUsers()
      this.getSchoolDeparts()
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
.overlay {
  width: 100%;
  overflow-y: auto;
  height: 270px;
}
.overlay::-webkit-scrollbar {
  width: 4px;
}
.overlay::-webkit-scrollbar-thumb {
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.24);
}
.overlay::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255);
  border-radius: 0;
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
