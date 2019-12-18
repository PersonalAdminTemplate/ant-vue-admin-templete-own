<template>
  <page-layout id="news">
    <div slot="extra"
         class="extraImg">
      <img :src="setting.extraImage" />
    </div>
    <transition name="page-toggle">
      <keep-alive>
        <a-card class="content">
          <a-button type="primary"
                    @click="onAdd">
            新增Banner
          </a-button>
          <!-- `table -->
          <a-table class="table"
                   :columns="table.columns"
                   :dataSource="table.bannerList"
                   rowKey="id"
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
            <template slot="pic_url"
                      slot-scope="text, record">
              <img :src="record.pic_url && record.pic_url.split(';')[0] || ''"
                   class="table-pics"
                   @click="onTablePreview(record.pic_url)"
                   alt="图裂了">
            </template>
          </a-table>
        </a-card>
      </keep-alive>
    </transition>
    <a-modal class="add-modal"
             :visible="addForm.isVisible"
             title="新增Banner"
             okText="确定"
             cancelText="取消"
             @cancel="cancelAdd"
             @ok="saveAdd"
             :okButtonProps="{ props: { loading: addForm.isLoading } }">
      <!-- `addForm -->
      <a-form layout="vertical"
              :form="addForm.form">
        <a-form-item label="跳转链接">
          <a-input autoFocus
                   v-decorator="[
                    'jump_url',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写跳转链接'
                        }
                      ]
                    }
                  ]" />
        </a-form-item>
        <a-form-item label="跳转动作">
          <a-input autoFocus
                   v-decorator="[
                    'jump_action',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请填写跳转动作'
                        }
                      ]
                    }
                  ]" />
        </a-form-item>
        <a-form-item label="Banner图片">
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
        bannerList: [],
        // 表格loading
        isLoading: false,
        // 预览的图片
        previewImage: [],
        // 图片预览
        isPreviewVisible: false,
        // table标题列表
        columns: [
          {
            title: "ID",
            dataIndex: "id",
            scopedSlots: { customRender: "id" },
            align: "center"
          },
          {
            title: "跳转链接",
            dataIndex: "jump_url",
            scopedSlots: { customRender: "jump_url" },
          },
          {
            title: "跳转动作",
            dataIndex: "jump_action",
            scopedSlots: { customRender: "jump_action" }
          },
          {
            title: "banner图片",
            align: "center",
            dataIndex: "pic_url",
            scopedSlots: { customRender: "pic_url" }
          },
          {
            title: "TYPE",
            dataIndex: "type",
            scopedSlots: { customRender: "type" },
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
    //api
    async imgUpload(file) {
      const formData = new FormData();
      formData.append('token', this.addForm.data.token)
      formData.append('file', file)
      await this.$api.imgUpload(formData).then(res => {
        // 成功访问, 处理数据
        if (res.code !== 966) {
          file.url = `http://user.duchengedu.com/${res.key}?attname=${file.name}`
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
          this.addForm.data.token = res ?.data ?.token || "" // optional chaining
        }
      })
    },
    // api
    async getHomeBanner() {
      this.table.isLoading = true;
      // 加载前清空相关数据
      this.table.bannerList = [];
      // 请求接口
      await this.$api
        .getHomeBanner({})
        .then(res => {
          // 成功访问, 处理数据
          if (res.code === 1 && res.data) {
            this.table.bannerList = res.data;
          }
        });
      this.table.isLoading = false;
    },
    // 初始数据
    async initData() {
      await this.getUploadToken()
      this.getHomeBanner()
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
