<template>
  <page-layout :desc="setting.desc"
               :title="setting.title"
               :linkList="setting.linkList"
               id="mall">
    <div slot="extra"
         class="extraImg">
      <img :src="setting.extraImage" />
    </div>
    <!-- #main -->
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
                    <a-select v-decorator="['clazz',{initialValue: searchForm.className,
                              rules: [{ required: true, message: '请选择班级' }]}]"
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
                  新增作业
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
            <template slot="operation"
                      slot-scope="text, record">
              <div class="editable-row-operations">
                <span>
                  <a @click="() => onDelete(record.id)"
                     style="color:#f5222d;">删除</a>
                </span>
              </div>
            </template>
            <template slot="content"
                      slot-scope="text">
              <a-tooltip placement="bottomRight"
                         :title="text"
                         :autoAdjustOverflow="true">
                <p class="desc">
                  {{text}}
                </p>
              </a-tooltip>
            </template>
            <template slot="category"
                      slot-scope="text">
              {{text | formatSubject}}
            </template>
            <template slot="pics"
                      slot-scope="text, record">
              <img :src="record.pics.split(',')[0]"
                   class="table-pics"
                   @click="onTablePreview(record.pics)"
                   alt="图裂了">
            </template>
          </a-table>
        </a-card>
      </keep-alive>
    </transition>
    <a-modal class="add-modal"
             :visible="addForm.isVisible"
             title="新增作业"
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
          <a-select v-decorator="['clazz',{rules: [{ required: true, message: '请选择班级' }]}]"
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
        <a-form-item label="科目">
          <a-select v-decorator="['category',{rules: [{ required: true, message: '请选择科目' }]}]"
                    placeholder="请选择科目"
                    showArrow>
            <a-select-option style="width:100px;"
                             v-for="(item, index) in addForm.categorys"
                             :key="index"
                             :title="item.subject"
                             :value="item.id">
              {{ item.subject }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item label="作业图片">
          <div>
            <a-upload :action="addForm.action"
                      listType="picture-card"
                      :data="addForm.data"
                      :fileList="addForm.fileList"
                      :beforeUpload="beforeUpload"
                      :remove="onFileRemove"
                      @preview="onUploadPreview">
              <div id="dev">
                <a-icon type="plus" />
                <div class="ant-upload-text">上传</div>
              </div>
            </a-upload>
          </div>
        </a-form-item>
        <a-form-item label="作业内容">
          <a-input type="textarea"
                   rows="5"
                   style="resize:none;"
                   v-decorator="['content',{rules: [{required: true,message: '请填写作业内容'}]}]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <!-- `addPreview -->
    <a-modal :visible="addForm.isPreviewVisible"
             :footer="null"
             :width="1080"
             @cancel="onPreviewCancel">
      <img alt="图裂了"
           :src="addForm.previewImage" />
    </a-modal>
    <!-- `tablePreview -->
    <a-modal :visible="table.isPreviewVisible"
             :footer="null"
             :width="1080"
             @cancel="table.isPreviewVisible = false">
      <a-carousel arrows
                  dotsClass="slick-dots slick-thumb">
        <a slot="customPaging"
           slot-scope="props">
          <img :src="table.previewImage[props.i]" />
        </a>
        <div v-for="(item,index) in table.previewImage"
             :key="index">
          <img :src="item" />
        </div>
      </a-carousel>
    </a-modal>
  </page-layout>
</template>

<script>
import PageLayout from "@/layouts/PageLayout";
const categorys = [
  { id: 1, subject: '语文' },
  { id: 2, subject: '数学' },
  { id: 3, subject: '英语' },
  { id: 4, subject: '地理' },
  { id: 5, subject: '生物' },
  { id: 6, subject: '历史' },
  { id: 7, subject: '政治' },
  { id: 8, subject: '物理' },
  { id: 9, subject: '化学' }
]
export default {
  name: "QueryList",
  components: { PageLayout },
  data() {
    return {
      // #setting全局配置
      setting: {
        title: "",
        desc: "",
        linkList: [],
        extraImage: ""
      },
      // #searchForm查询form
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
      // #addForm
      addForm: {
        // 新增form依赖
        form: this.$form.createForm(this, {
          name: "addForm"
        }),
        // 科目列表
        categorys,
        // 图片上传地址
        action: 'https://upload.qiniup.com',
        // 上传依赖参数
        data: { token: '' },
        // 文件列表
        fileList: [],
        // 是否显示新增form
        isVisible: false,
        // 新增确定loading
        isLoading: false,
        // 是否显示上传预览
        isPreviewVisible: false,
        // 预览地址
        previewImage: ''
      },
      // `table
      table: {
        // 项目列表
        list: [],
        // 缓存
        cacheList: [],
        // 表格loading
        isLoading: false,
        // 预览的图片
        previewImage: [],
        // 图片预览
        isPreviewVisible: false,
        // 分页依赖
        pagination: {
          current: 1,
          total: 1,
          pageSize: 10
        },
        // table标题列表
        columns: [
          {
            title: "日期",
            dataIndex: "createTime",
            width: 180,
            scopedSlots: { customRender: "createTime" },
            align: "center"
          },
          {
            title: "科目",
            dataIndex: "category",
            align: "center",
            width: 80,
            scopedSlots: { customRender: "category" },
          },
          {
            title: "班级",
            dataIndex: "clazz",
            width: 80,
            align: "center",
            scopedSlots: { customRender: "clazz" }
          },
          {
            title: "作业内容",
            width: 400,
            dataIndex: "content",
            scopedSlots: { customRender: "content" }
          },
          {
            title: "作业图片",
            width: 80,
            dataIndex: "pics",
            scopedSlots: { customRender: "pics" },
            align: "center"
          },
          {
            title: "操作",
            dataIndex: "operation",
            scopedSlots: { customRender: "operation" },
            width: 80,
            align: "center"
          }
        ]
      }
    };
  },
  filters: {
    formatSubject(id) {
      let list = categorys.filter(item => {
        return item.id === (id - 0)
      })
      if (list.length > 0) {
        return list[0].subject
      } else {
        return "全部"
      }
    }
  },
  methods: {
    // 删除
    onDelete(id) {
      this.$info({
        title: '此功能还未启用',
        onOk() { }
      });
    },
    // 添加
    onAdd() {
      this.addForm.isVisible = true;
    },
    // 添加.保存
    async saveAdd() {
      let isSuccess = await this.createHomework()
      if (isSuccess) {
        this.table.cacheLIst = []
        this.table.pagination.current = 1
      }
      this.getUserHomeworks()
    },
    // 添加.取消
    cancelAdd() {
      this.addForm.isVisible = false;
    },
    // 查询
    async onSearch(e) {
      e.preventDefault();
      this.searchForm.isLoading = true;
      this.table.pagination.current = 1;
      await this.getUserHomeworks();
      this.searchForm.isLoading = false;
    },
    // 上传
    onUpload(file) {
      this.imgUpload(file)
    },
    // 移除预备上传的图片
    onFileRemove(file) {
      let list = this.addForm.fileList.filter(item => {
        return item.uid !== file.uid
      })
      this.addForm.fileList = list
    },
    // 自定义上传
    beforeUpload(file) {
      this.onUpload(file)
      return false
    },
    // 上传预览
    onUploadPreview(file) {
      this.addForm.previewImage = file.url || file.thumbUrl;
      this.addForm.isPreviewVisible = true;
    },
    // 取消预览
    onPreviewCancel() {
      this.addForm.isPreviewVisible = false;
    },
    // table中的图片预览
    onTablePreview(pics) {
      let url = pics.split(',')
      this.table.previewImage = url
      this.table.isPreviewVisible = true
    },
    // 改变页面
    onPageChange(pagination) {
      this.table.pagination.current = pagination.current
      this.getUserHomeworks()
    },
    // api
    async createHomework() {
      this.addForm.isLoading = true;
      // 接口参数
      let data
      let err
      let isSuccess = false
      // 表单数据添加到参数中
      this.addForm.form.validateFields((error, values) => {
        err = error;
        data = {
          senderId: this.$store.state.account.userInfo.userId,
          clazz: values.clazz,
          category: values.category,
          content: values.content,
          pics: this.pics,
        };
      });
      // 表单校验
      if (!err) {
        // 请求接口
        await this.$api.createHomework(data).then(res => {
          // 成功访问, 处理数据
          if (res.code === 1) {
            this.$message.success("新增成功");
            isSuccess = true
          }
        });
        // 成功访问, 处理数据
        this.addForm.isVisible = false;
        // 清理缓存
        this.addForm.fileList = []
        this.table.cacheList = []
      }
      this.addForm.isLoading = false;
      return isSuccess
    },
    //api
    async imgUpload(file) {
      const formData = new FormData();
      formData.append('token', this.addForm.data.token)
      formData.append('file', file)
      await this.$api.imgUpload(formData).then(res => {
        // 成功访问, 处理数据
        if (res.code !== 966) {
          file.url = `http://user.duchengedu.com/${res ?.key || ""}?attname=${file.name}`
          file.status = "done"
          this.addForm.fileList = [...this.addForm.fileList, file]
        }
      })
    },
    //api
    async getUploadToken() {
      this.$api.getUploadToken().then(res => {
        // 成功访问, 处理数据
        if (res.code === 1 && res.data) {
          this.addForm.data.token = res.data ?.token || ""
        }
      })
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
    async getUserHomeworks() {
      this.table.isLoading = true;
      // 加载前清空相关数据
      this.table.list = [];
      // 接口参数
      let data = {
        pageSize: this.table.pagination.pageSize,
        pageNum: this.table.pagination.current,
        userId: this.$store.state.account.userInfo.userId,
        // 0.通用1.语文2.数学3.英语4.地理5.生物6.历史7.政治8.物理9.化学
        category: 0,
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
            && item.category === data.category
        })
        if (cacheFilters.length > 0) {
          this.table.list = cacheFilters[0].list
          this.table.pagination.total = cacheFilters[0].total
        } else {
          // 用于缓存已载入数据
          let cache = {
            pageNum: data.pageNum,
            clazz: data.clazz,
            userId: data.userId,
            category: data.category,
          }
          // fetch api
          await this.$api.getUserHomeworks(data).then(res => {
            // 成功访问, 处理数据
            if (res.code === 1 && res.data) {
              let list = res ?.data ?.pageData || []
              //添加key( 解决table组件渲染无key报错)
              list.forEach((item, index) => {
                item.key = index
              });
              this.table.list = list
              this.table.pagination.total = res.data ?.dataTotal || 1
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
      this.getUploadToken()
      await this.getClassByUserId()
      this.getUserHomeworks()
    }
  },
  async created() {
    this.$npStart()

    await this.initData()
    this.$npDone()
  },
  computed: {
    pics() {
      let list = this.addForm.fileList.map(item => {
        return item.url
      })
      return list.join(',')
    }
  }
};
</script>
<style lang="scss">
@import "../../assets/style/mixin.scss";
#mall {
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
  .table-pics {
    width: 60px;
    height: 60px;
  }
  .desc {
    @include ellipsis(3);
  }
}
</style>
<style scoped>
.ant-carousel >>> .slick-dots {
  height: auto;
}
.ant-carousel >>> .slick-slide img {
  border: 5px solid #fff;
  display: block;
  margin: auto;
  max-width: 80%;
}
.ant-carousel >>> .slick-thumb {
  bottom: -45px;
}
.ant-carousel >>> .slick-thumb li {
  width: 60px;
  height: 45px;
}
.ant-carousel >>> .slick-thumb li img {
  width: 100%;
  height: 100%;
  filter: grayscale(100%);
}
.ant-carousel >>> .slick-thumb li.slick-active img {
  filter: grayscale(0%);
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
