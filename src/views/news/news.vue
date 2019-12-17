<template>
  <page-layout :desc="setting.desc"
               :title="setting.title"
               :linkList="setting.linkList"
               id="news">
    <div slot="extra"
         class="extraImg">
      <img :src="setting.extraImage" />
    </div>
    <transition name="page-toggle">
      <keep-alive>
        <a-card class="content">
          <a-button type="primary"
                    @click="onAdd">
            新增新闻
          </a-button>
          <!-- `table -->
          <a-table class="table"
                   :columns="table.columns"
                   :dataSource="table.newsList"
                   rowKey="id"
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
                         overlayClassName="overlay"
                         :autoAdjustOverflow="true">
                <p class="desc">
                  {{text}}
                </p>
              </a-tooltip>
            </template>
            <template slot="imageUrl"
                      slot-scope="text, record">
              <img :src="record.imageUrl && record.imageUrl.split(';')[0] || ''"
                   class="table-pics"
                   @click="onTablePreview(record.imageUrl)"
                   alt="图裂了">
            </template>
          </a-table>
        </a-card>
      </keep-alive>
    </transition>
    <a-modal class="add-modal"
             :visible="addForm.isVisible"
             title="新增新闻"
             okText="确定"
             cancelText="取消"
             @cancel="cancelAdd"
             @ok="saveAdd"
             :okButtonProps="{ props: { loading: addForm.isLoading } }">
      <!-- `addForm -->
      <a-form layout="vertical"
              :form="addForm.form">
        <a-form-item label="新闻标题">
          <a-input autoFocus
                   oninput="value=value.substr(0,20)"
                   v-decorator="[
                    'newsTitle',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写新闻标题'
                        }
                      ]
                    }
                  ]" />
        </a-form-item>
        <a-form-item label="新闻副标题">
          <a-input autoFocus
                   v-decorator="[
                    'newsSubhead',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写新闻副标题'
                        }
                      ]
                    }
                  ]" />
        </a-form-item>
        <a-form-item label="新闻图片">
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
        <a-form-item label="新闻内容">
          <a-input type="textarea"
                   rows="5"
                   style="resize:none;"
                   v-decorator="[
                    'content',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写新闻内容'
                        }
                      ]
                    }
                  ]" />
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal :visible="addForm.isPreviewVisible"
             :footer="null"
             :width="1080"
             @cancel="onPreviewCancel">
      <img alt="图裂了"
           :src="addForm.previewImage" />
    </a-modal>
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
      addForm: {
        // 新增form依赖
        form: this.$form.createForm(this, {
          name: "addForm"
        }),
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
      table: {
        // 项目列表
        newsList: [],
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
          pageSize: 4
        },
        // table标题列表
        columns: [
          {
            title: "ID",
            dataIndex: "id",
            width: 60,
            scopedSlots: { customRender: "id" },
            align: "center"
          },
          {
            title: "新闻标题",
            dataIndex: "title",
            width: 180,
            scopedSlots: { customRender: "title" },
          },
          {
            title: "新闻内容",
            dataIndex: "content",
            width: 400,
            scopedSlots: { customRender: "content" }
          },
          {
            title: "新闻图片",
            align: "center",
            width: 100,
            dataIndex: "imageUrl",
            scopedSlots: { customRender: "imageUrl" }
          },
          {
            title: "创建时间",
            width: 180,
            dataIndex: "createTime",
            scopedSlots: { customRender: "createTime" },
            align: "center"
          },
          {
            title: "阅读数",
            dataIndex: "viewCount",
            scopedSlots: { customRender: "viewCount" },
            width: 80,
            align: "center"
          },
          {
            title: "收藏数",
            width: 80,
            dataIndex: "collectCount",
            scopedSlots: { customRender: "collectCount" },
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
    // 上传
    onUpload(file) {
      this.imgUpload(file)
    },
    // 移除图片
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
    // 预览
    onUploadPreview(file) {
      this.addForm.previewImage = file.url || file.thumbUrl;
      this.addForm.isPreviewVisible = true;
    },
    // 取消预览
    onPreviewCancel() {
      this.addForm.isPreviewVisible = false;
    },
    // 图片预览
    onTablePreview(pics) {
      let url = pics.split(';')
      this.table.previewImage = url
      this.table.isPreviewVisible = true
    },
    // 改变页面
    onPageChange(pagination) {
      this.table.pagination.current = pagination.current
      this.getNews()
    },
    //api
    async imgUpload(file) {
      const formData = new FormData();
      formData.append('token', this.addForm.data.token)
      formData.append('file', file)
      await this.$api.imgUpload(formData).then(res => {
        // 成功访问, 处理数据
        if (res.code !== 966) {
          file.url = `http://user.duchengedu.com/${res ?.key}?attname=${file.name}`
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
          this.addForm.data.token = res ?.data ?.token || ""
        }
      })
    },
    // api
    async getNews() {
      this.table.isLoading = true;
      // 加载前清空相关数据
      this.table.newsList = [];
      // 接口参数
      let data = {
        pageSize: this.table.pagination.pageSize,
        pageNum: this.table.pagination.current
      }
      // 表单校验成功则继续
      // 检索缓存, 如果存在目标页面数据, 则不调用api,而使用缓存数据
      const cacheFilters = this.table.cacheList.filter(item => {
        return item.pageNum === data.pageNum
      })
      if (cacheFilters.length > 0) {
        this.table.newsList = cacheFilters[0].list
        this.table.pagination.total = cacheFilters[0].total
      } else {
        // 用于缓存已载入数据
        let cache = {
          pageNum: data.pageNum
        }
        // fetch api
        await this.$api.getNews(data).then(res => {
          // 成功访问, 处理数据
          if (res.code === 1 && res.data) {
            let list = res ?.data ?.pageData || []
            // 去除chirldren(会渲染出多层表格), 添加key( 解决table组件渲染无key报错)
            list.forEach((item, index) => {
              item.key = index
            });
            this.table.newsList = list;
            this.table.pagination.total = res ?.data ?.dataTotal || 1
            // 已载入数据进行缓存
            cache.list = list
            cache.total = res ?.data ?.dataTotal || 1
            this.table.cacheList.push(cache)
          }
        });
      }
      this.table.isLoading = false;
    },
    // 初始数据
    async initData() {
      await this.getUploadToken()
      this.getNews()
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
#news {
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
