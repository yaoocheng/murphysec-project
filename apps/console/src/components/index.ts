import type { App } from 'vue';
import SvgIcon from 'comp/SvgIcon.vue';
import SuggestTips from './SuggestTips.vue';
import TipsComp from './TipsComp.vue';
import TagComp from './TagComp.vue';
import TableComp from './TableComp.vue';
import FormComp from './FormComp.vue';
import ExpandIcon from './ExpandIcon.vue';
import SelectComp from './SelectComp.vue';
import NoData from './NoData.vue';
import SearchComp from './SearchComp.vue';
import CheckboxComp from './CheckboxComp.vue';
import MinorBtn from './MinorBtn.vue';
import MainBtn from './MainBtn.vue';
import Tooltip from './Tooltip.vue';
import PageComp from './PageComp.vue';
import StatusComp from './StatusComp.vue';
import CommonHead from './CommonHead.vue';
import UserComp from './UserComp.vue';
import AvatarComp from './AvatarComp.vue';

const components:any = {
    CommonHead,
    SuggestTips,
    SvgIcon,
    TipsComp,
    TagComp,
    TableComp,
    FormComp,
    ExpandIcon,
    SelectComp,
    NoData,
    SearchComp,
    CheckboxComp,
    MinorBtn,
    Tooltip,
    PageComp,
    MainBtn,
    StatusComp,
    UserComp,
    AvatarComp,
};

export default {
    install: (Vue: App) => {
        // eslint-disable-next-line no-restricted-syntax, guard-for-in
        for (const key in components) {
            Vue.component(key, components[key]);
        }
    },
};
