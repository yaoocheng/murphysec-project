/* eslint-disable camelcase */
import default_file from 'ast/fileImg/default_file.svg';
import file_type_binary from 'ast/fileImg/file_type_binary.svg';
import file_type_bundler from 'ast/fileImg/file_type_bundler.svg';
import file_type_cargo from 'ast/fileImg/file_type_cargo.svg';
import file_type_composer from 'ast/fileImg/file_type_composer.svg';
import file_type_conan from 'ast/fileImg/file_type_conan.svg';
import file_type_go_package from 'ast/fileImg/file_type_go_package.svg';
import file_type_gradle from 'ast/fileImg/file_type_gradle.svg';
import file_type_jar from 'ast/fileImg/file_type_jar.svg';
import file_type_json from 'ast/fileImg/file_type_json.svg';
import file_type_maven from 'ast/fileImg/file_type_maven.svg';
import file_type_npm from 'ast/fileImg/file_type_npm.svg';
import file_type_perl from 'ast/fileImg/file_type_perl.svg';
import file_type_pip from 'ast/fileImg/file_type_pip.svg';
import file_type_r from 'ast/fileImg/file_type_r.svg';
import file_type_xml from 'ast/fileImg/file_type_xml.svg';
import file_type_yarn from 'ast/fileImg/file_type_yarn.svg';
import file_type_zip from 'ast/fileImg/file_type_zip.svg';
import file_type_js from 'ast/fileImg/file_type_js.svg';
import file_type_rpm from 'ast/fileImg/file_type_rpm.svg';
import file_type_python from 'ast/fileImg/file_type_python.svg';
import file_type_nuget from 'ast/fileImg/file_type_nuget.svg';
import file_type_deb from 'ast/fileImg/file_type_deb.svg';
import file_type_android from 'ast/fileImg/file_type_android.svg';
import file_type_c2 from 'ast/fileImg/file_type_c2.svg';
import file_type_cheader from 'ast/fileImg/file_type_cheader.svg';
import file_type_cpp2 from 'ast/fileImg/file_type_cpp2.svg';
import file_type_cppheader from 'ast/fileImg/file_type_cppheader.svg';
import file_type_csharp from 'ast/fileImg/file_type_csharp.svg';
import file_type_css from 'ast/fileImg/file_type_css.svg';
import file_type_erlang2 from 'ast/fileImg/file_type_erlang2.svg';
import file_type_go from 'ast/fileImg/file_type_go.svg';
import file_type_html from 'ast/fileImg/file_type_html.svg';
import file_type_java from 'ast/fileImg/file_type_java.svg';
import file_type_kotlin from 'ast/fileImg/file_type_kotlin.svg';
import file_type_less from 'ast/fileImg/file_type_less.svg';
import file_type_objectivec from 'ast/fileImg/file_type_objectivec.svg';
import file_type_perl2 from 'ast/fileImg/file_type_perl2.svg';
import file_type_php from 'ast/fileImg/file_type_php.svg';
import file_type_ruby from 'ast/fileImg/file_type_ruby.svg';
import file_type_rust from 'ast/fileImg/file_type_rust.svg';
import file_type_scala from 'ast/fileImg/file_type_scala.svg';
import file_type_swift from 'ast/fileImg/file_type_swift.svg';
import file_type_typescript from 'ast/fileImg/file_type_typescript.svg';
import file_type_vue from 'ast/fileImg/file_type_vue.svg';

// sbom文件图标
export const FILE_ICON: { [propName: string]: any } = {
    default_file,
    file_type_binary,
    file_type_bundler,
    file_type_cargo,
    file_type_composer,
    file_type_conan,
    file_type_go_package,
    file_type_gradle,
    file_type_jar,
    file_type_json,
    file_type_maven,
    file_type_npm,
    file_type_perl,
    file_type_pip,
    file_type_r,
    file_type_xml,
    file_type_yarn,
    file_type_zip,
    file_type_js,
    file_type_rpm,
    file_type_python,
    file_type_nuget,
    file_type_deb,
    file_type_android,
    file_type_c2,
    file_type_cheader,
    file_type_cpp2,
    file_type_cppheader,
    file_type_csharp,
    file_type_css,
    file_type_erlang2,
    file_type_go,
    file_type_html,
    file_type_java,
    file_type_kotlin,
    file_type_less,
    file_type_objectivec,
    file_type_perl2,
    file_type_php,
    file_type_ruby,
    file_type_rust,
    file_type_scala,
    file_type_swift,
    file_type_typescript,
    file_type_vue,
};

export const FILENAME_JSON: { [propName: string]: string } = {
    'package.json': 'file_type_npm',
    'package-lock.json': 'file_type_npm',
    'npm-shrinkwrap.json': 'file_type_npm',
    gemfile: 'file_type_bundler',
    'gemfile.lock': 'file_type_bundler',
    'composer.json': 'file_type_composer',
    'composer.lock': 'file_type_composer',
    'go.sum': 'file_type_go_package',
    'go.mod': 'file_type_go_package',
    pipfile: 'file_type_pip',
    'pipfile.lock': 'file_type_pip',
    'requirements.txt': 'file_type_pip',
    'pom.xml': 'file_type_maven',
    'yarn.lock': 'file_type_yarn',
    '.yarnrc': 'file_type_yarn',
    'cargo.toml': 'file_type_cargo',
    'cargo.lock': 'file_type_cargo',
    'conanfile.txt': 'file_type_conan',
    'conanfile.py': 'file_type_conan',
    'renv.lock': 'file_type_r',
    'meta.json': 'file_type_perl',
    'build.gradle.kts': 'file_type_gradle',
};

export const FILETYPE_JSON: { [propName: string]: string } = {
    a: 'file_type_binary',
    app: 'file_type_binary',
    bin: 'file_type_binary',
    cmo: 'file_type_binary',
    cmx: 'file_type_binary',
    cma: 'file_type_binary',
    cmxa: 'file_type_binary',
    cmi: 'file_type_binary',
    dll: 'file_type_binary',
    exe: 'file_type_binary',
    hl: 'file_type_binary',
    ilk: 'file_type_binary',
    lib: 'file_type_binary',
    n: 'file_type_binary',
    ndll: 'file_type_binary',
    o: 'file_type_binary',
    obj: 'file_type_binary',
    pyc: 'file_type_binary',
    pyd: 'file_type_binary',
    pyo: 'file_type_binary',
    pdb: 'file_type_binary',
    scpt: 'file_type_binary',
    scptd: 'file_type_binary',
    so: 'file_type_binary',
    gradle: 'file_type_gradle',
    jar: 'file_type_jar',
    zip: 'file_type_zip',
    rar: 'file_type_zip',
    '7z': 'file_type_zip',
    tar: 'file_type_zip',
    tgz: 'file_type_zip',
    bz: 'file_type_zip',
    gz: 'file_type_zip',
    bzip2: 'file_type_zip',
    xz: 'file_type_zip',
    bz2: 'file_type_zip',
    zipx: 'file_type_zip',
    json: 'file_type_json',
    xml: 'file_type_xml',
    js: 'file_type_js',
    ear: 'file_type_jar',
    war: 'file_type_jar',
    egg: 'file_type_python',
    whl: 'file_type_python',
    deb: 'file_type_deb',
    rpm: 'file_type_rpm',
    gem: 'file_type_bundler',
    apk: 'file_type_android',
    nupkg: 'file_type_nuget',

    py: 'file_type_python',
    java: 'file_type_java',
    jsp: 'file_type_java',
    c: 'file_type_c2',
    h: 'file_type_cheader',
    cpp: 'file_type_cpp2',
    hpp: 'file_type_cppheader',
    hh: 'file_type_cppheader',
    hxx: 'file_type_cppheader',
    'h++': 'file_type_cppheader',
    cs: 'file_type_csharp',
    ts: 'file_type_typescript',
    tsx: 'file_type_typescript',
    go: 'file_type_go',
    php: 'file_type_php',
    php3: 'file_type_php',
    php4: 'file_type_php',
    php5: 'file_type_php',
    kt: 'file_type_kotlin',
    kts: 'file_type_kotlin',
    rb: 'file_type_ruby',
    swift: 'file_type_swift',
    html: 'file_type_html',
    htm: 'file_type_html',
    css: 'file_type_css',
    erl: 'file_type_erlang2',
    pl: 'file_type_perl2',
    rs: 'file_type_rust',
    m: 'file_type_objectivec',
    scala: 'file_type_scala',
    vue: 'file_type_vue',
    less: 'file_type_less',
};

export const getFileImg = (filename: string) => {
    if (filename) {
        if (FILENAME_JSON[filename]) {
            return FILE_ICON[FILENAME_JSON[filename]];
        }
        const filenameArr = filename.split('.');
        if (FILETYPE_JSON[filenameArr[filenameArr.length - 1]]) {
            return FILE_ICON[FILETYPE_JSON[filenameArr[filenameArr.length - 1]]];
        }
        return FILE_ICON.default_file;
    }
};
