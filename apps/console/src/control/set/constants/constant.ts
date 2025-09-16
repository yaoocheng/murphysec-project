import { ref } from 'vue';

export const sensitiveType = ref<Array<any>>([]);

export const sensitiveLevel = [{
    label: '高风险',
    value: 'High',
}, {
    label: '中风险',
    value: 'Medium',
}, {
    label: '低风险',
    value: 'Low',
}];

export const suggestOptions = [
    {
        label: '强烈建议修复',
        value: 4,
    },
    {
        label: '建议修复及以上',
        value: 3,
    },
    {
        label: '可选修复及以上',
        value: 2,
    },
];

export const levelOptions = [
    {
        label: '严重',
        value: 5,
    },
    {
        label: '高危及以上',
        value: 4,
    },
    {
        label: '中危及以上',
        value: 3,
    },
    {
        label: '低危及以上',
        value: 2,
    },
];

export const levelOption = [
    {
        label: '严重',
        value: 5,
    },
    {
        label: '高危',
        value: 4,
    },
    {
        label: '中危',
        value: 3,
    },
    {
        label: '低危',
        value: 2,
    },
];

export const languageFileExtensions = [
    {
        label: 'Java',
        value: {
            language: 'Java',
            file_extension: ['.java', '.class', '.jar'],
        },
    },
    {
        label: 'C/C++',
        value: {
            language: 'C/C++',
            file_extension: ['.c', '.h', '.cpp', '.hpp', '.cc', '.cxx', '.hxx', '.ixx'],
        },
    },
    {
        label: 'JavaScript',
        value: {
            language: 'JavaScript',
            file_extension: ['.js'],
        },
    },
    {
        label: 'TypeScript',
        value: {
            language: 'TypeScript',
            file_extension: ['.jtss'],
        },
    },
    {
        label: 'Python',
        value: {
            language: 'Python',
            file_extension: ['.py'],
        },
    },
    {
        label: 'C#',
        value: {
            language: 'C#',
            file_extension: ['.cs'],
        },
    },
    {
        label: 'Go',
        value: {
            language: 'Go',
            file_extension: ['.go'],
        },
    },
    {
        label: 'Objective-C',
        value: {
            language: 'Objective-C',
            file_extension: ['.m', '.h'],
        },
    },
    {
        label: 'Swift',
        value: {
            language: 'Swift',
            file_extension: ['.swift'],
        },
    },
    {
        label: 'Erlang',
        value: {
            language: 'Erlang',
            file_extension: ['.erl', '.hrl'],
        },
    },
    {
        label: 'PHP',
        value: {
            language: 'PHP',
            file_extension: ['.php'],
        },
    },
    {
        label: 'Scala',
        value: {
            language: 'Scala',
            file_extension: ['.scala'],
        },
    },
    {
        label: 'Ruby',
        value: {
            language: 'Ruby',
            file_extension: ['.rb'],
        },
    },
    {
        label: 'Perl',
        value: {
            language: 'Perl',
            file_extension: ['.pl', '.pm'],
        },
    },
    {
        label: 'R',
        value: {
            language: 'R',
            file_extension: ['.r'],
        },
    },
    {
        label: 'Rust',
        value: {
            language: 'Rust',
            file_extension: ['.rs'],
        },
    },
    {
        label: 'ArkTS',
        value: {
            language: 'ArkTS',
            file_extension: ['.ts'],
        },
    },
];
