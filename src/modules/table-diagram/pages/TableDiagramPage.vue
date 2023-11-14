<template>
    <TableDiagram />
</template>

<script lang="ts">
import { ElLoading } from 'element-plus';
import { Options, Vue } from 'vue-class-component';
import TableDiagram from '../components/TableDiagram.vue';
import { tableDiagramModule } from '../store';

@Options({
    name: 'table-diagram-component',
    components: {
        TableDiagram,
    },
})
export default class TableDiagramPage extends Vue {
    created(): void {
        tableDiagramModule.clearQueryString();
        this.getTableList();
    }

    async getTableList(): Promise<void> {
        const loading = ElLoading.service({
            target: '.content',
        });
        await tableDiagramModule.getTables();
        loading.close();
    }
}
</script>
