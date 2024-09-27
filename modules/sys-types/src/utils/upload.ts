import AliOSS from "ali-oss";
import { FileUtil } from "./fileUtil";

const ossConfig = {
  // yourRegion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: "oss-cn-shenzhen",
  // 阿里云账号AccessKey拥有所有API的访问权限，风险很高。强烈建议您创建并使用RAM用户进行API访问或日常运维，请登录RAM控制台创建RAM用户。
  accessKeyId: "",
  accessKeySecret: "",
  bucket: "static-buck",
  endpoint: "oss-cn-shenzhen.aliyuncs.com",
};

const projectName = "blog-sys";

// const ossClient = new AliOSS(ossConfig);

interface UploadOptions {
  file: File;
  fileName?: string;
}
type MultipartUploadOptions = UploadOptions & AliOSS.MultipartUploadOptions;

export async function commonMultipartUpload({
  file,
  fileName,
  ...otherOptions
}: MultipartUploadOptions) {
  const fileUtil = new FileUtil(file);
  const ext = fileUtil.getFileExt(true);
  if (!fileName) fileName = fileUtil.getRandomFileName() + ext;

  // return ossClient.multipartUpload(`blog-sys/${fileName}`, file, {
  //   // 获取分片上传进度、断点和返回值。
  //   progress: (p, cpt, res) => {
  //     console.log("===========commonMultipartUpload==========", p, cpt, res);
  //   },
  //   // 设置并发上传的分片数量。
  //   parallel: 4,
  //   // 设置分片大小。默认值为1 MB，最小值为100 KB。
  //   partSize: 1024 * 1024,
  //   // headers,
  //   // 自定义元数据，通过HeadObject接口可以获取Object的元数据。
  //   // meta: { year: 2020, people: "test" },
  //   // mime: "text/plain",
  //   ...otherOptions,
  // });
}
