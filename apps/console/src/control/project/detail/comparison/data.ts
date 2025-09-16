import { ref } from 'vue';

// eslint-disable-next-line import/prefer-default-export
export const activeTab = ref<number>(0);

export const isShowDiff = ref<boolean>(false);

export const compareData = ref<any>({});

export const otherCompareData = ref<any>({
    project: '',
    task: '',
});

export const ids = ref<any>({
    fid: '',
    sid: '',
});

export const treehandle = (tree:any[], upPath: string) => {
    if (!tree?.length) return;

    tree.forEach((item:any) => {
        item.path = `${upPath}/${item.name}`;

        treehandle(item.children, item.path);
    });
};
