<template>
  <div>
    <!-- 文件上传 -->
    <el-upload
      class="upload-demo"
      ref="excelUpload"
      action="#"
      :file-list="fileList"
      drag
      :limit="1"
      :on-exceed="limitHandle"
      :on-remove="handleRemove"
      :on-change="changeUploadHandle"
      :auto-upload="false"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div slot="tip" class="el-upload__tip">
        只能上传.xlxs/.xls文件，且不超过500kb
      </div>
    </el-upload>
    <el-row class="all-center all-margin-top-15">
      <el-button @click="btnCancelTheDialog">取 消</el-button>
      <el-button type="primary" @click="btnConfirmUpload">确 定</el-button>
    </el-row>
  </div>
</template>

<script>
import xlsx from "xlsx";
import getStrName from "@/utils/dataConversion/index.js";
import resultTable from "@/views/components/resultTable";
import { parseTime } from "@/utils/ruoyi";
export default {
  props: {
    fatherDialogVisible: {
      type: Boolean,
    },
    postExcelTable: {
      type: Array,
    },
  },
  data() {
    return {
      //上传对话框
      upLoadDialogVisible: false,
      fileList: [],

      excelTableData: [],
    };
  },
  created() {},
  methods: {
    //导入对话框
    btnOpenUploadDialog() {
      this.upLoadDialogVisible = true;
    },
    //确认上传
    btnConfirmUpload() {
      if (this.excelTableData.length == 0) {
        return this.$message({
          type: "warning",
          message: "还没传Excel呢",
        });
      }
      this.$emit("update:postExcelTable", this.excelTableData);
      this.$emit("update:fatherDialogVisible", false);
    },
    //上传
    changeUploadHandle(file, filelist) {
      //判断是否是这个类型的文件
      if (this.RegXlsxFile(file.name)) {
        this.handleTheFile(file.raw);
      } else {
        this.$message({
          type: "error",
          message: "只能传.xls/.xlxs/.csv文件",
        });
        this.$refs.excelUpload.clearFiles();
      }
    },
    limitHandle(files, fileList) {
      this.$message({
        type: "error",
        message: "一次只能传一个Excel表格",
      });
    },
    handleRemove(file, fileList) {
      this.excelTableData = [];
      this.$message({
        type: "warning",
        message: "移除成功！",
      });
    },
    RegXlsxFile(fileName) {
      return /\.(xlsx|xls|csv)$/.test(fileName);
    },

    handleTheFile(file) {
      //文件解析
      new Promise((resolve, reject) => {
        let reader = new FileReader();
        //二进制读取
        reader.readAsBinaryString(file);
        //读取成功后在onload里面执行
        reader.onload = (ev) => {
          resolve(ev.target.result);
        };
      }).then((binaryData) => {
        //插件读取二进制数据
        let workbook = xlsx.read(binaryData, { type: "binary" });
        console.log(workbook);
        //获取指定的表格
        let worksheet = workbook.Sheets[workbook.SheetNames[0]];
        //调用提供的Api转化为Josn数据
        let jsonDataArr = xlsx.utils.sheet_to_json(worksheet);
        console.log(jsonDataArr);
        let shiftArr = [];
        jsonDataArr.forEach((item) => {
          let tempArr = {};
          Object.keys(item).forEach((key) => {
            tempArr[getStrName(key)] = item[key];
          });
          shiftArr.push(tempArr);
        });

        this.excelTableData = shiftArr.map((item) => {
          return {
            ...item,
            planEndTime: this.formatExcelDate(item.planEndTime, "-"),
          };
        });
      });
    },
    //转化excel时间
    formatExcelDate(numb, format = "-") {
      const time = new Date((numb - 1) * 24 * 3600000 + 1);
      time.setYear(time.getFullYear() - 70);
      const year = time.getFullYear() + "";
      const month = time.getMonth() + 1 + "";
      const date = time.getDate() - 1 + "";
      if (format && format.length === 1) {
        return year + format + month + format + date;
      }
      return (
        year +
        (month < 10 ? "0" + month : month) +
        (date < 10 ? "0" + date : date)
      );
    },
    //取消父组件的对话框
    btnCancelTheDialog() {
      this.$emit("update:fatherDialogVisible", false);
    },
  },
};
</script>

<style></style>
