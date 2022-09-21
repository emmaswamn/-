import {  ref} from 'vue'

export const assignDialogVisible = ref(false);


export const treeProps = {
    children: 'children',
    label: 'authName',
};


export const getDefKeys = function(node: any, arr:any[]) {
    if(!node.children) {
        arr.push(node.id);
        return;
    }

    node.children.forEach((item:any) => {
        getDefKeys(item, arr);
    });
};


