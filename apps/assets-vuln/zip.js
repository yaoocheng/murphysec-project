const fs = require('fs');
const archiver = require('archiver'); // 快速导出压缩包 需要安装依赖 archiver

const homedir = __dirname;// 这里是当前目录路径

// 默认在当前目录路径生成此文件 asv.zip
const output = fs.createWriteStream(`${homedir}/asv.zip`);
const archive = archiver('zip', {
    zlib: { level: 9 }, // 设置压缩级别
});
archive.pipe(output);

archive.directory('asv/', false); // 将指定文件夹中文件全部压缩，并且文件都在根路径

archive.finalize();

archive.on('error', (err) => {
    throw err;
});

output.on('close', () => {
    console.log(`生成文件大小${(archive.pointer() / 1024 / 1024).toFixed(1)}MB; 请在当前项目路径下寻找 asv.zip 文件,系统路径为 ${homedir}\\asv.zip`);
});
