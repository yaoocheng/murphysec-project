import { h } from 'vue';
import { Modal } from 'ant-design-vue';
import warningIcon from '/src/assets/svg/data/icon_warning_colorful-dm.svg';

export function useDeleteConfirm() {
    const showDeleteConfirm = (options) => {
        const {
            record,
            onDelete,
            onSuccess,
            title = '确认删除此数据吗？',
            content = '数据删除后将不可恢复，请谨慎操作！',
            // successmessage = '操作成功',
            errormessage = '',
        } = options;

        Modal.confirm({
            class: 'delete-confirm-modal',
            title,
            icon: h('span', {
                role: 'img',
                'aria-label': 'exclamation-circle',
                class: 'anticon anticon-exclamation-circle',
            }, [
                h('img', { src: warningIcon, alt: '信息图标' }),
            ]),
            content,
            async onOk() {
                try {
                    const { data } = await onDelete(record);
                    console.log(data, 'delete');
                    // message.success(successmessage);
                    onSuccess(data.data);
                } catch (err) {
                    console.log('删除失败', err, errormessage);
                }
            },
        });
    };

    return {
        showDeleteConfirm,
    };
}
