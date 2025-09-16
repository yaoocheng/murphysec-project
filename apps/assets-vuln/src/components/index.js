import 'virtual:svg-icons-register';
import {
    QuestionCircleOutlined, EllipsisOutlined, MoreOutlined,
} from '@ant-design/icons-vue';
import Svg from './Svg.vue';
import Input from './Input.vue';
import Select from './Select.vue';
import TreeSelect from './TreeSelect.vue';
import User from './User.vue';
import SecIssueLevel from './SecIssueLevel.vue';
import MarkDown from './MarkDown.vue';
import Tag from './tag.vue';
import SecIssueDetail from './SecIssueDetail.vue';
import InfoCard from './InfoCard.vue';
import TextArea from './TextArea.vue';
import Empty from './Empty.vue';
import TreeSelectNew from './TreeSelectNew.vue';
import AppSearchSelect from './AppSearchSelect.vue';
import OperationLogModal from './OperationLogModal.vue';
import UserSelect from './UserSelect.vue';
import CodeEditor from './CodeEditor.vue';
import OrgTreeSelect from './OrgTreeSelect.vue';
import TextPopover from './TextPopover.vue';
import OrgTreeCheckSelect from './OrgTreeCheckSelect.vue';
import GlobalOrgTreeSelect from './GlobalOrgTreeSelect.vue';

const components = {
    Svg,
    Input,
    Select,
    TreeSelect,
    User,
    QuestionCircleOutlined,
    EllipsisOutlined,
    MoreOutlined,
    SecIssueLevel,
    MarkDown,
    Tag,
    SecIssueDetail,
    InfoCard,
    TextArea,
    Empty,
    TreeSelectNew,
    AppSearchSelect,
    OperationLogModal,
    UserSelect,
    CodeEditor,
    OrgTreeSelect,
    TextPopover,
    OrgTreeCheckSelect,
    GlobalOrgTreeSelect,
};

export default {
    install: (Vue) => {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const key in components) {
            Vue.component(key, components[key]);
        }
    },
};

export {
    Svg,
    Input,
    Select,
    TreeSelect,
    User,
    QuestionCircleOutlined,
    EllipsisOutlined,
    MoreOutlined,
    SecIssueLevel,
    MarkDown,
    Tag,
    SecIssueDetail,
    InfoCard,
    TextArea,
    Empty,
    TreeSelectNew,
    AppSearchSelect,
    OperationLogModal,
    UserSelect,
    CodeEditor,
    OrgTreeSelect,
    TextPopover,
    OrgTreeCheckSelect,
    GlobalOrgTreeSelect,
};
