/* eslint-disable no-use-before-define */
/* eslint-disable no-unused-vars */
interface ResponseDataType<T> { // http响应
    status: number;
    statusText: string;
    data: T;
}

interface ListType<T> {
    list: Array<T>;
    total: number;
}

interface tranceFileTypes {
    autonomous_rate: number,
    similar_rate: number,
    similar_block_num: number,
    target_file_num: number,
    open_source_project_num: number,
    file_info_list: Array<{
        'relative_path': string,
        'line_num': number,
        'line_similar_num': number,
        'function_line_num': number,
        'similar_code_index': Array<number>,
        'file_similarity': number
        isExpand: boolean,
        similar_code_list: Array<any>
    }>,
    similar_code_list: Array<{
        'target_code': string,
        'target_file_path': string,
        'target_line_number_start': number,
        'target_line_number_end': number,
        'os_project_name': string,
        'os_file_path': string,
        'os_line_number_start': number,
        'os_line_number_end': number,
        'similarity': number
    }>
}

/**
 * 对比记录
 */
interface ComparsionListItem {
    'subtask_id': string;
    'team_id': string;
    status: number;
    'main_file': string;
    'diff_file': string;
    similarity: number;
    'created_at': string;
    'user_name': string;
    'user_avatar': string;
}

/**
 * 反汇编函数列表
 */
interface BinaryFuncListItem {
    list: Array<{
        'diff_function_address': string;
        'diff_function_name': string;
        'is_hit': boolean;
        'main_function_address': string;
        'main_function_name': string;
        similarity: number;
    }>
}

/**
 * 函数代码
 */
interface FuncCode {
    main: {
        'function_name': string;
        'function_address': string;
        decompiled: string;
        disassembly: string;
    }
    diff: {
        'function_name': string;
        'function_address': string;
        decompiled: string;
        disassembly: string;
    }
}

/**
 * 详情概览
 */
interface OverviewData {
    'optional_num': number;
    'recommend_num': number;
    'strong_num': number;
    'comp_num': number;
    'leak_num': number;
    'high_num': number;
    'medium_num': number;
    'low_num': number;
    'critical_num': number;
    'license_num': number;
    'license_high_num': number;
    'license_medium_num': number;
    'license_low_num': number;
    'leak_comp_statistics': {
        'triggers_num': number;
        'online_num': number;
        'comp_poison_num': number;
        'vuln_poc_num': number;
        'vuln_not_cve_num': number;
        'vuln_sole_num': number;
        'vuln_cwe506_num': number;
    };
    'autonomous_statistics': {
        'total_hashed_files': number;
        'total_fragmented_files': number;
        'total_files': number;
        project_count: number
    };
    'sensitive_statistics': {
        level: {
            High: number;
            Low: number;
            Medium: number;
            'sensitive_list_truncated': number;
            total: number;
        };
        title: {
            [props: string]: number;
        };
    };
    'module_binary_analyze_statistics': {
        'file_num': number;
        'similarity_file_num': number;
    };
}

/**
 * 二进制同源列表
 */
interface BinaryList {
    'file_info_num': number;
    'file_info_list': Array<{
        filename: string;
        filepath: string;
        similarity: number;
        'homology_file_list': {
            name: string;
            filename: string;
            version: string;
            description: string;
            similarity: number;
            url: string;
        };
    }>;
}

/**
 * 风险文件
 */
interface RiskFile {
    'file_info_list': {
        'file_name': string;
        'file_type': string;
        'comp_count': number;
        'strong_num': number;
        'recommend_num': number;
        'optional_num': number;
        'critical_num': number;
        'high_num': number;
        'medium_num': number;
        'low_num': number;
    };
    'file_info_num': number;
}

/**
 * 真实利用漏洞
 */
type realUseVulnType = realUseVuln[]

interface realUseVuln {
  title: string
  level: string
  cve_id: string
  mps_id: string
//   data_streams: DataStream[]
}

type dataStreamType = {
    status: number,
    data_streams: dataStream[]
}

interface dataStream {
  file_stream: FileStream[]
  vul_verify: VulVerify
  poc_url: any[]
}

interface FileStream {
  file_name: string
  file_path: string
  code_list: CodeList[]
}

interface CodeList {
  index: number
  code: string
  line: number
  is_source: boolean
  is_sink: boolean
  is_func: boolean
  code_hash: string
  desc: string
  id: string,
  is_filter_func: boolean,
  subtask_id: string,
  project_id:string,
  pid: string,
  file_path: string,
  file_name: string,
  vul_verify: any
}

interface VulVerify {
  path: string
  Method: string
  params?: Param[]
}

interface Param {
  name: string
  type: string
  is_custom_type: boolean
  is_taint: boolean
}
